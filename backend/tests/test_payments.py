from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_mock_create_order_and_capture():
    # 1. Create order
    create_payload = {
        "organization_id": 1,
        "pool_id": 1,
        "amount": 4380.00,
        "currency": "USD",
        "buyer_name": "AquaFlow Industries",
        "description": "Industrial Centrifugal Water Pump 5HP - 12 Units",
    }
    res = client.post("/api/v1/payments/paypal/create-order", json=create_payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "created"
    assert "paypal_order_id" in data
    order_id = data["paypal_order_id"]

    # 2. Get order status
    status_res = client.get(f"/api/v1/payments/paypal/order/{order_id}")
    assert status_res.status_code == 200
    assert status_res.json()["amount"] == 4380.00

    # 3. Capture order
    capture_res = client.post("/api/v1/payments/paypal/capture", json={"paypal_order_id": order_id})
    assert capture_res.status_code == 200
    capture_data = capture_res.json()
    assert capture_data["status"] == "captured"
    assert "capture_id" in capture_data

def test_invalid_order_amount():
    res = client.post("/api/v1/payments/paypal/create-order", json={
        "organization_id": 1,
        "pool_id": 1,
        "amount": -50.0,
    })
    assert res.status_code == 400

def test_capture_nonexistent_order():
    res = client.post("/api/v1/payments/paypal/capture", json={"paypal_order_id": "DOES_NOT_EXIST"})
    assert res.status_code == 404
