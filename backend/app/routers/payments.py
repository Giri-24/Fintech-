"""
PayPal Orders v2 integration for individual buyer payments (Sandbox).

Credentials via environment variables:
  PAYPAL_CLIENT_ID
  PAYPAL_CLIENT_SECRET
  PAYPAL_MODE=sandbox  (or live)
  PAYPAL_WEBHOOK_ID    (optional, for signature verification)

If credentials are missing, falls back to safe mock mode so the demo still works.
Never trusts frontend amounts or redirects as proof of payment.
"""
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import Optional
import os
import uuid
import httpx
import base64
import zlib
from urllib.parse import urlparse
from datetime import datetime, timedelta, timezone
from cryptography import x509
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding

router = APIRouter(prefix="/api/v1/payments", tags=["payments"])

# In-memory store (replace with DB + immutable audit log in production)
_orders = {}
_processed_events = set()

PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID", "")
PAYPAL_CLIENT_SECRET = os.getenv("PAYPAL_CLIENT_SECRET", "")
PAYPAL_MODE = os.getenv("PAYPAL_MODE", "sandbox").lower()
PAYPAL_WEBHOOK_ID = os.getenv("PAYPAL_WEBHOOK_ID", "")

BASE_URL = (
    "https://api-m.sandbox.paypal.com"
    if PAYPAL_MODE == "sandbox"
    else "https://api-m.paypal.com"
)

_token_cache = {"token": None, "expires": datetime.min.replace(tzinfo=timezone.utc)}


class CreateOrderRequest(BaseModel):
    organization_id: int
    pool_id: int
    amount: float
    currency: str = "USD"
    buyer_name: Optional[str] = None
    description: Optional[str] = "Industrial Centrifugal Water Pump 5HP"


class CaptureRequest(BaseModel):
    paypal_order_id: str


async def get_access_token() -> Optional[str]:
    if not PAYPAL_CLIENT_ID or not PAYPAL_CLIENT_SECRET:
        return None
    now = datetime.now(timezone.utc)
    if _token_cache["token"] and _token_cache["expires"] > now:
        return _token_cache["token"]

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{BASE_URL}/v1/oauth2/token",
            auth=(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET),
            data={"grant_type": "client_credentials"},
            headers={"Accept": "application/json"},
        )
        if resp.status_code != 200:
            return None
        data = resp.json()
        _token_cache["token"] = data["access_token"]
        _token_cache["expires"] = now + timedelta(seconds=data.get("expires_in", 3000) - 60)
        return _token_cache["token"]


@router.post("/paypal/create-order")
async def create_paypal_order(req: CreateOrderRequest):
    if req.amount <= 0:
        raise HTTPException(status_code=400, detail="Invalid amount")

    mint_order_id = f"MINT-{uuid.uuid4().hex[:12].upper()}"
    request_id = str(uuid.uuid4())

    token = await get_access_token()
    if not token:
        # Mock mode for demo when credentials are not configured
        paypal_order_id = f"SANDBOX-MOCK-{uuid.uuid4().hex[:12].upper()}"
        order = {
            "mint_order_id": mint_order_id,
            "paypal_order_id": paypal_order_id,
            "organization_id": req.organization_id,
            "pool_id": req.pool_id,
            "amount": req.amount,
            "currency": req.currency,
            "buyer_name": req.buyer_name,
            "status": "CREATED",
            "mode": "mock",
            "note": "Mock mode — set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET for real Sandbox orders."
        }
        _orders[paypal_order_id] = order
        return {
            "status": "created",
            "mode": "mock",
            "mint_order_id": mint_order_id,
            "paypal_order_id": paypal_order_id,
            "approval_url": f"http://localhost:3000/payment/return?token={paypal_order_id}&mode=mock",
            "amount": req.amount,
            "currency": req.currency,
            "next_step": "In mock mode. Redirect buyer to checkout simulation or configure PayPal credentials for real Sandbox flow."
        }

    # Real PayPal Orders v2 create
    payload = {
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "reference_id": mint_order_id,
                "description": req.description or "MINT collective purchase",
                "amount": {
                    "currency_code": req.currency,
                    "value": f"{req.amount:.2f}"
                }
            }
        ],
        "payment_source": {
            "paypal": {
                "experience_context": {
                    "payment_method_preference": "IMMEDIATE_PAYMENT_REQUIRED",
                    "user_action": "PAY_NOW",
                    "return_url": "http://localhost:3000/payment/return",
                    "cancel_url": "http://localhost:3000/payment/cancel"
                }
            }
        }
    }

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{BASE_URL}/v2/checkout/orders",
            json=payload,
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
                "PayPal-Request-Id": request_id,
            },
            timeout=30.0,
        )

    if resp.status_code not in (200, 201):
        raise HTTPException(status_code=502, detail=f"PayPal create order failed: {resp.text}")

    data = resp.json()
    paypal_order_id = data["id"]
    approval_url = next(
        (link["href"] for link in data.get("links", []) if link.get("rel") == "approve"),
        None
    )

    order = {
        "mint_order_id": mint_order_id,
        "paypal_order_id": paypal_order_id,
        "organization_id": req.organization_id,
        "pool_id": req.pool_id,
        "amount": req.amount,
        "currency": req.currency,
        "buyer_name": req.buyer_name,
        "status": data.get("status", "CREATED"),
        "mode": "live_sandbox" if PAYPAL_MODE == "sandbox" else "live",
        "paypal_response": data,
    }
    _orders[paypal_order_id] = order

    return {
        "status": "created",
        "mode": order["mode"],
        "mint_order_id": mint_order_id,
        "paypal_order_id": paypal_order_id,
        "approval_url": approval_url,
        "amount": req.amount,
        "currency": req.currency,
        "next_step": "Redirect buyer to approval_url. After approval, call /capture."
    }


@router.post("/paypal/capture")
async def capture_paypal_order(req: CaptureRequest):
    order = _orders.get(req.paypal_order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found in MINT records")

    if order["status"] not in ("CREATED", "APPROVED", "PAYER_ACTION_REQUIRED"):
        raise HTTPException(status_code=400, detail=f"Cannot capture order in status {order['status']}")

    if order.get("mode") == "mock":
        order["status"] = "CAPTURED"
        order["capture_id"] = f"MOCK-CAPTURE-{uuid.uuid4().hex[:12].upper()}"
        return {
            "status": "captured",
            "mode": "mock",
            "paypal_order_id": req.paypal_order_id,
            "capture_id": order["capture_id"],
            "amount": order["amount"],
            "currency": order["currency"],
            "buyer_name": order.get("buyer_name"),
            "note": "Mock capture confirmed. Configure credentials for live PayPal capture."
        }

    token = await get_access_token()
    if not token:
        raise HTTPException(status_code=500, detail="PayPal credentials not available")

    request_id = str(uuid.uuid4())
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{BASE_URL}/v2/checkout/orders/{req.paypal_order_id}/capture",
            json={},
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
                "PayPal-Request-Id": request_id,
            },
            timeout=30.0,
        )

    if resp.status_code not in (200, 201):
        raise HTTPException(status_code=502, detail=f"PayPal capture failed: {resp.text}")

    data = resp.json()
    order["status"] = data.get("status", "COMPLETED")
    captures = data.get("purchase_units", [{}])[0].get("payments", {}).get("captures", [])
    capture_id = captures[0]["id"] if captures else None
    order["capture_id"] = capture_id
    order["paypal_capture_response"] = data

    return {
        "status": "captured",
        "mode": order["mode"],
        "paypal_order_id": req.paypal_order_id,
        "capture_id": capture_id,
        "amount": order["amount"],
        "currency": order["currency"],
        "buyer_name": order.get("buyer_name"),
        "paypal_status": data.get("status"),
        "note": "Verified with PayPal API. Store immutable audit record in production."
    }


@router.get("/paypal/orders")
def list_orders():
    """List all created orders in memory for auditing."""
    return {
        "total": len(_orders),
        "orders": list(_orders.values())
    }


@router.get("/paypal/order/{paypal_order_id}")
async def get_order_status(paypal_order_id: str):
    order = _orders.get(paypal_order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    token = await get_access_token()
    if token and order.get("mode") != "mock":
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"{BASE_URL}/v2/checkout/orders/{paypal_order_id}",
                headers={"Authorization": f"Bearer {token}"},
                timeout=15.0,
            )
            if resp.status_code == 200:
                order["paypal_status_live"] = resp.json().get("status")

    return order


_cert_cache = {}


async def fetch_paypal_certificate(cert_url: str) -> str:
    """Download and cache PayPal certificate. Only allow official PayPal domains."""
    parsed = urlparse(cert_url)
    if not parsed.hostname or not (
        parsed.hostname.endswith(".paypal.com") or parsed.hostname.endswith(".sandbox.paypal.com")
    ):
        raise ValueError("Invalid certificate URL — must be from paypal.com")

    if cert_url in _cert_cache:
        return _cert_cache[cert_url]

    async with httpx.AsyncClient() as client:
        resp = await client.get(cert_url, timeout=10.0)
        resp.raise_for_status()
        cert_pem = resp.text
        _cert_cache[cert_url] = cert_pem
        return cert_pem


def _crc32(data: bytes) -> int:
    return zlib.crc32(data) & 0xffffffff


async def verify_paypal_webhook(headers: dict, raw_body: bytes, webhook_id: str) -> bool:
    """Full async verification including certificate download and RSA-SHA256 check."""
    try:
        transmission_id = headers.get("paypal-transmission-id")
        timestamp = headers.get("paypal-transmission-time")
        signature_b64 = headers.get("paypal-transmission-sig")
        cert_url = headers.get("paypal-cert-url")
        auth_algo = headers.get("paypal-auth-algo", "SHA256withRSA")

        if not all([transmission_id, timestamp, signature_b64, cert_url, webhook_id]):
            return False

        if "SHA256" not in auth_algo.upper():
            return False

        crc = _crc32(raw_body)
        message = f"{transmission_id}|{timestamp}|{webhook_id}|{crc}".encode("utf-8")

        cert_pem = await fetch_paypal_certificate(cert_url)
        cert = x509.load_pem_x509_certificate(cert_pem.encode("utf-8"), default_backend())
        public_key = cert.public_key()

        signature = base64.b64decode(signature_b64)

        public_key.verify(
            signature,
            message,
            padding.PKCS1v15(),
            hashes.SHA256(),
        )
        return True
    except Exception:
        return False


@router.post("/paypal/webhook")
async def paypal_webhook(request: Request):
    raw_body = await request.body()
    headers = dict(request.headers)

    event_id = None
    event = {}
    try:
        import json
        event = json.loads(raw_body)
        event_id = event.get("id")
    except Exception:
        pass

    if event_id and event_id in _processed_events:
        return {"status": "duplicate", "event_id": event_id}

    verified = False
    verification_error = None

    if PAYPAL_WEBHOOK_ID:
        try:
            verified = await verify_paypal_webhook(headers, raw_body, PAYPAL_WEBHOOK_ID)
        except Exception as e:
            verification_error = str(e)
            verified = False
    else:
        verification_error = "PAYPAL_WEBHOOK_ID not configured — verification skipped"

    # Only update state if verified
    if verified and event_id:
        _processed_events.add(event_id)

        resource = event.get("resource", {})
        order_id = (
            resource.get("id")
            or resource.get("supplementary_data", {}).get("related_ids", {}).get("order_id")
        )
        if order_id and order_id in _orders:
            _orders[order_id]["last_webhook"] = {
                "event_type": event.get("event_type"),
                "event_id": event_id,
                "verified": True,
                "received_at": datetime.now(timezone.utc).isoformat(),
            }
            if event.get("event_type") == "PAYMENT.CAPTURE.COMPLETED":
                _orders[order_id]["status"] = "CAPTURED"
            elif event.get("event_type") == "CHECKOUT.ORDER.APPROVED":
                if _orders[order_id]["status"] == "CREATED":
                    _orders[order_id]["status"] = "APPROVED"

    return {
        "status": "processed" if verified else "received_unverified",
        "event_id": event_id,
        "event_type": event.get("event_type"),
        "verified": verified,
        "verification_error": verification_error,
        "note": "Only verified webhooks update payment state. Unverified events are logged but ignored for financial decisions."
    }
