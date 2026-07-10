from fastapi import FastAPI, APIRouter, HTTPException, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import Optional, List
import uuid
from datetime import datetime, timezone

from emergentintegrations.payments.stripe.checkout import (
    StripeCheckout,
    CheckoutSessionResponse,
    CheckoutStatusResponse,
    CheckoutSessionRequest,
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# MongoDB connection
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

CONTACT_EMAIL = os.environ.get("CONTACT_EMAIL", "globensloutions@gmail.com")
STRIPE_API_KEY = os.environ.get("STRIPE_API_KEY", "sk_test_emergent")

app = FastAPI(title="Globen Solutions API")
api_router = APIRouter(prefix="/api")

# ============================================================
# Fixed Server-Side Service Packages (prevents price manipulation)
# ============================================================
SERVICE_PACKAGES = {
    "consult_30": {
        "id": "consult_30",
        "name": "30-Minute Discovery Call",
        "amount": 49.00,
        "currency": "usd",
        "description": "A focused 30-minute call to review your financial goals.",
    },
    "consult_60": {
        "id": "consult_60",
        "name": "60-Minute Strategy Session",
        "amount": 149.00,
        "currency": "usd",
        "description": "In-depth strategy session covering portfolio review and planning.",
    },
    "portfolio_review": {
        "id": "portfolio_review",
        "name": "Full Portfolio Audit",
        "amount": 349.00,
        "currency": "usd",
        "description": "Comprehensive audit of your holdings with a written report.",
    },
    "wealth_plan": {
        "id": "wealth_plan",
        "name": "Personal Wealth Plan",
        "amount": 799.00,
        "currency": "usd",
        "description": "A tailored multi-year wealth strategy including tax optimization.",
    },
}

# ============================================================
# Models
# ============================================================
class ContactCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=40)
    subject: Optional[str] = Field(None, max_length=200)
    message: str = Field(..., min_length=5, max_length=4000)


class Contact(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: Optional[str] = None
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class CheckoutRequest(BaseModel):
    package_id: str
    origin_url: str
    customer_email: Optional[EmailStr] = None
    customer_name: Optional[str] = None


class CheckoutResponse(BaseModel):
    url: str
    session_id: str


class PaymentStatusResponse(BaseModel):
    session_id: str
    status: str
    payment_status: str
    amount_total: float
    currency: str
    package_id: Optional[str] = None


# ============================================================
# Routes
# ============================================================
@api_router.get("/")
async def root():
    return {"message": "Globen Solutions API", "status": "ok"}


@api_router.get("/health")
async def health():
    return {"status": "healthy"}


# --- Services ---
@api_router.get("/services/packages")
async def list_packages():
    return {"packages": list(SERVICE_PACKAGES.values())}


# --- Contact ---
@api_router.post("/contact", response_model=Contact)
async def create_contact(payload: ContactCreate):
    contact = Contact(**payload.model_dump())
    doc = contact.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    doc["recipient"] = CONTACT_EMAIL
    doc["status"] = "new"
    await db.contact_submissions.insert_one(doc)
    logger.info(
        "New contact submission from %s <%s> -> recipient %s",
        contact.name,
        contact.email,
        CONTACT_EMAIL,
    )
    # NOTE: To actually deliver an email, plug in Resend / SendGrid / SMTP here.
    # Currently we persist submissions to MongoDB and expose them via GET /contact/submissions
    return contact


@api_router.get("/contact/submissions", response_model=List[Contact])
async def list_submissions():
    docs = (
        await db.contact_submissions.find({}, {"_id": 0})
        .sort("created_at", -1)
        .to_list(500)
    )
    for d in docs:
        if isinstance(d.get("created_at"), str):
            d["created_at"] = datetime.fromisoformat(d["created_at"])
    return docs


# --- Payments ---
@api_router.post("/payments/checkout/session", response_model=CheckoutResponse)
async def create_checkout_session(payload: CheckoutRequest, request: Request):
    if payload.package_id not in SERVICE_PACKAGES:
        raise HTTPException(status_code=400, detail="Invalid package selected")

    pkg = SERVICE_PACKAGES[payload.package_id]
    origin = payload.origin_url.rstrip("/")
    success_url = f"{origin}/payment/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{origin}/services"

    host_url = str(request.base_url)
    webhook_url = f"{host_url}api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)

    metadata = {
        "package_id": pkg["id"],
        "package_name": pkg["name"],
        "customer_email": payload.customer_email or "",
        "customer_name": payload.customer_name or "",
        "source": "globens_web",
    }

    checkout_request = CheckoutSessionRequest(
        amount=float(pkg["amount"]),
        currency=pkg["currency"],
        success_url=success_url,
        cancel_url=cancel_url,
        metadata=metadata,
    )

    try:
        session: CheckoutSessionResponse = await stripe_checkout.create_checkout_session(
            checkout_request
        )
    except Exception as e:
        logger.exception("Stripe session creation failed")
        raise HTTPException(status_code=500, detail=f"Stripe error: {e}")

    tx_doc = {
        "id": str(uuid.uuid4()),
        "session_id": session.session_id,
        "package_id": pkg["id"],
        "package_name": pkg["name"],
        "amount": float(pkg["amount"]),
        "currency": pkg["currency"],
        "customer_email": payload.customer_email or "",
        "customer_name": payload.customer_name or "",
        "metadata": metadata,
        "payment_status": "initiated",
        "status": "open",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.payment_transactions.insert_one(tx_doc)

    return CheckoutResponse(url=session.url, session_id=session.session_id)


@api_router.get("/payments/checkout/status/{session_id}", response_model=PaymentStatusResponse)
async def get_checkout_status(session_id: str, request: Request):
    tx = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")

    # If already finalized, return stored status (idempotent)
    if tx.get("payment_status") in {"paid", "expired", "failed"}:
        return PaymentStatusResponse(
            session_id=session_id,
            status=tx.get("status", "complete"),
            payment_status=tx["payment_status"],
            amount_total=float(tx.get("amount", 0)),
            currency=tx.get("currency", "usd"),
            package_id=tx.get("package_id"),
        )

    host_url = str(request.base_url)
    webhook_url = f"{host_url}api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)

    try:
        status: CheckoutStatusResponse = await stripe_checkout.get_checkout_status(session_id)
    except Exception as e:
        logger.exception("Stripe status check failed")
        raise HTTPException(status_code=500, detail=f"Stripe error: {e}")

    await db.payment_transactions.update_one(
        {"session_id": session_id},
        {
            "$set": {
                "status": status.status,
                "payment_status": status.payment_status,
                "updated_at": datetime.now(timezone.utc).isoformat(),
            }
        },
    )

    return PaymentStatusResponse(
        session_id=session_id,
        status=status.status,
        payment_status=status.payment_status,
        amount_total=float(status.amount_total) / 100.0,
        currency=status.currency,
        package_id=tx.get("package_id"),
    )


@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    body = await request.body()
    signature = request.headers.get("Stripe-Signature", "")
    host_url = str(request.base_url)
    webhook_url = f"{host_url}api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    try:
        event = await stripe_checkout.handle_webhook(body, signature)
    except Exception as e:
        logger.exception("Webhook verification failed")
        raise HTTPException(status_code=400, detail=str(e))

    if event.session_id:
        await db.payment_transactions.update_one(
            {"session_id": event.session_id},
            {
                "$set": {
                    "payment_status": event.payment_status,
                    "status": "complete" if event.payment_status == "paid" else "open",
                    "updated_at": datetime.now(timezone.utc).isoformat(),
                    "webhook_event": event.event_type,
                }
            },
        )
    return {"received": True}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
