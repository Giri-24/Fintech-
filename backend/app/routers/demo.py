from fastapi import APIRouter
from app.seed_demo import DEMO_POOL, DEMO_ORGANIZATIONS, DEMO_PURCHASE_HISTORY

router = APIRouter(prefix="/api/v1", tags=["demo"])

@router.get("/demo/command-centre")
def get_command_centre():
    return {
        "predicted_purchases": 3,
        "active_pools": 1,
        "estimated_savings": 2250,
        "pending_approvals": 2,
        "pool": DEMO_POOL,
        "organizations": DEMO_ORGANIZATIONS,
        "note": "Seeded demonstration data for industrial water pump vertical slice"
    }

@router.get("/demo/predictions")
def get_predictions():
    return {
        "predictions": [
            {"organization": "AquaFlow Industries", "product": "Industrial Centrifugal Water Pump 5HP", "predicted_quantity": 12, "predicted_date": "2026-12-15", "confidence": "high", "explanation": "Recurring every 5–6 months from historical purchases"},
            {"organization": "GreenPump Solutions", "product": "Industrial Centrifugal Water Pump 5HP", "predicted_quantity": 15, "predicted_date": "2026-12-20", "confidence": "medium", "explanation": "Seasonal pattern plus mild growth"},
            {"organization": "HydroTech Systems", "product": "Industrial Centrifugal Water Pump 5HP", "predicted_quantity": 23, "predicted_date": "2026-12-10", "confidence": "high", "explanation": "Consistent municipal replenishment cycle"},
        ],
        "note": "Forecasts are estimates derived from seeded history. Not live production predictions."
    }

@router.get("/demo/demand-mesh")
def get_demand_mesh():
    return {
        "pool": DEMO_POOL,
        "matching_rule": "Exact specification match (flow, head, material, IP rating) + compatible timeline",
        "note": "Demand aggregation is commercial coordination only. Financial ownership remains individual."
    }

@router.get("/demo/negotiation")
def get_negotiation():
    return {
        "original_average_unit_price": 415,
        "negotiated_unit_price": 365,
        "target_unit_price": 350,
        "messages": [
            {"from": "AI Agent", "text": "Requested 12% volume discount on 50-unit commitment.", "type": "agent"},
            {"from": "Supplier (simulated)", "text": "Counter-offered $365 with 30-day validity.", "type": "simulated"},
            {"from": "AI Recommendation", "text": "Accept $365. Clear savings vs historical individual pricing.", "type": "recommendation"},
        ],
        "note": "All supplier responses are simulated for demonstration and clearly labelled."
    }

@router.get("/demo/approvals")
def get_approvals():
    return {
        "buyers": [
            {"organization": "AquaFlow Industries", "quantity": 12, "unit_price": 365, "total": 4380, "status": "pending"},
            {"organization": "GreenPump Solutions", "quantity": 15, "unit_price": 365, "total": 5475, "status": "pending"},
            {"organization": "HydroTech Systems", "quantity": 23, "unit_price": 365, "total": 8395, "status": "approved"},
        ],
        "payment_model": "Individual PayPal Sandbox Orders v2 per buyer. No pooled funds or shared wallet.",
        "note": "Buyer must explicitly approve before any order is created."
    }

@router.get("/demo/history")
def get_purchase_history():
    return {
        "history": DEMO_PURCHASE_HISTORY,
        "total_records": len(DEMO_PURCHASE_HISTORY),
        "note": "Factual purchase transaction logs used by predictive models."
    }
