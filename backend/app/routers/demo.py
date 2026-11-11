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

@router.get("/demo/analytics")
def get_analytics():
    return {
        "monthly_trend": [
            {"month": "Jun 2025", "retail_cost": 42200, "collective_cost": 36500, "savings": 5700, "paypal_volume": 36500},
            {"month": "Aug 2025", "retail_cost": 58100, "collective_cost": 49900, "savings": 8200, "paypal_volume": 49900},
            {"month": "Oct 2025", "retail_cost": 64300, "collective_cost": 54800, "savings": 9500, "paypal_volume": 54800},
            {"month": "Dec 2025", "retail_cost": 82000, "collective_cost": 69700, "savings": 12300, "paypal_volume": 69700},
            {"month": "Feb 2026", "retail_cost": 71500, "collective_cost": 60900, "savings": 10600, "paypal_volume": 60900},
            {"month": "Apr 2026", "retail_cost": 89400, "collective_cost": 75200, "savings": 14200, "paypal_volume": 75200},
            {"month": "Jun 2026", "retail_cost": 98200, "collective_cost": 81800, "savings": 16400, "paypal_volume": 81800},
            {"month": "Aug 2026", "retail_cost": 112000, "collective_cost": 92500, "savings": 19500, "paypal_volume": 92500},
            {"month": "Oct 2026", "retail_cost": 128000, "collective_cost": 104500, "savings": 23500, "paypal_volume": 104500},
            {"month": "Dec 2026", "retail_cost": 145000, "collective_cost": 117200, "savings": 27800, "paypal_volume": 117200},
        ],
        "cumulative_savings": 147700,
        "total_paypal_volume": 678000,
        "volume_tier_curve": [
            {"volume": 10, "unit_price": 415, "savings_per_unit": 0, "tier": "Retail Single Buyer (1-15 units)"},
            {"volume": 25, "unit_price": 390, "savings_per_unit": 25, "tier": "Tier-3 Collective (16-30 units)"},
            {"volume": 50, "unit_price": 365, "savings_per_unit": 50, "tier": "Tier-2 Collective (31-60 units)"},
            {"volume": 75, "unit_price": 345, "savings_per_unit": 70, "tier": "Tier-1 Enterprise (61-80 units)"},
            {"volume": 100, "unit_price": 330, "savings_per_unit": 85, "tier": "Mega-Pool Super Tier (81-100+ units)"},
        ],
        "paypal_gateway_metrics": {
            "total_escrow_held": 18250.00,
            "total_settled_ytd": 678000.00,
            "average_capture_time_hours": 18.4,
            "chargeback_rate": "0.00%",
            "dispute_protection": "PayPal Seller & Buyer Protection Active",
            "smart_payment_share": {
                "paypal_wallet": "58%",
                "pay_later_net30": "26%",
                "paypal_business_debit": "16%"
            }
        }
    }

@router.get("/demo/pools")
def get_pools():
    return {
        "pools": [
            {
                "id": 1,
                "name": "Industrial Centrifugal Water Pump 5HP",
                "category": "Fluid Mechanics",
                "target_quantity": 50,
                "committed_quantity": 50,
                "retail_price": 415.00,
                "negotiated_price": 365.00,
                "savings_per_unit": 50.00,
                "total_savings": 2500.00,
                "status": "Ready for PayPal Capture",
                "completion_pct": 100,
                "days_remaining": 8,
                "specs": "Flow 50 m³/h · Head 30m · IP55 · 400V 3-Phase",
                "buyers_count": 3,
            },
            {
                "id": 2,
                "name": "High-Efficiency 3-Phase Induction Motors 15kW",
                "category": "Electromechanical",
                "target_quantity": 30,
                "committed_quantity": 24,
                "retail_price": 570.00,
                "negotiated_price": 480.00,
                "savings_per_unit": 90.00,
                "total_savings": 2700.00,
                "status": "Active Aggregation",
                "completion_pct": 80,
                "days_remaining": 14,
                "specs": "15kW (20HP) · 1460 RPM · IE3 Premium · Cast Iron",
                "buyers_count": 4,
            },
            {
                "id": 3,
                "name": "Smart Electromagnetic Flowmeters DN80",
                "category": "Industrial Sensors",
                "target_quantity": 25,
                "committed_quantity": 16,
                "retail_price": 475.00,
                "negotiated_price": 390.00,
                "savings_per_unit": 85.00,
                "total_savings": 2125.00,
                "status": "Active Aggregation",
                "completion_pct": 64,
                "days_remaining": 18,
                "specs": "DN80 (3 inch) · Flanged PN16 · RS485 Modbus · PTFE",
                "buyers_count": 2,
            },
            {
                "id": 4,
                "name": "High-Pressure Industrial Gate Valves PN25",
                "category": "Fluid Valves",
                "target_quantity": 50,
                "committed_quantity": 38,
                "retail_price": 260.00,
                "negotiated_price": 210.00,
                "savings_per_unit": 50.00,
                "total_savings": 2500.00,
                "status": "Active Aggregation",
                "completion_pct": 76,
                "days_remaining": 11,
                "specs": "DN100 · Flanged PN25 · WCB Cast Steel · Stainless Trim",
                "buyers_count": 5,
            },
        ]
    }
