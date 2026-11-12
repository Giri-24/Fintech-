"""
Google Gemini AI integration for MINT Predictive Procurement.
Uses GEMINI_API_KEY from environment variables to deliver intelligent
collective procurement guidance, supplier negotiation strategies,
and PayPal escrow risk assessments.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
import os
import httpx
import logging

logger = logging.getLogger("mint.ai")
router = APIRouter(prefix="/api/v1/ai", tags=["ai"])

DEFAULT_MODEL = "gemini-1.5-flash"

class CopilotRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None

class AnalyzePoolRequest(BaseModel):
    equipment_type: Optional[str] = "pump"
    units: Optional[int] = 12
    retail_price: Optional[float] = 415.0
    negotiated_price: Optional[float] = 365.0
    pool_target: Optional[int] = 50
    current_committed: Optional[int] = 38

def get_gemini_config():
    api_key = os.getenv("GEMINI_API_KEY", "").strip().strip('"').strip("'")
    model = os.getenv("GEMINI_MODEL", DEFAULT_MODEL).strip() or DEFAULT_MODEL
    return api_key, model

async def call_gemini(prompt: str, system_instruction: str = "") -> str:
    api_key, model = get_gemini_config()
    if not api_key:
        raise ValueError("GEMINI_API_KEY is not configured")

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    
    contents = []
    if system_instruction:
        contents.append({
            "role": "user",
            "parts": [{"text": f"System Context & Guidelines:\n{system_instruction}"}]
        })
        contents.append({
            "role": "model",
            "parts": [{"text": "Understood. I will act as the MINT Gemini AI Procurement Copilot according to these institutional fintech guidelines."}]
        })
    
    contents.append({
        "role": "user",
        "parts": [{"text": prompt}]
    })

    payload = {
        "contents": contents,
        "generationConfig": {
            "temperature": 0.3,
            "maxOutputTokens": 900,
        }
    }

    async with httpx.AsyncClient(timeout=25.0) as client:
        resp = await client.post(url, json=payload, headers={"Content-Type": "application/json"})
        if resp.status_code != 200:
            logger.warning(f"Gemini API returned status {resp.status_code}: {resp.text}")
            raise HTTPException(status_code=502, detail=f"Gemini API call failed ({resp.status_code}): {resp.text[:200]}")
        data = resp.json()

    try:
        candidates = data.get("candidates", [])
        if candidates:
            parts = candidates[0].get("content", {}).get("parts", [])
            if parts and "text" in parts[0]:
                return parts[0]["text"]
        return "Gemini AI produced an empty response. Please refine your query."
    except Exception as e:
        logger.error(f"Error parsing Gemini response: {e}")
        return "Unable to parse AI response."

@router.get("/status")
def get_ai_status():
    api_key, model = get_gemini_config()
    return {
        "configured": bool(api_key),
        "provider": "Google Gemini AI",
        "model": model,
        "mode": "live" if api_key else "simulated_fallback",
        "capabilities": [
            "Real-time volume tier negotiation advisory",
            "PayPal Orders v2 escrow risk & compliance assessment",
            "Cross-organization demand aggregation forecasting",
            "Cash flow & wire fee arbitrage comparison"
        ]
    }

@router.post("/copilot")
async def copilot_chat(req: CopilotRequest):
    api_key, model = get_gemini_config()
    
    system_instruction = (
        "You are MINT Gemini AI, an institutional procurement and fintech advisor. "
        "You assist B2B enterprise buyers participating in collective demand pooling backed by PayPal Orders v2 Bilateral Escrow. "
        "Key principles:\n"
        "1. Prioritize customer financial gain (wholesale volume tiers, cash retained).\n"
        "2. Emphasize PayPal Bilateral Escrow protection (funds held securely on server-side, captured ONLY upon verified physical dispatch, eliminating non-delivery risk).\n"
        "3. Compare PayPal's 1.5% flat escrow fee favorably against traditional bank wires (3.5% + $45 wire fees).\n"
        "4. Keep answers professional, concise, bulleted, and actionable. Avoid robotic jargon."
    )

    context_str = ""
    if req.context:
        context_str = f"\nCurrent Active Context:\n" + "\n".join([f"- {k}: {v}" for k, v in req.context.items()])

    full_prompt = f"{req.message}{context_str}"

    if api_key:
        try:
            reply = await call_gemini(full_prompt, system_instruction)
            return {
                "source": "gemini-live",
                "model": model,
                "response": reply
            }
        except Exception as err:
            logger.warning(f"Live Gemini failed, falling back to simulated logic: {err}")

    # Fallback response if API key is not yet active or network timeout occurs
    return {
        "source": "simulated_copilot",
        "model": model,
        "response": (
            "**Gemini Procurement Recommendation:**\n\n"
            "• **Volume Tier Advantage:** Your proposed order volume bridges the active pool across the Tier-1 bulk boundary ($365/unit vs $415 retail catalog).\n"
            "• **PayPal Escrow Protection:** Committing via PayPal Orders v2 holds authorization in individual bilateral escrow. Zero pooled funds; capture occurs strictly post-dispatch inspection.\n"
            "• **Fee Arbitrage:** Utilizing PayPal's 1.5% digital escrow saves approximately $180–$250 compared to traditional Letters of Credit and SWIFT bank wire fees.\n"
            "• **Next Action:** Approve allocation to lock in supplier quantity guarantee before the pool RFQ window closes."
        )
    }

@router.post("/analyze-pool")
async def analyze_pool(req: AnalyzePoolRequest):
    api_key, model = get_gemini_config()
    
    savings = (req.retail_price - req.negotiated_price) * req.units
    invested = req.negotiated_price * req.units
    progress = min(100, round(((req.current_committed + req.units) / req.pool_target) * 100))

    prompt = (
        f"Analyze this B2B procurement scenario:\n"
        f"- Equipment: {req.equipment_type}\n"
        f"- Units requested: {req.units}\n"
        f"- Retail price: ${req.retail_price}/unit\n"
        f"- Collective wholesale price: ${req.negotiated_price}/unit\n"
        f"- Total investment: ${invested:,.2f}\n"
        f"- Immediate equipment savings: ${savings:,.2f}\n"
        f"- Resulting pool target completion: {progress}%\n\n"
        f"Provide a 3-point executive briefing on: 1) Tier discount leverage, 2) PayPal bilateral escrow risk mitigation, and 3) Recommended procurement decision."
    )

    if api_key:
        try:
            reply = await call_gemini(prompt)
            return {
                "source": "gemini-live",
                "model": model,
                "analysis": reply,
                "metrics": {
                    "direct_savings": savings,
                    "invested_amount": invested,
                    "pool_progress": progress,
                }
            }
        except Exception as e:
            logger.warning(f"Gemini analyze-pool failed: {e}")

    return {
        "source": "simulated_analysis",
        "model": model,
        "analysis": (
            f"**Executive Procurement Briefing ({req.equipment_type.title()}):**\n\n"
            f"1. **Wholesale Margin:** Committing {req.units} units unlocks Tier-1 pricing at ${req.negotiated_price}/unit, generating an immediate +${savings:,.2f} in preserved capital.\n"
            f"2. **PayPal Bilateral Escrow Rail:** Funds are authorized directly to PayPal's bilateral vault. The supplier cannot access capital until shipping manifests are cryptographically verified.\n"
            f"3. **Strategic Decision:** Highly recommended. Closing {progress}% of the collective pool secures batch manufacturing priority."
        ),
        "metrics": {
            "direct_savings": savings,
            "invested_amount": invested,
            "pool_progress": progress,
        }
    }
