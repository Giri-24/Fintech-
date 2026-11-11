import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.demo import router as demo_router
from app.routers.payments import router as payments_router
from app.routers.auth import router as auth_router

app = FastAPI(
    title="MINT API",
    description="Mission Intelligence & Negotiation Technology - Predictive Collective Procurement",
    version="0.1.0",
)

allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url and frontend_url not in allowed_origins:
    allowed_origins.append(frontend_url.rstrip("/"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if frontend_url else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(demo_router)
app.include_router(payments_router)
app.include_router(auth_router)

@app.get("/")
def root():
    return {
        "message": "MINT API is running",
        "status": "foundation + payments + auth skeleton",
        "endpoints": [
            "/api/v1/demo/command-centre",
            "/api/v1/demo/predictions",
            "/api/v1/demo/demand-mesh",
            "/api/v1/demo/negotiation",
            "/api/v1/demo/approvals",
            "/api/v1/demo/history",
            "/api/v1/payments/paypal/create-order",
            "/api/v1/payments/paypal/capture",
            "/api/v1/payments/paypal/orders",
            "/api/v1/auth/login",
            "/api/v1/auth/me",
        ],
    }

@app.get("/health")
def health():
    return {"status": "healthy", "service": "MINT API", "version": "0.1.0"}
