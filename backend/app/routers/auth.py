"""
Simple auth and organization isolation skeleton.
In production: proper JWT, password hashing, and row-level organization filters.
"""
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])

# Demo users (replace with DB)
DEMO_USERS = {
    "aquaflow@example.com": {"password": "demo", "organization_id": 1, "name": "AquaFlow Industries", "role": "buyer"},
    "greenpump@example.com": {"password": "demo", "organization_id": 2, "name": "GreenPump Solutions", "role": "buyer"},
    "hydrotech@example.com": {"password": "demo", "organization_id": 3, "name": "HydroTech Systems", "role": "buyer"},
}

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
def login(req: LoginRequest):
    user = DEMO_USERS.get(req.email.lower().strip())
    if not user or user["password"] != req.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    # In production: issue real JWT
    return {
        "access_token": f"demo-token-{user['organization_id']}",
        "token_type": "bearer",
        "organization_id": user["organization_id"],
        "organization_name": user["name"],
        "role": user["role"],
        "note": "Demo token only. Production must use signed JWTs and enforce organization isolation on every query."
    }

@router.get("/me")
def me(token: Optional[str] = None, authorization: Optional[str] = Header(None)):
    raw_token = token
    if not raw_token and authorization and authorization.lower().startswith("bearer "):
        raw_token = authorization.split(" ", 1)[1].strip()

    if not raw_token or not raw_token.startswith("demo-token-"):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    try:
        org_id = int(raw_token.split("-")[-1])
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid token")
    for email, user in DEMO_USERS.items():
        if user["organization_id"] == org_id:
            return {"email": email, **{k: v for k, v in user.items() if k != "password"}}
    raise HTTPException(status_code=401, detail="User not found")
