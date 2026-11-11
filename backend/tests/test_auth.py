from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_and_health():
    res = client.get("/")
    assert res.status_code == 200
    assert "MINT API is running" in res.json()["message"]

    res_h = client.get("/health")
    assert res_h.status_code == 200
    assert res_h.json()["status"] == "healthy"

def test_login_success():
    res = client.post("/api/v1/auth/login", json={"email": "aquaflow@example.com", "password": "demo"})
    assert res.status_code == 200
    data = res.json()
    assert data["organization_id"] == 1
    assert data["organization_name"] == "AquaFlow Industries"
    assert "demo-token-1" in data["access_token"]

def test_login_invalid_password():
    res = client.post("/api/v1/auth/login", json={"email": "aquaflow@example.com", "password": "wrong"})
    assert res.status_code == 401

def test_auth_me_endpoint():
    login_res = client.post("/api/v1/auth/login", json={"email": "hydrotech@example.com", "password": "demo"})
    token = login_res.json()["access_token"]

    res = client.get(f"/api/v1/auth/me?token={token}")
    assert res.status_code == 200
    assert res.json()["name"] == "HydroTech Systems"
