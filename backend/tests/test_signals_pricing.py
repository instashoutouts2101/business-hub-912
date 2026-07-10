"""Verify signals_starter price update ($29 -> $200) end-to-end backend."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL")
if not BASE_URL:
    # Fallback to frontend/.env
    with open("/app/frontend/.env") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip()
                break
BASE_URL = BASE_URL.rstrip("/")


@pytest.fixture(scope="module")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# --- Packages endpoint ---
class TestServicePackages:
    def test_get_packages_returns_signals_starter_at_200(self, api):
        r = api.get(f"{BASE_URL}/api/services/packages", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert "packages" in data
        pkgs = {p["id"]: p for p in data["packages"]}

        # signals_starter must be $200
        assert "signals_starter" in pkgs
        assert pkgs["signals_starter"]["amount"] == 200.00, \
            f"signals_starter amount should be 200.0, got {pkgs['signals_starter']['amount']}"
        assert pkgs["signals_starter"]["currency"] == "usd"

        # signals_pro unchanged at $79
        assert "signals_pro" in pkgs
        assert pkgs["signals_pro"]["amount"] == 79.00

        # signals_premium unchanged at $149
        assert "signals_premium" in pkgs
        assert pkgs["signals_premium"]["amount"] == 149.00


# --- Checkout with server-side price enforcement ---
class TestSignalsStarterCheckout:
    def test_checkout_signals_starter_creates_stripe_session_at_200(self, api):
        origin = BASE_URL
        r = api.post(
            f"{BASE_URL}/api/payments/checkout/session",
            json={
                "package_id": "signals_starter",
                "origin_url": origin,
            },
            timeout=30,
        )
        assert r.status_code == 200, f"Checkout failed: {r.status_code} {r.text}"
        data = r.json()
        assert "url" in data
        assert "session_id" in data
        assert "checkout.stripe.com" in data["url"], \
            f"Not a Stripe URL: {data['url']}"

        sid = data["session_id"]

        # Verify status endpoint reports amount=200
        rs = api.get(
            f"{BASE_URL}/api/payments/checkout/status/{sid}",
            timeout=15,
        )
        assert rs.status_code == 200
        sdata = rs.json()
        # amount_total in stripe is in main currency units per backend impl (as seen in iteration_1 note)
        assert sdata.get("amount_total") == 200.0, \
            f"Expected amount_total=200.0, got {sdata.get('amount_total')} full: {sdata}"
        assert sdata.get("currency", "").lower() == "usd"
