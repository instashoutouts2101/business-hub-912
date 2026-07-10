from fastapi import FastAPI, APIRouter, HTTPException, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
import logging
import resend
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

CONTACT_EMAIL = os.environ.get("CONTACT_EMAIL", "globensolutions@gmail.com")
STRIPE_API_KEY = os.environ.get("STRIPE_API_KEY", "sk_test_emergent")
RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "")
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

app = FastAPI(title="Globen Solutions API")
api_router = APIRouter(prefix="/api")

# ============================================================
# Fixed Server-Side Service Packages (prevents price manipulation)
# ============================================================
SERVICE_PACKAGES = {
    "signals_starter": {
        "id": "signals_starter",
        "name": "Starter · Forex only",
        "amount": 29.00,
        "currency": "usd",
        "description": "3 curated Forex signals per week with entry, SL and TP on WhatsApp.",
    },
    "signals_pro": {
        "id": "signals_pro",
        "name": "Pro · Forex + Comex + Indices",
        "amount": 79.00,
        "currency": "usd",
        "description": "Daily signals across all three streams, delivered via WhatsApp and email.",
    },
    "signals_premium": {
        "id": "signals_premium",
        "name": "Premium · All streams + 1-on-1",
        "amount": 149.00,
        "currency": "usd",
        "description": "Real-time signals, priority alerts and a monthly 1-on-1 strategy review.",
    },
    "consult_30": {
        "id": "consult_30",
        "name": "30-Minute Discovery Call",
        "amount": 49.00,
        "currency": "usd",
        "description": "A focused 30-minute call to review your financial goals.",
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


class LeadCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    whatsapp: str = Field(..., min_length=5, max_length=40)


class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    whatsapp: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ============================================================
# Email helper (Resend)
# ============================================================
def _send_email_sync(subject: str, body_text: str, body_html: str, to_email: str) -> bool:
    """Blocking Resend call. Runs inside asyncio.to_thread from route handlers.
    Returns True on success, False on failure (logged)."""
    if not RESEND_API_KEY:
        logger.warning("RESEND_API_KEY not configured; skipping email.")
        return False
    try:
        resp = resend.Emails.send({
            "from": f"Globen Solutions <{SENDER_EMAIL}>",
            "to": [to_email],
            "subject": subject,
            "html": body_html,
            "text": body_text,
        })
        logger.info("Resend accepted email id=%s to=%s", resp.get("id"), to_email)
        return True
    except Exception:
        logger.exception("Resend send failed")
        return False


async def send_email(subject: str, body_text: str, body_html: str, to_email: str) -> None:
    """Fire-and-forget email dispatch."""
    await asyncio.to_thread(_send_email_sync, subject, body_text, body_html, to_email)


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
    # Fire-and-forget email delivery to the business inbox
    subject = f"New contact — {contact.name} ({contact.subject or 'General enquiry'})"
    plain = (
        f"New contact submission via Globen Solutions website\n\n"
        f"Name:    {contact.name}\n"
        f"Email:   {contact.email}\n"
        f"Phone:   {contact.phone or '-'}\n"
        f"Subject: {contact.subject or '-'}\n\n"
        f"Message:\n{contact.message}\n"
    )
    html = f"""
    <div style="font-family:Segoe UI,Arial,sans-serif;color:#111;">
      <h2 style="margin:0 0 12px;color:#0B0E14;">New contact submission</h2>
      <p style="color:#555;margin:0 0 20px;">Received via <strong>globen-solutions.com</strong></p>
      <table style="border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:6px 12px;color:#666;">Name</td><td style="padding:6px 12px;"><strong>{contact.name}</strong></td></tr>
        <tr><td style="padding:6px 12px;color:#666;">Email</td><td style="padding:6px 12px;"><a href="mailto:{contact.email}">{contact.email}</a></td></tr>
        <tr><td style="padding:6px 12px;color:#666;">Phone</td><td style="padding:6px 12px;">{contact.phone or '-'}</td></tr>
        <tr><td style="padding:6px 12px;color:#666;">Subject</td><td style="padding:6px 12px;">{contact.subject or '-'}</td></tr>
      </table>
      <hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />
      <div style="white-space:pre-wrap;font-size:14px;line-height:1.6;">{contact.message}</div>
    </div>
    """
    asyncio.create_task(send_email(subject, plain, html, CONTACT_EMAIL))
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


# --- Leads (homepage quick-lead form) ---
@api_router.post("/leads", response_model=Lead)
async def create_lead(payload: LeadCreate):
    lead = Lead(**payload.model_dump())
    doc = lead.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    doc["recipient"] = CONTACT_EMAIL
    doc["source"] = "homepage_lead_form"
    await db.lead_submissions.insert_one(doc)
    logger.info("New lead: %s <%s> whatsapp=%s", lead.name, lead.email, lead.whatsapp)

    subject = f"New discovery-call lead — {lead.name}"
    plain = (
        f"New lead from Globen Solutions homepage form\n\n"
        f"Name:     {lead.name}\n"
        f"Email:    {lead.email}\n"
        f"WhatsApp: {lead.whatsapp}\n"
        f"When:     {lead.created_at.isoformat()}\n"
    )
    wa_digits = "".join(ch for ch in lead.whatsapp if ch.isdigit())
    wa_link = f"https://wa.me/{wa_digits}" if wa_digits else "#"
    html = f"""
    <div style="font-family:Segoe UI,Arial,sans-serif;color:#111;">
      <h2 style="margin:0 0 12px;color:#0B0E14;">New discovery-call lead</h2>
      <p style="color:#555;margin:0 0 20px;">Received via the Globen Solutions homepage form.</p>
      <table style="border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:6px 12px;color:#666;">Name</td><td style="padding:6px 12px;"><strong>{lead.name}</strong></td></tr>
        <tr><td style="padding:6px 12px;color:#666;">Email</td><td style="padding:6px 12px;"><a href="mailto:{lead.email}">{lead.email}</a></td></tr>
        <tr><td style="padding:6px 12px;color:#666;">WhatsApp</td><td style="padding:6px 12px;"><a href="{wa_link}">{lead.whatsapp}</a></td></tr>
      </table>
      <p style="margin-top:20px;">
        <a href="{wa_link}" style="background:#00C805;color:#000;padding:10px 18px;text-decoration:none;font-weight:600;border-radius:4px;display:inline-block;">Open WhatsApp chat</a>
      </p>
    </div>
    """
    asyncio.create_task(send_email(subject, plain, html, CONTACT_EMAIL))
    return lead


@api_router.get("/leads", response_model=List[Lead])
async def list_leads():
    docs = (
        await db.lead_submissions.find({}, {"_id": 0})
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
