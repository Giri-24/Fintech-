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

@router.get("/demo/investment-probability")
def get_investment_probability(units: int = 12):
    """
    Customer-facing ROI & Investment Probability Model.
    Calculates pool fulfillment probability, financing fees, and net customer margin impact.
    """
    units = max(1, min(units, 50))
    retail_price = 415.00
    negotiated_price = 365.00
    
    investment_amount = units * negotiated_price
    retail_total = units * retail_price
    direct_savings = retail_total - investment_amount
    
    # Probability model: baseline pool has 38 committed units; customer adds units towards 50
    current_pool_committed = 38
    total_after_investment = current_pool_committed + units
    
    if total_after_investment >= 50:
        fulfillment_probability = 98.6
        tier_status = "Tier-1 Unlocked ($365/unit)"
    elif total_after_investment >= 45:
        fulfillment_probability = 92.4
        tier_status = "Near Threshold (7 units needed)"
    elif total_after_investment >= 40:
        fulfillment_probability = 84.1
        tier_status = "Advancing Aggregation"
    else:
        fulfillment_probability = 71.5
        tier_status = "Early Stage Pool"
        
    # Payment Gateway Fee Comparison for the Customer
    paypal_fee_rate = 0.015 # 1.5% commercial escrow rate
    paypal_fee = round(investment_amount * paypal_fee_rate, 2)
    
    traditional_factoring_rate = 0.035 # 3.5% traditional credit/factoring
    traditional_fee = round((investment_amount * traditional_factoring_rate) + 45.00, 2)
    
    financing_savings = round(traditional_fee - paypal_fee, 2)
    net_customer_profit = round(direct_savings + financing_savings, 2)
    customer_roi_pct = round((net_customer_profit / investment_amount) * 100, 1)

    return {
        "customer_investment": {
            "units": units,
            "unit_price": negotiated_price,
            "capital_committed_usd": investment_amount,
            "retail_baseline_usd": retail_total,
            "direct_equipment_savings_usd": direct_savings,
        },
        "probability_model": {
            "fulfillment_probability_pct": fulfillment_probability,
            "tier_status": tier_status,
            "pool_fulfillment_target": 50,
            "combined_units_after_commit": total_after_investment,
            "confidence_rating": "High (Statistical Municipal Cycle)",
            "risk_mitigation": "100% Refundable Escrow via PayPal if threshold not met within 30 days",
        },
        "fee_and_roi_analysis": {
            "paypal_gateway_charge_usd": paypal_fee,
            "paypal_fee_percentage": "1.5%",
            "traditional_bank_factoring_charge_usd": traditional_fee,
            "traditional_fee_percentage": "3.5% + $45 Wire",
            "financing_fee_savings_usd": financing_savings,
            "net_customer_gain_usd": net_customer_profit,
            "annualized_roi_pct": customer_roi_pct,
            "breakeven_timeline_days": 18,
        },
        "probability_curve": [
            {"units": 4, "probability": 72.0, "savings": 200.0, "invest": 1460.0},
            {"units": 8, "probability": 81.5, "savings": 400.0, "invest": 2920.0},
            {"units": 12, "probability": 94.8, "savings": 600.0, "invest": 4380.0},
            {"units": 16, "probability": 97.5, "savings": 800.0, "invest": 5840.0},
            {"units": 20, "probability": 99.2, "savings": 1000.0, "invest": 7300.0},
        ]
    }

@router.get("/demo/services")
def get_enterprise_services():
    """
    Catalog of adoptable PayPal & B2B Financial Services for customer business growth.
    """
    return {
        "services": [
            {
                "id": "paypal_escrow",
                "name": "PayPal Orders v2 Bilateral Escrow",
                "badge": "Core Active Rail",
                "status": "Active",
                "description": "Server-side cryptographic escrow hold. Zero commingling of customer funds. Auto-capture upon verified physical dispatch.",
                "customer_benefit": "Eliminates counterparty risk. 180-day buyer protection policy.",
                "processing_fee": "1.5% flat (Save 2.0% vs traditional factoring)",
                "recommended_for": "All collective procurement pools ($1,000 - $100,000)",
            },
            {
                "id": "paypal_working_capital",
                "name": "PayPal Commercial Working Capital",
                "badge": "Growth Financing",
                "status": "Available to Activate",
                "description": "Instant pre-approved credit lines from $10,000 to $50,000 based on procurement invoice history with single fixed fee.",
                "customer_benefit": "Enables purchasing larger volume tiers without depleting enterprise operating cash flow.",
                "processing_fee": "Single fixed fee (No compounding monthly interest)",
                "recommended_for": "SMEs scaling orders from 10 units to 50+ bulk tiers",
            },
            {
                "id": "paypal_subscriptions",
                "name": "PayPal Automated B2B Subscriptions",
                "badge": "Recurring Replenishment",
                "status": "Available to Activate",
                "description": "Automated recurring order scheduling for periodic industrial consumables (mechanical seals, filter media, replacement impellers).",
                "customer_benefit": "Zero downtime from stockouts. Automatically aggregates recurring schedules into bulk tiers.",
                "processing_fee": "Standard PayPal merchant processing",
                "recommended_for": "Recurring 6-month & 12-month maintenance contracts",
            },
            {
                "id": "ach_direct_rail",
                "name": "PayPal Braintree Corporate ACH Rail",
                "badge": "Enterprise High-Volume",
                "status": "Available to Activate",
                "description": "Direct bank-to-bank automated clearing house settlement for large civil infrastructure purchase orders exceeding $50,000.",
                "customer_benefit": "Lowest cost per transaction ($5 cap) for mega-capital equipment procurements.",
                "processing_fee": "0.75% capped at $5.00 per transaction",
                "recommended_for": "Civil engineering and municipal orders > $50,000",
            },
            {
                "id": "iot_escrow_release",
                "name": "IoT Delivery Smart Inspection Rail",
                "badge": "Automated Quality Lock",
                "status": "Experimental Integration",
                "description": "PayPal webhook integration with factory IoT telemetry. Funds released from escrow only when digital signature and flow sensors confirm spec compliance.",
                "customer_benefit": "Guarantees pump flow rate (50 m³/h) and motor insulation (IP55) before vendor payout.",
                "processing_fee": "Included in PayPal Orders v2",
                "recommended_for": "Precision engineered pumps and calibrated sensors",
            },
        ]
    }

