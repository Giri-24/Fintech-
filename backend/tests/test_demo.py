from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_command_centre():
    res = client.get("/api/v1/demo/command-centre")
    assert res.status_code == 200
    data = res.json()
    assert data["predicted_purchases"] == 3
    assert data["active_pools"] == 1
    assert data["estimated_savings"] == 2250
    assert "pool" in data

def test_predictions():
    res = client.get("/api/v1/demo/predictions")
    assert res.status_code == 200
    data = res.json()
    assert len(data["predictions"]) == 3
    assert data["predictions"][0]["organization"] == "AquaFlow Industries"

def test_demand_mesh():
    res = client.get("/api/v1/demo/demand-mesh")
    assert res.status_code == 200
    data = res.json()
    assert "pool" in data
    assert "matching_rule" in data

def test_negotiation():
    res = client.get("/api/v1/demo/negotiation")
    assert res.status_code == 200
    data = res.json()
    assert data["original_average_unit_price"] == 415
    assert data["negotiated_unit_price"] == 365
    assert len(data["messages"]) >= 3

def test_approvals():
    res = client.get("/api/v1/demo/approvals")
    assert res.status_code == 200
    data = res.json()
    assert len(data["buyers"]) == 3

def test_purchase_history():
    res = client.get("/api/v1/demo/history")
    assert res.status_code == 200
    data = res.json()
    assert data["total_records"] > 0
