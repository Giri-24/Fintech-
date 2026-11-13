"use client";

import { useState, useEffect, useMemo, useRef } from "react";

const getApiBase = () => {
  if (process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.includes("localhost")) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }
  if (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
    return "https://fintech-backend-xdcq.onrender.com";
  }
  return (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");
};

// --- Clean Line Icons ---
const Icons = {
  Command: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  Probability: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="#0070ba" strokeWidth="2.5" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  Analytics: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18M19 9l-5 5-4-4-3 3" />
    </svg>
  ),
  Services: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M7 15h0M2 9.5h20" />
    </svg>
  ),
  Pools: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
    </svg>
  ),
  Predictive: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18M7 15l4-4 4 4 6-7" />
    </svg>
  ),
  Mesh: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <path d="m2 17 10 5 10-5M2 12l10 5 10-5" />
    </svg>
  ),
  Negotiation: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m16 3 4 4-4 4M20 7H4M8 21l-4-4 4-4M4 17h16" />
    </svg>
  ),
  Approvals: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  ),
  PayPal: () => (
    <svg width="18" height="20" viewBox="0 0 24 28" fill="none">
      <path d="M4.5 24.5L7.2 4.2h7.8c3.2 0 5.4.7 6.3 2.1.9 1.4.9 3.2.1 5.3-.9 2.5-2.7 4.2-5.3 5.2-1.2.5-2.7.7-4.6.7H8.8L6.9 24.5H4.5z" fill="#0079C1" />
      <path d="M8.8 17.5h2.7c3.2 0 5.4-.7 6.3-2.1.9-1.4.9-3.2.1-5.3-.9-2.5-2.7-4.2-5.3-5.2-1.2-.5-2.7-.7-4.6-.7H3.5L.8 24.5h3.8l2.2-7z" fill="#00457C" opacity="0.9" />
    </svg>
  ),
  Shield: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0070ba" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Gemini: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" />
    </svg>
  ),
};

const navItems = [
  { key: "command", label: "Overview", icon: Icons.Command },
  { key: "probability", label: "ROI & Probability Engine", icon: Icons.Probability, highlight: true },
  { key: "analytics", label: "Demand & Savings Graph", icon: Icons.Analytics, badge: "Interactive" },
  { key: "gemini", label: "Gemini AI Copilot", icon: Icons.Gemini, badge: "AI Live" },
  { key: "services", label: "PayPal Services & Rails", icon: Icons.Services, badge: "5 Rails" },
  { key: "pools", label: "Active Demand Pools", icon: Icons.Pools },
  { key: "predictive", label: "Procurement Forecasting", icon: Icons.Predictive },
  { key: "mesh", label: "Demand Aggregation", icon: Icons.Mesh },
  { key: "negotiation", label: "Volume Negotiations", icon: Icons.Negotiation },
  { key: "approvals", label: "PayPal Settlement", icon: Icons.Approvals },
];

export default function Home() {
  const [active, setActive] = useState("command");
  const [token, setToken] = useState(null);
  const [orgName, setOrgName] = useState("");
  const [backendOnline, setBackendOnline] = useState(false);
  const [preselectedCheckout, setPreselectedCheckout] = useState(null);

  useEffect(() => {
    fetch(`${getApiBase()}/health`)
      .then((res) => {
        if (res.ok) setBackendOnline(true);
      })
      .catch(() => setBackendOnline(false));
  }, []);

  function handleLogout() {
    setToken(null);
    setOrgName("");
  }

  function handleStartCheckout(payload) {
    setPreselectedCheckout(payload);
    setActive("approvals");
  }

  return (
    <div style={{ display: "flex", width: "100%", minHeight: "100vh", background: "#f5f7fa", color: "#0f172a" }}>
      {/* Sidebar - Clean PayPal White Console */}
      <aside style={{
        width: "260px",
        background: "#ffffff",
        borderRight: "1px solid #e2e8f0",
        padding: "24px 16px",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", padding: "0 6px" }}>
          <div style={{
            width: "38px",
            height: "38px",
            borderRadius: "8px",
            background: "#003087",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            <Icons.PayPal />
          </div>
          <div>
            <div style={{ fontSize: "16px", fontWeight: "700", letterSpacing: "-0.01em", color: "#003087" }}>
              MINT <span style={{ color: "#0070ba", fontWeight: "600" }}>Procure</span>
            </div>
            <div style={{ fontSize: "12px", color: "#64748b" }}>
              PayPal Equipment Collective
            </div>
          </div>
        </div>

        {/* Gateway Health Indicator */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 12px",
          borderRadius: "6px",
          background: backendOnline ? "#ecfdf5" : "#fef3c7",
          border: `1px solid ${backendOnline ? "#a7f3d0" : "#fde68a"}`,
          marginBottom: "20px",
          fontSize: "12px",
        }}>
          <span style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            backgroundColor: backendOnline ? "#059669" : "#d97706",
          }} />
          <span style={{ color: backendOnline ? "#059669" : "#b45309", fontWeight: "600" }}>
            {backendOnline ? "PayPal Orders v2 Connected" : "Local Mock Rails Active"}
          </span>
        </div>

        {/* Navigation */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}>
          <div style={{ fontSize: "11px", color: "#94a3b8", padding: "6px 10px", fontWeight: "600", letterSpacing: "0.02em" }}>
            Commercial Workspace
          </div>
          {navItems.map(({ key, label, icon: IconComponent, highlight, badge }) => {
            const isActive = active === key;
            return (
              <button
                key={key}
                onClick={() => setActive(key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  textAlign: "left",
                  padding: "9px 12px",
                  borderRadius: "6px",
                  background: isActive ? "#eff6ff" : "transparent",
                  color: isActive ? "#0070ba" : "#475569",
                  borderLeft: isActive ? "3px solid #0070ba" : "3px solid transparent",
                  cursor: "pointer",
                  fontSize: "13.5px",
                  fontWeight: isActive ? "600" : "500",
                  transition: "background 0.12s ease, color 0.12s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ color: isActive ? "#0070ba" : "#94a3b8", display: "flex", alignItems: "center" }}>
                    <IconComponent />
                  </span>
                  {label}
                </div>
                {badge && (
                  <span style={{ fontSize: "11px", fontWeight: "600", background: "#e0f2fe", color: "#0369a1", padding: "1px 6px", borderRadius: "4px" }}>
                    {badge}
                  </span>
                )}
                {highlight && !isActive && (
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#0070ba" }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Buyer Session Box */}
        <div style={{
          padding: "12px 14px",
          borderRadius: "8px",
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          fontSize: "12px",
        }}>
          {token ? (
            <div>
              <div style={{ color: "#64748b", fontSize: "11px" }}>Authorized Buyer:</div>
              <div style={{ color: "#0f172a", fontWeight: "600", marginTop: "2px", fontSize: "13px" }}>{orgName}</div>
              <button
                onClick={handleLogout}
                style={{
                  marginTop: "6px",
                  fontSize: "11.5px",
                  color: "#dc2626",
                  background: "transparent",
                  cursor: "pointer",
                  fontWeight: "500",
                  padding: 0,
                }}
              >
                Sign out
              </button>
            </div>
          ) : (
            <div>
              <div style={{ color: "#334155", fontWeight: "600" }}>Commercial Guest</div>
              <div style={{ color: "#64748b", fontSize: "11px", marginTop: "2px" }}>
                Select an equipment pool to authorize with PayPal.
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Workspace */}
      <main style={{ flex: 1, minWidth: 0, width: "100%", padding: "32px 40px", overflowY: "auto", maxWidth: "1320px" }}>
        {active === "command" && (
          <CommandCentre
            onNavigate={setActive}
            onStartCheckout={handleStartCheckout}
          />
        )}
        {active === "probability" && (
          <CustomerProbabilityEngine
            onStartCheckout={handleStartCheckout}
          />
        )}
        {active === "analytics" && (
          <DemandAndSavingsGraph
            onStartCheckout={handleStartCheckout}
          />
        )}
        {active === "gemini" && (
          <GeminiCopilotView onStartCheckout={handleStartCheckout} onNavigate={setActive} />
        )}
        {active === "services" && (
          <PayPalEnterpriseServicesHub onNavigate={setActive} />
        )}
        {active === "pools" && (
          <ActiveDemandPools onStartCheckout={handleStartCheckout} />
        )}
        {active === "predictive" && <PredictiveBuying />}
        {active === "mesh" && <DemandMesh />}
        {active === "negotiation" && <NegotiationRoom />}
        {active === "approvals" && (
          <Approvals
            token={token}
            setToken={setToken}
            orgName={orgName}
            setOrgName={setOrgName}
            onLogout={handleLogout}
            preselectedCheckout={preselectedCheckout}
          />
        )}

        {/* Enterprise Security Footer */}
        <footer style={{
          marginTop: "48px",
          padding: "16px 20px",
          borderRadius: "8px",
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          fontSize: "12.5px",
          color: "#475569",
          lineHeight: "1.5",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}>
          <span style={{ color: "#0070ba", display: "flex", alignItems: "center" }}>
            <Icons.Shield />
          </span>
          <div>
            <strong style={{ color: "#0f172a" }}>PayPal Bilateral Protection:</strong> Funds are held in individual bilateral escrow via PayPal REST v2. If a pool's minimum threshold is not achieved before the RFQ window closes, commitments are released back to your enterprise account with zero cancellation fees.
          </div>
        </footer>
      </main>
    </div>
  );
}

// --- Common UI Components (Clean, Professional, Institutional) ---

function PageHeader({ title, description, badge, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "700", letterSpacing: "-0.01em", color: "#0f172a", margin: 0 }}>
            {title}
          </h1>
          {badge && (
            <span style={{
              fontSize: "11px",
              fontWeight: "600",
              background: "#eff6ff",
              color: "#0070ba",
              border: "1px solid #bfdbfe",
              padding: "2px 8px",
              borderRadius: "4px",
            }}>
              {badge}
            </span>
          )}
        </div>
        <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
          {description}
        </p>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "#ffffff",
      border: "1px solid #e2e8f0",
      borderRadius: "10px",
      padding: "20px 24px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)",
      ...style,
    }}>
      {children}
    </div>
  );
}

function Stat({ label, value, sub, delta }) {
  return (
    <div style={{
      background: "#ffffff",
      border: "1px solid #e2e8f0",
      borderRadius: "10px",
      padding: "16px 20px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
    }}>
      <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "6px", fontWeight: "500" }}>{label}</div>
      <div style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", letterSpacing: "-0.01em" }} className="tabular-nums">
        {value}
      </div>
      <div style={{ fontSize: "12px", color: delta ? "#059669" : "#64748b", marginTop: "4px", fontWeight: delta ? "600" : "400" }}>
        {sub}
      </div>
    </div>
  );
}

// --- Spline interpolation helper for smooth financial curves ---
function getSmoothSpline(points) {
  if (!points || points.length < 2) return "";
  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

// --- View 1: Command Centre Overview ---

function CommandCentre({ onNavigate, onStartCheckout }) {
  return (
    <>
      <PageHeader
        title="Commercial Procurement Overview"
        description="Consolidate commercial equipment purchases into bulk price tiers with automated PayPal bilateral escrow."
        badge="Active Gateway"
        action={
          <button
            onClick={() => onNavigate("analytics")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "9px 16px",
              background: "#0070ba",
              color: "#ffffff",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            <Icons.Analytics /> View Demand & Savings Graphs →
          </button>
        }
      />

      {/* KPI Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
        <Stat label="Active Equipment Pools" value="4 Pools" sub="128 units aggregated" />
        <Stat label="Net Cash Saved for Buyers" value="$9,575 USD" sub="Vs standard retail catalog" delta />
        <Stat label="Average Customer Margin" value="+16.8%" sub="Direct wholesale savings" delta />
        <Stat label="Fulfillment Probability" value="98.6%" sub="Backed by PayPal Escrow" />
      </div>

      {/* Featured Pool Card */}
      <Card style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
          <div>
            <div style={{ fontSize: "11px", fontWeight: "600", color: "#0070ba", marginBottom: "4px" }}>
              Settlement Ready · Pool #PO-2026-08
            </div>
            <div style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a" }}>
              Industrial Centrifugal Water Pump 5HP (50 Units Aggregated)
            </div>
            <div style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>
              AquaFlow (12 units) · GreenPump (15 units) · HydroTech (23 units)
            </div>
          </div>
          <span style={{
            fontSize: "12px",
            fontWeight: "600",
            padding: "4px 10px",
            borderRadius: "6px",
            background: "#ecfdf5",
            color: "#059669",
            border: "1px solid #a7f3d0",
          }}>
            100% Target Reached · $2,500 Saved
          </span>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
          padding: "16px",
          background: "#f8fafc",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
          marginBottom: "18px",
        }}>
          <div>
            <div style={{ color: "#64748b", fontSize: "12px" }}>Negotiated Unit Price</div>
            <div style={{ fontSize: "18px", fontWeight: "700", color: "#059669", marginTop: "2px" }}>
              $365.00 <span style={{ fontSize: "12px", textDecoration: "line-through", color: "#94a3b8" }}>$415.00</span>
            </div>
          </div>
          <div>
            <div style={{ color: "#64748b", fontSize: "12px" }}>Collective Cash Retained</div>
            <div style={{ fontSize: "18px", fontWeight: "700", color: "#059669", marginTop: "2px" }}>$2,500.00 USD</div>
          </div>
          <div>
            <div style={{ color: "#64748b", fontSize: "12px" }}>PayPal Escrow Volume</div>
            <div style={{ fontSize: "18px", fontWeight: "700", color: "#0070ba", marginTop: "2px" }}>$18,250.00 USD</div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "12.5px", color: "#64748b" }}>
            Bilateral escrow holds are active on PayPal Orders v2. Ready to capture upon final dispatch verification.
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => onNavigate("pools")}
              style={{
                padding: "8px 16px",
                background: "#ffffff",
                border: "1px solid #d1d5db",
                color: "#334155",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Browse Active Pools (4)
            </button>
            <button
              onClick={() => onNavigate("approvals")}
              style={{
                padding: "8px 18px",
                background: "#0070ba",
                color: "#ffffff",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Review PayPal Settlement →
            </button>
          </div>
        </div>
      </Card>
    </>
  );
}

// --- View 2: Customer ROI & Dynamic Probability Engine (Workable & Reactive) ---

function CustomerProbabilityEngine({ onStartCheckout }) {
  const [units, setUnits] = useState(12);
  const [hoverUnits, setHoverUnits] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [equipmentType, setEquipmentType] = useState("pump");
  const svgRef = useRef(null);

  const equipmentOptions = {
    pump: { name: "Industrial Centrifugal Pump 5HP", retail: 415.00, negotiated: 365.00, poolTarget: 50, existingCommitted: 38 },
    motor: { name: "3-Phase Induction Motor 15kW", retail: 570.00, negotiated: 480.00, poolTarget: 30, existingCommitted: 20 },
    flow: { name: "Electromagnetic Flowmeter DN80", retail: 475.00, negotiated: 390.00, poolTarget: 25, existingCommitted: 14 },
    valve: { name: "High-Pressure Gate Valve PN25", retail: 260.00, negotiated: 210.00, poolTarget: 50, existingCommitted: 32 },
  };

  const selected = equipmentOptions[equipmentType];
  const displayUnits = hoverUnits ?? units;

  const investedAmount = displayUnits * selected.negotiated;
  const retailBaseline = displayUnits * selected.retail;
  const directSavings = retailBaseline - investedAmount;

  const totalPoolAfterInvestment = selected.existingCommitted + displayUnits;
  const progressTowardsTarget = Math.min(100, Math.round((totalPoolAfterInvestment / selected.poolTarget) * 100));

  let fulfillmentProbability = 68.0;
  if (totalPoolAfterInvestment >= selected.poolTarget) {
    fulfillmentProbability = 98.8;
  } else if (totalPoolAfterInvestment >= selected.poolTarget * 0.9) {
    fulfillmentProbability = 93.5;
  } else if (totalPoolAfterInvestment >= selected.poolTarget * 0.8) {
    fulfillmentProbability = 86.2;
  } else {
    fulfillmentProbability = Math.min(80, 68 + (totalPoolAfterInvestment / selected.poolTarget) * 15);
  }

  const paypalFee = (investedAmount * 0.015).toFixed(2);
  const traditionalFee = ((investedAmount * 0.035) + 45.00).toFixed(2);
  const financingSaved = (traditionalFee - paypalFee).toFixed(2);
  const totalNetCustomerGain = (directSavings + parseFloat(financingSaved)).toFixed(2);
  const customerRoi = ((totalNetCustomerGain / investedAmount) * 100).toFixed(1);

  const curvePoints = useMemo(() => {
    const steps = Array.from({ length: 29 }, (_, i) => i + 2); // [2..30], 29 steps
    return steps.map((u) => {
      const totalP = selected.existingCommitted + u;
      let prob = 68.0;
      if (totalP >= selected.poolTarget) {
        prob = 98.8;
      } else if (totalP >= selected.poolTarget * 0.9) {
        prob = 93.5;
      } else if (totalP >= selected.poolTarget * 0.8) {
        prob = 86.2;
      } else {
        prob = Math.min(80, 68 + (totalP / selected.poolTarget) * 15);
      }
      const x = 52 + ((u - 2) / 28) * 748;
      const y = 20 + ((100 - prob) / 42) * 165;
      const inv = u * selected.negotiated;
      return { u, prob: prob.toFixed(1), x, y, inv };
    });
  }, [selected]);

  function getUnitsFromEvent(e) {
    if (!svgRef.current) return null;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
    const clickX = clientX - rect.left;
    const scale = 800 / rect.width;
    const svgX = clickX * scale;
    const ratio = Math.max(0, Math.min(1, (svgX - 52) / 748));
    return Math.max(2, Math.min(30, Math.round(2 + ratio * 28)));
  }

  function handleSvgMouseMove(e) {
    const u = getUnitsFromEvent(e);
    if (u !== null) {
      setHoverUnits(u);
      if (isDragging) {
        setUnits(u);
      }
    }
  }

  function handleSvgMouseDown(e) {
    setIsDragging(true);
    const u = getUnitsFromEvent(e);
    if (u !== null) {
      setUnits(u);
      setHoverUnits(u);
    }
  }

  function handleSvgMouseUp() {
    setIsDragging(false);
  }

  function handleSvgMouseLeave() {
    setIsDragging(false);
    setHoverUnits(null);
  }

  function handleSvgClick(e) {
    const u = getUnitsFromEvent(e);
    if (u !== null) {
      setUnits(u);
      setHoverUnits(u);
    }
  }

  return (
    <>
      <PageHeader
        title="Procurement Probability & ROI Engine"
        description="Model your order commitment: adjust unit quantity to calculate fulfillment confidence, fee savings, and capital margin."
        badge="Mathematical Model"
      />

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "20px", marginBottom: "24px" }}>
        {/* Left: Input Configuration */}
        <Card>
          <div style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>
            1. Select Equipment & Order Volume
          </div>
          <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>
            Choose a component category and specify the quantity to commit.
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "12px", color: "#475569", fontWeight: "600", marginBottom: "8px" }}>
              Equipment Category:
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {Object.entries(equipmentOptions).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => setEquipmentType(key)}
                  style={{
                    padding: "10px 12px",
                    borderRadius: "6px",
                    textAlign: "left",
                    background: equipmentType === key ? "#eff6ff" : "#f8fafc",
                    border: `1.5px solid ${equipmentType === key ? "#0070ba" : "#e2e8f0"}`,
                    color: equipmentType === key ? "#003087" : "#475569",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontSize: "12.5px", fontWeight: "600" }}>{item.name}</div>
                  <div style={{ fontSize: "11px", color: "#059669", marginTop: "2px", fontWeight: "600" }}>
                    ${item.negotiated}/unit (Save ${item.retail - item.negotiated})
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Unit Slider */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>Quantity to Commit:</span>
              <span style={{ fontSize: "18px", fontWeight: "700", color: "#0070ba" }} className="tabular-nums">
                {units} units (${investedAmount.toLocaleString()} USD)
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="30"
              value={units}
              onChange={(e) => setUnits(parseInt(e.target.value))}
              style={{ width: "100%", accentColor: "#0070ba", cursor: "pointer", height: "6px" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
              <span>2 units (${(2 * selected.negotiated).toLocaleString()})</span>
              <span>15 units (${(15 * selected.negotiated).toLocaleString()})</span>
              <span>30 units (${(30 * selected.negotiated).toLocaleString()})</span>
            </div>
          </div>

          {/* Aggregated Pool Progress */}
          <div style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "14px 16px",
            fontSize: "13px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ color: "#64748b" }}>Current Peer Commitments:</span>
              <span style={{ color: "#0f172a", fontWeight: "600" }}>{selected.existingCommitted} units committed</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ color: "#64748b" }}>With Your Order:</span>
              <strong style={{ color: "#0070ba" }}>{totalPoolAfterInvestment} / {selected.poolTarget} units ({progressTowardsTarget}%)</strong>
            </div>
            <div style={{ width: "100%", height: "6px", background: "#e2e8f0", borderRadius: "3px", overflow: "hidden", marginTop: "8px" }}>
              <div style={{ width: `${progressTowardsTarget}%`, height: "100%", background: progressTowardsTarget >= 100 ? "#059669" : "#0070ba" }} />
            </div>
          </div>
        </Card>

        {/* Right: Probability & Financial Outcome */}
        <Card style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>
              2. Fulfillment Probability & Savings
            </div>
            <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "18px" }}>
              Empirical likelihood of pool closing at tier-1 pricing.
            </div>

            {/* Probability Metric Display */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "18px",
              padding: "14px 16px",
              borderRadius: "8px",
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              marginBottom: "16px",
            }}>
              <div style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                background: "#ffffff",
                border: "3px solid #0070ba",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                <div style={{ fontSize: "18px", fontWeight: "700", color: "#003087" }}>{fulfillmentProbability}%</div>
                <div style={{ fontSize: "10px", color: "#64748b", fontWeight: "600" }}>Confidence</div>
              </div>

              <div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>
                  {totalPoolAfterInvestment >= selected.poolTarget ? "Tier-1 Pricing Guaranteed" : "High Fulfillment Confidence"}
                </div>
                <div style={{ fontSize: "12px", color: "#64748b", marginTop: "3px", lineHeight: "1.4" }}>
                  Historical order aggregation indicates the remaining volume will be finalized before the 30-day RFQ expiration.
                </div>
              </div>
            </div>

            {/* Savings & Fees */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px", fontSize: "12.5px" }}>
              <div style={{ background: "#f8fafc", padding: "10px 12px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                <div style={{ color: "#64748b" }}>Equipment Savings:</div>
                <div style={{ fontSize: "16px", fontWeight: "700", color: "#059669", marginTop: "2px" }}>+${directSavings.toLocaleString()} USD</div>
              </div>
              <div style={{ background: "#f8fafc", padding: "10px 12px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                <div style={{ color: "#64748b" }}>PayPal Fee vs Bank Wire:</div>
                <div style={{ fontSize: "16px", fontWeight: "700", color: "#0070ba", marginTop: "2px" }}>Save ${financingSaved}</div>
              </div>
            </div>

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 14px",
              background: "#ecfdf5",
              borderRadius: "6px",
              border: "1px solid #a7f3d0",
              marginBottom: "16px",
            }}>
              <div>
                <div style={{ fontSize: "11px", color: "#065f46", fontWeight: "600" }}>Total Net Value Retained</div>
                <div style={{ fontSize: "18px", fontWeight: "700", color: "#059669" }}>+${totalNetCustomerGain} USD</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "11px", color: "#065f46", fontWeight: "600" }}>Customer Margin Gain</div>
                <div style={{ fontSize: "18px", fontWeight: "700", color: "#059669" }}>+{customerRoi}%</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onStartCheckout({
              id: 1,
              name: selected.name,
              qty: units,
              amount: investedAmount,
              savings: directSavings,
            })}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "12px 20px",
              background: "#ffc439",
              color: "#003087",
              borderRadius: "24px",
              fontSize: "14px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
            }}
          >
            <Icons.PayPal /> Authorize ${investedAmount.toLocaleString()} via PayPal Escrow
          </button>
        </Card>
      </div>

      {/* ── Probability Curve: Robinhood-style hero chart ── */}
      <Card style={{ padding: "0", overflow: "hidden" }}>
        {/* Chart Header Strip */}
        <div style={{ padding: "20px 24px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "4px" }}>
                Fulfillment Confidence
              </div>
              <div style={{ fontSize: "36px", fontWeight: "700", color: "#003087", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                {fulfillmentProbability}%
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px" }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "3px",
                  fontSize: "13px", fontWeight: "600",
                  color: fulfillmentProbability >= 90 ? "#059669" : fulfillmentProbability >= 80 ? "#d97706" : "#64748b",
                }}>
                  {fulfillmentProbability >= 90 ? "▲" : fulfillmentProbability >= 80 ? "▲" : "—"}
                  {` ${units} units committed`}
                </span>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>· ${investedAmount.toLocaleString()} authorized</span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
              <span style={{ fontSize: "11px", background: fulfillmentProbability >= 90 ? "#dcfce7" : "#eff6ff", color: fulfillmentProbability >= 90 ? "#15803d" : "#0369a1", padding: "3px 10px", borderRadius: "20px", fontWeight: "700" }}>
                {fulfillmentProbability >= 90 ? "Tier-1 Locked" : fulfillmentProbability >= 80 ? "Near Lock" : "Open Pool"}
              </span>
              <span style={{
                fontSize: "10.5px",
                background: hoverUnits ? "#eff6ff" : "#f8fafc",
                color: hoverUnits ? "#0070ba" : "#94a3b8",
                border: `1px solid ${hoverUnits ? "#bfdbfe" : "#e2e8f0"}`,
                padding: "2px 8px",
                borderRadius: "12px",
                fontWeight: "600",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: hoverUnits ? "#0070ba" : "#94a3b8", display: "inline-block" }} />
                {hoverUnits ? "Live Crosshair Tracking" : "Hover / Drag to Scrub"}
              </span>
            </div>
          </div>

          {/* Mini KPI Row */}
          <div style={{ display: "flex", gap: "24px", marginTop: "16px", paddingBottom: "14px", borderBottom: "1px solid #f1f5f9" }}>
            {[
              { label: "Pool Progress", value: `${progressTowardsTarget}%` },
              { label: "Your Saving", value: `$${directSavings.toLocaleString()}` },
              { label: "PayPal Fee", value: `$${paypalFee}` },
              { label: "Net Gain", value: `+$${totalNetCustomerGain}` },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "500", marginBottom: "2px" }}>{label}</div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SVG Chart — full-bleed with altered interactive crosshair cursor */}
        <div style={{ width: "100%", position: "relative", background: "#fafcff" }}>
          <svg
            ref={svgRef}
            onClick={handleSvgClick}
            onMouseMove={handleSvgMouseMove}
            onMouseDown={handleSvgMouseDown}
            onMouseUp={handleSvgMouseUp}
            onMouseLeave={handleSvgMouseLeave}
            onTouchStart={handleSvgMouseDown}
            onTouchMove={handleSvgMouseMove}
            onTouchEnd={handleSvgMouseUp}
            viewBox="0 0 800 220"
            style={{
              width: "100%",
              display: "block",
              cursor: isDragging ? "grabbing" : "crosshair",
              userSelect: "none",
              touchAction: "none",
            }}
            preserveAspectRatio="none"
          >
            {/* Y-axis label track */}
            <rect x="0" y="0" width="52" height="220" fill="#fafcff" />

            {/* Horizontal grid bands */}
            {[0, 1, 2, 3].map((i) => {
              const y = 20 + i * 55;
              const pct = [100, 85, 70, 60][i];
              return (
                <g key={i}>
                  <line x1="52" y1={y} x2="800" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                  <text x="46" y={y + 4} fill="#b0bac7" fontSize="10" textAnchor="end" fontFamily="sans-serif">{pct}%</text>
                </g>
              );
            })}
            {/* Baseline */}
            <line x1="52" y1="185" x2="800" y2="185" stroke="#e2e8f0" strokeWidth="1.5" />

            {/* Gradient fill under curve */}
            <defs>
              <linearGradient id="probGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* Filled area path */}
            <path
              d={(() => {
                const pts = curvePoints.map(p => ({
                  x: 52 + ((p.u - 2) / 28) * 748,
                  y: 20 + ((100 - parseFloat(p.prob)) / 42) * 165,
                }));
                const sp = getSmoothSpline(pts);
                const last = pts[pts.length - 1];
                const first = pts[0];
                return sp + ` L ${last.x.toFixed(1)} 185 L ${first.x.toFixed(1)} 185 Z`;
              })()}
              fill="url(#probGrad)"
              stroke="none"
            />

            {/* Main curve line */}
            <path
              d={(() => {
                const pts = curvePoints.map(p => ({
                  x: 52 + ((p.u - 2) / 28) * 748,
                  y: 20 + ((100 - parseFloat(p.prob)) / 42) * 165,
                }));
                return getSmoothSpline(pts);
              })()}
              fill="none"
              stroke="#2563eb"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Tier boundary lines */}
            {[{ u: 10, label: "Tier 1" }, { u: 20, label: "Tier 2" }, { u: 28, label: "Tier 3" }].map(({ u, label }) => {
              const tx = 52 + ((u - 2) / 28) * 748;
              return (
                <g key={u}>
                  <line x1={tx} y1="20" x2={tx} y2="185" stroke="#dbeafe" strokeWidth="1" strokeDasharray="4 3" />
                  <text x={tx + 4} y="32" fill="#93c5fd" fontSize="9" fontFamily="sans-serif">{label}</text>
                </g>
              );
            })}

            {/* Altered Interactive Crosshair Cursor System */}
            {(() => {
              const ax = 52 + ((displayUnits - 2) / 28) * 748;
              const ay = 20 + ((100 - fulfillmentProbability) / 42) * 165;
              const tooltipX = Math.min(680, Math.max(140, ax));
              return (
                <g>
                  {/* Vertical hairline crosshair */}
                  <line x1={ax} y1="20" x2={ax} y2="185" stroke="#0070ba" strokeWidth="1.5" strokeDasharray="3 3" />

                  {/* Horizontal tracking hairline crosshair */}
                  <line x1="52" y1={ay} x2={ax} y2={ay} stroke="#0070ba" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.5" />

                  {/* Y-axis dynamic coordinate badge */}
                  <rect x="4" y={ay - 10} width="44" height="20" rx="4" fill="#003087" />
                  <text x="26" y={ay + 4} fill="#ffffff" fontSize="10" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">
                    {fulfillmentProbability}%
                  </text>

                  {/* X-axis dynamic coordinate badge */}
                  <rect x={ax - 19} y="188" width="38" height="20" rx="4" fill="#003087" />
                  <text x={ax} y="202" fill="#ffffff" fontSize="10.5" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">
                    {displayUnits}u
                  </text>

                  {/* Multi-ring Magnetic Reticle on Curve */}
                  <circle cx={ax} cy={ay} r="14" fill="#0070ba" fillOpacity="0.14" />
                  <circle cx={ax} cy={ay} r="8" fill="none" stroke="#0070ba" strokeWidth="1.5" strokeOpacity="0.6" />
                  <circle cx={ax} cy={ay} r="5" fill="#0070ba" />
                  <circle cx={ax} cy={ay} r="2" fill="#ffffff" />

                  {/* Floating Tooltip Card */}
                  <g transform={`translate(${tooltipX}, ${Math.max(48, ay - 44)})`}>
                    <rect x="-80" y="-22" width="160" height="42" rx="8" fill="#003087" filter="drop-shadow(0 4px 12px rgba(0, 48, 135, 0.25))" />
                    <text x="0" y="-6" fill="#ffffff" fontSize="12" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">
                      {displayUnits} Units · {fulfillmentProbability}% Confidence
                    </text>
                    <text x="0" y="12" fill="#93c5fd" fontSize="10" textAnchor="middle" fontFamily="sans-serif">
                      ${investedAmount.toLocaleString()} · save ${directSavings.toLocaleString()}
                    </text>
                  </g>
                </g>
              );
            })()}

            {/* X-axis unit ticks */}
            {[2, 8, 14, 20, 26, 30].map((u) => {
              const tx = 52 + ((u - 2) / 28) * 748;
              return (
                <g key={u}>
                  <text x={tx} y="218" fill="#b0bac7" fontSize="10" textAnchor="middle" fontFamily="sans-serif">{u}u</text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Scrubber Footer */}
        <div style={{ padding: "14px 24px 20px", borderTop: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#94a3b8", marginBottom: "6px" }}>
            <span>2 units</span>
            <span style={{ color: "#0070ba", fontWeight: "600" }}>Drag to adjust commitment</span>
            <span>30 units</span>
          </div>
          <input
            type="range" min="2" max="30" value={units}
            onChange={(e) => setUnits(parseInt(e.target.value))}
            style={{ width: "100%", accentColor: "#2563eb", cursor: "pointer", height: "6px" }}
          />
        </div>
      </Card>
    </>
  );
}

// --- View 3: Dedicated Demand & Savings Interactive Graph Module ---

function DemandAndSavingsGraph({ onStartCheckout }) {
  const [activeUnits, setActiveUnits] = useState(25);
  const [hoverUnits, setHoverUnits] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [equipmentType, setEquipmentType] = useState("pump");
  const svgRef = useRef(null);

  const catalog = {
    pump:  { name: "Industrial Centrifugal Pump 5HP",   retail: 415, negotiated: 365, maxUnits: 60,
              tiers: [{max:10,p:415},{max:25,p:385},{max:45,p:365},{max:60,p:340}] },
    motor: { name: "3-Phase Induction Motor 15kW",      retail: 570, negotiated: 480, maxUnits: 40,
              tiers: [{max:10,p:570},{max:25,p:520},{max:35,p:480},{max:40,p:450}] },
    flow:  { name: "Electromagnetic Flowmeter DN80",    retail: 475, negotiated: 390, maxUnits: 40,
              tiers: [{max:10,p:475},{max:22,p:440},{max:35,p:390},{max:40,p:360}] },
    valve: { name: "High-Pressure Gate Valve PN25",     retail: 260, negotiated: 210, maxUnits: 60,
              tiers: [{max:12,p:260},{max:28,p:235},{max:45,p:210},{max:60,p:190}] },
  };

  function getTierPrice(tiers, u) {
    for (const t of tiers) { if (u <= t.max) return t.p; }
    return tiers[tiers.length - 1].p;
  }

  const current = catalog[equipmentType];
  const maxU = current.maxUnits;

  const displayUnits = hoverUnits ?? activeUnits;
  const currentTierPrice = getTierPrice(current.tiers, displayUnits);
  const currentRetailTotal = displayUnits * current.retail;
  const currentCollectiveTotal = displayUnits * currentTierPrice;
  const currentSavings = currentRetailTotal - currentCollectiveTotal;

  const maxY = current.retail * maxU;

  // Generate dense point arrays for smooth spline curves
  const graphPoints = useMemo(() => {
    return Array.from({ length: maxU }, (_, i) => {
      const u = i + 1;
      const x = 58 + (u / maxU) * 742;
      const retailY = 16 + (1 - (u * current.retail) / maxY) * 180;
      const collectivePrice = getTierPrice(current.tiers, u);
      const collectiveY = 16 + (1 - (u * collectivePrice) / maxY) * 180;
      return { u, x, retailY, collectiveY, savings: u * (current.retail - collectivePrice) };
    });
  }, [current, maxU, maxY]);

  // Tier boundary positions for annotation lines
  const tierBoundaries = current.tiers.slice(0, -1).map((t) => ({
    u: t.max,
    x: 58 + (t.max / maxU) * 742,
  }));

  function getUnitsFromGraphEvent(e) {
    if (!svgRef.current) return null;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
    const clickX = clientX - rect.left;
    const scale = 800 / rect.width;
    const svgX = clickX * scale;
    const ratio = Math.max(0, Math.min(1, (svgX - 58) / 742));
    return Math.max(1, Math.min(maxU, Math.round(ratio * maxU)));
  }

  function handleGraphMouseMove(e) {
    const u = getUnitsFromGraphEvent(e);
    if (u !== null) {
      setHoverUnits(u);
      if (isDragging) {
        setActiveUnits(u);
      }
    }
  }

  function handleGraphMouseDown(e) {
    setIsDragging(true);
    const u = getUnitsFromGraphEvent(e);
    if (u !== null) {
      setActiveUnits(u);
      setHoverUnits(u);
    }
  }

  function handleGraphMouseUp() {
    setIsDragging(false);
  }

  function handleGraphMouseLeave() {
    setIsDragging(false);
    setHoverUnits(null);
  }

  function handleGraphClick(e) {
    const u = getUnitsFromGraphEvent(e);
    if (u !== null) {
      setActiveUnits(u);
      setHoverUnits(u);
    }
  }

  return (
    <>
      <PageHeader
        title="Demand & Savings Analytics"
        description="Real-time divergence between retail catalog spend and PayPal collective bulk pricing across procurement tiers."
        badge="Live Visualizer"
      />

      {/* ── Equipment Selector Tabs ── */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "20px", flexWrap: "wrap" }}>
        {Object.entries(catalog).map(([key, item]) => (
          <button
            key={key}
            onClick={() => setEquipmentType(key)}
            style={{
              padding: "7px 16px",
              borderRadius: "20px",
              background: equipmentType === key ? "#003087" : "#ffffff",
              border: `1.5px solid ${equipmentType === key ? "#003087" : "#e2e8f0"}`,
              color: equipmentType === key ? "#ffffff" : "#475569",
              fontSize: "12.5px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {item.name.split(" ").slice(0, 2).join(" ")}
          </button>
        ))}
      </div>

      {/* ── Main Chart + Side Panel Layout ── */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 280px", gap: "20px", marginBottom: "20px", alignItems: "stretch", width: "100%" }}>

        {/* LEFT: Hero Chart Card */}
        <Card style={{ padding: "0", overflow: "hidden" }}>

          {/* Chart header with big number */}
          <div style={{ padding: "20px 24px 14px", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>
                  Cash Retained at {activeUnits} units
                </div>
                <div style={{ fontSize: "38px", fontWeight: "700", color: "#059669", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                  ${currentSavings.toLocaleString()}
                </div>
                <div style={{ fontSize: "13px", color: "#64748b", marginTop: "5px" }}>
                  ${currentRetailTotal.toLocaleString()} retail → ${currentCollectiveTotal.toLocaleString()} collective
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                <span style={{
                  fontSize: "10.5px",
                  background: hoverUnits ? "#eff6ff" : "#f8fafc",
                  color: hoverUnits ? "#2563eb" : "#94a3b8",
                  border: `1px solid ${hoverUnits ? "#bfdbfe" : "#e2e8f0"}`,
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontWeight: "600",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: hoverUnits ? "#2563eb" : "#94a3b8", display: "inline-block" }} />
                  {hoverUnits ? "Live Crosshair Tracking" : "Hover / Drag to Scrub"}
                </span>
                {/* Legend */}
                <div style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "11.5px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                    <span style={{ width: "24px", height: "2px", background: "#94a3b8", display: "inline-block", borderTop: "2px dashed #94a3b8" }} />
                    <span style={{ color: "#64748b" }}>Retail ${current.retail}/u</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                    <span style={{ width: "24px", height: "3px", background: "#2563eb", display: "inline-block", borderRadius: "2px" }} />
                    <span style={{ color: "#2563eb", fontWeight: "600" }}>Collective from ${current.tiers[current.tiers.length - 1].p}/u</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                    <span style={{ width: "14px", height: "10px", background: "#dcfce7", border: "1px solid #86efac", display: "inline-block", borderRadius: "2px" }} />
                    <span style={{ color: "#059669", fontWeight: "600" }}>Savings zone</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SVG Chart — full bleed with altered interactive crosshair cursor */}
          <div style={{ width: "100%", background: "#fafcff", position: "relative" }}>
            <svg
              ref={svgRef}
              onClick={handleGraphClick}
              onMouseMove={handleGraphMouseMove}
              onMouseDown={handleGraphMouseDown}
              onMouseUp={handleGraphMouseUp}
              onMouseLeave={handleGraphMouseLeave}
              onTouchStart={handleGraphMouseDown}
              onTouchMove={handleGraphMouseMove}
              onTouchEnd={handleGraphMouseUp}
              viewBox="0 0 800 240"
              style={{
                width: "100%",
                display: "block",
                cursor: isDragging ? "grabbing" : "crosshair",
                userSelect: "none",
                touchAction: "none",
              }}
              preserveAspectRatio="none"
            >
              {/* Gradient defs */}
              <defs>
                <marker id="arrowUp" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                </marker>
                <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity="0.04" />
                </linearGradient>
                <linearGradient id="retailGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#94a3b8" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Y-axis backdrop */}
              <rect x="0" y="0" width="58" height="240" fill="#fafcff" />

              {/* Horizontal grid lines */}
              {[0, 1, 2, 3].map((i) => {
                const y = 16 + i * 54;
                const val = Math.round(maxY * (1 - i * 0.33));
                return (
                  <g key={i}>
                    <line x1="58" y1={y} x2="800" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                    <text x="52" y={y + 4} fill="#b0bac7" fontSize="10" textAnchor="end" fontFamily="sans-serif">
                      ${val >= 1000 ? (val / 1000).toFixed(0) + "k" : val}
                    </text>
                  </g>
                );
              })}
              {/* Baseline */}
              <line x1="58" y1="196" x2="800" y2="196" stroke="#e2e8f0" strokeWidth="1.5" />
              <text x="52" y="200" fill="#b0bac7" fontSize="10" textAnchor="end" fontFamily="sans-serif">$0</text>

              {/* Map graphPoints to new coordinate space */}
              {(() => {
                const toY = (val) => 16 + (1 - val / maxY) * 180;
                const pts = graphPoints.map((p) => ({
                  x: 58 + (p.u / maxU) * 742,
                  retailY: toY(p.u * current.retail),
                  collectiveY: toY(p.u * getTierPrice(current.tiers, p.u)),
                }));

                const rSpline = getSmoothSpline(pts.map(p => ({ x: p.x, y: p.retailY })));
                const cSpline = getSmoothSpline(pts.map(p => ({ x: p.x, y: p.collectiveY })));
                const lastP = pts[pts.length - 1];
                const firstP = pts[0];
                const savingsFill = cSpline
                  + ` L ${lastP.x.toFixed(1)} ${lastP.retailY.toFixed(1)}`
                  + " " + getSmoothSpline([...pts].reverse().map(p => ({ x: p.x, y: p.retailY })))
                  + " Z";

                // Tier boundary positions
                const boundaries = current.tiers.slice(0, -1).map(t => ({
                  u: t.max,
                  x: 58 + (t.max / maxU) * 742,
                }));

                // Active crosshair values
                const ax = 58 + (displayUnits / maxU) * 742;
                const aRetailY = toY(currentRetailTotal);
                const aCollY = toY(currentCollectiveTotal);
                const tooltipX = Math.min(680, Math.max(140, ax));

                return (
                  <g>
                    {/* Savings gradient fill */}
                    <path d={savingsFill} fill="url(#savingsGrad)" stroke="none" />

                    {/* Retail area fill */}
                    <path
                      d={rSpline + ` L ${lastP.x.toFixed(1)} 196 L ${firstP.x.toFixed(1)} 196 Z`}
                      fill="url(#retailGrad)"
                      stroke="none"
                    />

                    {/* Retail dashed line */}
                    <path d={rSpline} fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round" />

                    {/* Collective solid blue line */}
                    <path d={cSpline} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />

                    {/* Tier boundary verticals */}
                    {boundaries.map(({ u, x }) => (
                      <g key={u}>
                        <line x1={x} y1="16" x2={x} y2="196" stroke="#dbeafe" strokeWidth="1" strokeDasharray="4 3" />
                        <text x={x + 4} y="28" fill="#93c5fd" fontSize="9" fontFamily="sans-serif">T{current.tiers.findIndex(t => t.max === u) + 1}</text>
                      </g>
                    ))}

                    {/* X-axis ticks */}
                    {[1, ...current.tiers.map(t => t.max)].map((u) => {
                      const tx = 58 + (u / maxU) * 742;
                      return (
                        <g key={u}>
                          <line x1={tx} y1="196" x2={tx} y2="202" stroke="#e2e8f0" />
                          <text x={tx} y="216" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="sans-serif">{u}u</text>
                        </g>
                      );
                    })}

                    {/* Altered Interactive Crosshair Cursor System */}
                    <line x1={ax} y1="16" x2={ax} y2="196" stroke="#0070ba" strokeWidth="1.5" strokeDasharray="3 3" />

                    {/* Horizontal tracking hairlines */}
                    <line x1="58" y1={aCollY} x2={ax} y2={aCollY} stroke="#0070ba" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.5" />
                    <line x1="58" y1={aRetailY} x2={ax} y2={aRetailY} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.4" />

                    {/* Dynamic Y-Axis Coordinate Badge for Collective */}
                    <rect x="3" y={aCollY - 10} width="52" height="20" rx="4" fill="#003087" />
                    <text x="29" y={aCollY + 4} fill="#ffffff" fontSize="9.5" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">
                      ${currentCollectiveTotal >= 1000 ? (currentCollectiveTotal / 1000).toFixed(1) + "k" : currentCollectiveTotal}
                    </text>

                    {/* Dynamic X-Axis Coordinate Badge */}
                    <rect x={ax - 19} y="199" width="38" height="20" rx="4" fill="#003087" />
                    <text x={ax} y="213" fill="#ffffff" fontSize="10.5" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">
                      {displayUnits}u
                    </text>

                    {/* Retail dot */}
                    <circle cx={ax} cy={aRetailY} r="5" fill="#ffffff" stroke="#94a3b8" strokeWidth="2.5" />

                    {/* Multi-ring Collective Reticle Bead */}
                    <circle cx={ax} cy={aCollY} r="14" fill="#2563eb" fillOpacity="0.14" />
                    <circle cx={ax} cy={aCollY} r="8" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeOpacity="0.6" />
                    <circle cx={ax} cy={aCollY} r="5" fill="#2563eb" />
                    <circle cx={ax} cy={aCollY} r="2" fill="#ffffff" />

                    {/* Vertical delta bar between retail and collective */}
                    <line x1={ax} y1={aCollY + 7} x2={ax} y2={aRetailY - 6} stroke="#10b981" strokeWidth="2" strokeDasharray="2 2" />

                    {/* Floating Tooltip Card */}
                    <g transform={`translate(${tooltipX}, ${Math.max(48, aCollY - 44)})`}>
                      <rect x="-120" y="-24" width="240" height="46" rx="8" fill="#003087" filter="drop-shadow(0 4px 12px rgba(0, 48, 135, 0.25))" />
                      <text x="0" y="-7" fill="#ffffff" fontSize="13" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">
                        {displayUnits} units · Save ${currentSavings.toLocaleString()}
                      </text>
                      <text x="-80" y="13" fill="#93c5fd" fontSize="10" textAnchor="start" fontFamily="sans-serif">
                        Retail ${currentRetailTotal.toLocaleString()}
                      </text>
                      <text x="80" y="13" fill="#86efac" fontSize="10" fontWeight="600" textAnchor="end" fontFamily="sans-serif">
                        Collective ${currentCollectiveTotal.toLocaleString()}
                      </text>
                    </g>
                  </g>
                );
              })()}
            </svg>
          </div>

          {/* Scrubber row */}
          <div style={{ padding: "12px 24px 18px", borderTop: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#94a3b8", marginBottom: "5px" }}>
              <span>1 unit</span>
              <span style={{ color: "#2563eb", fontWeight: "600" }}>Volume: {displayUnits} units</span>
              <span>{maxU} units</span>
            </div>
            <input
              type="range" min="1" max={maxU} value={displayUnits}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setActiveUnits(val);
                setHoverUnits(val);
              }}
              style={{ width: "100%", accentColor: "#2563eb", cursor: "pointer" }}
            />
          </div>
        </Card>

        {/* RIGHT: Summary Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Current Tier Badge */}
          <Card style={{ textAlign: "center", padding: "16px" }}>
            <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
              Current Tier
            </div>
            <div style={{ fontSize: "28px", fontWeight: "700", color: "#2563eb" }}>
              ${currentTierPrice}/u
            </div>
            <div style={{ fontSize: "12px", color: "#059669", fontWeight: "600", marginTop: "4px" }}>
              Save ${current.retail - currentTierPrice}/unit vs retail
            </div>
            <div style={{ marginTop: "12px", width: "100%", height: "6px", background: "#e2e8f0", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ width: `${(displayUnits / maxU) * 100}%`, height: "100%", background: "#2563eb", borderRadius: "3px", transition: "width 0.1s ease" }} />
            </div>
            <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>{displayUnits} / {maxU} max</div>
          </Card>

          {/* Tier Breakdown */}
          <Card style={{ padding: "14px 16px" }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a", marginBottom: "10px" }}>Pricing Tiers</div>
            {current.tiers.map((t, i) => {
              const prevMax = i === 0 ? 0 : current.tiers[i - 1].max;
              const isActive = displayUnits > prevMax && displayUnits <= t.max;
              return (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "7px 10px", borderRadius: "6px", marginBottom: "5px",
                  background: isActive ? "#eff6ff" : "#f8fafc",
                  border: `1px solid ${isActive ? "#bfdbfe" : "#f1f5f9"}`,
                  transition: "all 0.15s ease",
                }}>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: "600", color: isActive ? "#1d4ed8" : "#64748b" }}>
                      {prevMax + 1}–{t.max} units
                    </div>
                    <div style={{ fontSize: "10px", color: "#94a3b8" }}>Tier {i + 1}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "13px", fontWeight: "700", color: isActive ? "#1d4ed8" : "#0f172a" }}>${t.p}/u</div>
                    <div style={{ fontSize: "10px", color: "#059669", fontWeight: "600" }}>
                      {Math.round(((current.retail - t.p) / current.retail) * 100)}% off
                    </div>
                  </div>
                </div>
              );
            })}
          </Card>

          {/* Authorize Button */}
          <button
            onClick={() => onStartCheckout({
              id: 1,
              name: current.name,
              qty: displayUnits,
              amount: currentCollectiveTotal,
              savings: currentSavings,
            })}
            style={{
              width: "100%",
              padding: "14px 16px",
              background: "#ffc439",
              color: "#003087",
              borderRadius: "24px",
              fontSize: "13px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0, 48, 135, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              border: "none",
            }}
          >
            <Icons.PayPal /> Authorize ${currentCollectiveTotal.toLocaleString()}
          </button>
        </div>
      </div>

      {/* ── Bottom Summary Stats ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
        <Stat label="Total Retail Cost" value={`$${currentRetailTotal.toLocaleString()}`} sub="At standard single-unit price" />
        <Stat label="PayPal Collective Cost" value={`$${currentCollectiveTotal.toLocaleString()}`} sub="Tier-adjusted bulk pricing" />
        <Stat label="Direct Cash Retained" value={`$${currentSavings.toLocaleString()}`} sub="Immediate margin preserved" delta />
      </div>
    </>
  );
}

// --- View 4: PayPal Enterprise Services & Multi-Gateway Hub ---

function PayPalEnterpriseServicesHub({ onNavigate }) {
  const [services, setServices] = useState([
    {
      id: "paypal_escrow",
      name: "PayPal Orders v2 Bilateral Escrow",
      badge: "Core Active Rail",
      status: "Active & Operating",
      description: "Cryptographic escrow hold on server-side. Funds held independently with zero pooling or commingling. Captured only after physical dispatch is confirmed.",
      customer_benefit: "Completely eliminates supplier delivery risk. Protected by 180-day buyer dispute guarantees.",
      processing_fee: "1.5% flat (Save 2.0% vs traditional bank wire & letters of credit)",
      recommended_for: "All collective procurement pools ($1,000 - $100,000)",
      activeState: true,
    },
    {
      id: "paypal_working_capital",
      name: "PayPal Commercial Working Capital",
      badge: "Growth Financing",
      status: "Pre-Approved",
      description: "Instant pre-approved credit lines from $10,000 to $50,000 based on verified procurement invoice history with one single fixed fee.",
      customer_benefit: "Allows enterprise buyers to participate in higher volume tiers without exhausting operating cash.",
      processing_fee: "Single fixed fee (Zero compounding monthly interest)",
      recommended_for: "SMEs expanding orders from individual units to 30+ unit bulk tiers",
      activeState: true,
    },
    {
      id: "paypal_subscriptions",
      name: "PayPal Recurring B2B Replenishment",
      badge: "Scheduled Buying",
      status: "Available to Activate",
      description: "Automated recurring order scheduling for periodic industrial consumables (mechanical seals, filter media, replacement impellers).",
      customer_benefit: "Prevents plant downtime by clustering recurring replenishment dates into scheduled volume pools.",
      processing_fee: "Standard PayPal merchant processing",
      recommended_for: "Recurring 6-month & 12-month facility maintenance agreements",
      activeState: false,
    },
    {
      id: "ach_direct_rail",
      name: "PayPal Braintree Corporate ACH Rail",
      badge: "High-Volume Settlement",
      status: "Available to Activate",
      description: "Direct bank-to-bank automated clearing house settlement for major municipal and civil infrastructure purchase orders exceeding $50,000.",
      customer_benefit: "Lowest possible payment settlement cost ($5.00 flat fee cap) on high-value equipment acquisitions.",
      processing_fee: "0.75% capped at $5.00 per transaction",
      recommended_for: "Civil engineering and municipal infrastructure orders > $50,000",
      activeState: false,
    },
    {
      id: "iot_escrow_release",
      name: "IoT Delivery Verification Gate",
      badge: "Automated Quality Lock",
      status: "Active Telemetry",
      description: "PayPal webhook integration with industrial dispatch sensors. Escrow released only when digital signature and sensor telemetry confirm spec compliance.",
      customer_benefit: "Ensures pump flow specifications (50 m³/h) and motor ratings (IP55) are verified prior to vendor payout.",
      processing_fee: "Included in standard PayPal Orders v2",
      recommended_for: "Precision-engineered fluid pumps and calibrated sensors",
      activeState: true,
    },
  ]);

  function toggleService(id) {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, activeState: !s.activeState } : s))
    );
  }

  return (
    <>
      <PageHeader
        title="PayPal Enterprise Services & Payment Gateway Hub"
        description="Adopt institutional PayPal payment rails in your corporate procurement workflow: escrow, working capital, and ACH settlement."
        badge="Payment Rails"
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "14px", marginBottom: "24px" }}>
        {services.map((s) => (
          <Card key={s.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>{s.name}</div>
                  <span style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    background: s.activeState ? "#eff6ff" : "#f1f5f9",
                    color: s.activeState ? "#0070ba" : "#64748b",
                    border: `1px solid ${s.activeState ? "#bfdbfe" : "#e2e8f0"}`,
                  }}>
                    {s.badge}
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: "#64748b", marginTop: "4px", lineHeight: "1.5" }}>
                  {s.description}
                </div>
              </div>

              <button
                onClick={() => toggleService(s.id)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  background: s.activeState ? "#ecfdf5" : "#ffffff",
                  color: s.activeState ? "#059669" : "#475569",
                  border: `1px solid ${s.activeState ? "#a7f3d0" : "#d1d5db"}`,
                }}
              >
                {s.activeState ? "Active in Enterprise" : "Activate Rail"}
              </button>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "1.5fr 1fr",
              gap: "12px",
              padding: "10px 14px",
              background: "#f8fafc",
              borderRadius: "6px",
              border: "1px solid #e2e8f0",
              fontSize: "12px",
            }}>
              <div>
                <strong style={{ color: "#0070ba" }}>Direct Customer Benefit:</strong>{" "}
                <span style={{ color: "#334155" }}>{s.customer_benefit}</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ color: "#64748b" }}>Processing Cost:</span>{" "}
                <strong style={{ color: "#059669" }}>{s.processing_fee}</strong>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

// --- View 5: Active Demand Pools ---

function ActiveDemandPools({ onStartCheckout }) {
  const pools = [
    {
      id: 1,
      name: "Industrial Centrifugal Water Pump 5HP",
      category: "Fluid Mechanics",
      target: 50,
      committed: 50,
      retail: 415,
      negotiated: 365,
      savings: 2500,
      status: "100% Target Reached",
      pct: 100,
      specs: "Flow 50 m³/h · Head 30m · IP55 · 400V 3-Phase",
    },
    {
      id: 2,
      name: "High-Efficiency 3-Phase Induction Motors 15kW",
      category: "Electromechanical",
      target: 30,
      committed: 24,
      retail: 570,
      negotiated: 480,
      savings: 2700,
      status: "Active Aggregation",
      pct: 80,
      specs: "15kW (20HP) · 1460 RPM · IE3 Premium · Cast Iron",
    },
    {
      id: 3,
      name: "Smart Electromagnetic Flowmeters DN80",
      category: "Industrial Sensors",
      target: 25,
      committed: 16,
      retail: 475,
      negotiated: 390,
      savings: 2125,
      status: "Active Aggregation",
      pct: 64,
      specs: "DN80 (3 inch) · Flanged PN16 · RS485 Modbus · PTFE",
    },
    {
      id: 4,
      name: "High-Pressure Industrial Gate Valves PN25",
      category: "Fluid Valves",
      target: 50,
      committed: 38,
      retail: 260,
      negotiated: 210,
      savings: 2500,
      status: "Active Aggregation",
      pct: 76,
      specs: "DN100 · Flanged PN25 · WCB Cast Steel · Stainless Trim",
    },
  ];

  return (
    <>
      <PageHeader
        title="Active Equipment Demand Pools"
        description="Pools currently aggregating commercial order quantities. Select an allocation to authorize escrow with PayPal."
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {pools.map((p) => (
          <Card key={p.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
              <div>
                <span style={{ fontSize: "11px", fontWeight: "600", color: "#0369a1", background: "#e0f2fe", padding: "2px 8px", borderRadius: "4px" }}>
                  {p.category}
                </span>
                <div style={{ fontSize: "15.5px", fontWeight: "700", color: "#0f172a", marginTop: "6px" }}>
                  {p.name}
                </div>
              </div>
              <span style={{
                fontSize: "11px",
                fontWeight: "600",
                padding: "3px 8px",
                borderRadius: "4px",
                background: p.pct === 100 ? "#ecfdf5" : "#fef3c7",
                color: p.pct === 100 ? "#059669" : "#b45309",
                border: `1px solid ${p.pct === 100 ? "#a7f3d0" : "#fde68a"}`,
              }}>
                {p.status}
              </span>
            </div>

            <div style={{ fontSize: "12.5px", color: "#64748b", marginBottom: "14px" }}>
              {p.specs}
            </div>

            {/* Progress bar */}
            <div style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                <span style={{ color: "#64748b" }}>{p.committed} of {p.target} units committed</span>
                <strong style={{ color: p.pct === 100 ? "#059669" : "#0070ba" }}>{p.pct}%</strong>
              </div>
              <div style={{ width: "100%", height: "6px", background: "#e2e8f0", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ width: `${p.pct}%`, height: "100%", background: p.pct === 100 ? "#059669" : "#0070ba" }} />
              </div>
            </div>

            {/* Price Box */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 12px",
              background: "#f8fafc",
              borderRadius: "6px",
              border: "1px solid #e2e8f0",
              fontSize: "12.5px",
              marginBottom: "16px",
            }}>
              <div>
                <span style={{ color: "#64748b" }}>Negotiated:</span>{" "}
                <strong style={{ color: "#059669" }}>${p.negotiated.toFixed(2)}</strong>{" "}
                <span style={{ textDecoration: "line-through", color: "#94a3b8", fontSize: "11px" }}>${p.retail}</span>
              </div>
              <div>
                <span style={{ color: "#64748b" }}>Collective Savings:</span>{" "}
                <strong style={{ color: "#059669" }}>${p.savings.toLocaleString()}</strong>
              </div>
            </div>

            <button
              onClick={() => onStartCheckout({
                id: p.id,
                name: p.name,
                qty: 10,
                amount: p.negotiated * 10,
                savings: (p.retail - p.negotiated) * 10,
              })}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "10px 16px",
                background: "#ffc439",
                color: "#003087",
                borderRadius: "20px",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
              }}
            >
              <Icons.PayPal /> Authorize 10 Units (${(p.negotiated * 10).toLocaleString()} USD)
            </button>
          </Card>
        ))}
      </div>
    </>
  );
}

// --- View 6: Procurement Forecasting ---

function PredictiveBuying() {
  const predictions = [
    { id: 1, buyer: "AquaFlow Industries", product: "Industrial Centrifugal Water Pump 5HP", qty: 12, date: "2026-12-15", confidence: "High", reason: "Recurring 5–6 month municipal replacement cycle verified from invoice records" },
    { id: 2, buyer: "GreenPump Solutions", product: "Industrial Centrifugal Water Pump 5HP", qty: 15, date: "2026-12-20", confidence: "Medium", reason: "Seasonal agricultural schedule and historical replenishment volume" },
    { id: 3, buyer: "HydroTech Systems", product: "Industrial Centrifugal Water Pump 5HP", qty: 23, date: "2026-12-10", confidence: "High", reason: "Scheduled Q4 infrastructure procurement allocation" },
  ];

  return (
    <>
      <PageHeader
        title="Procurement Demand Forecasting"
        description="Invoice pattern analysis and scheduled buying cycles aggregated across buyer organizations."
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {predictions.map((p) => (
          <Card key={p.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
              <div>
                <div style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a" }}>{p.product}</div>
                <div style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>
                  Procurement forecast for <strong style={{ color: "#0070ba" }}>{p.buyer}</strong> · Target delivery: {p.date}
                </div>
              </div>
              <span style={{
                fontSize: "11px",
                fontWeight: "600",
                padding: "3px 8px",
                borderRadius: "4px",
                background: "#ecfdf5",
                color: "#059669",
                border: "1px solid #a7f3d0",
              }}>
                {p.confidence} Confidence
              </span>
            </div>
            <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "12px", lineHeight: "1.5" }}>
              {p.reason}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "10px", borderTop: "1px solid #f1f5f9", fontSize: "12.5px" }}>
              <div>Forecasted Quantity: <strong style={{ color: "#0f172a" }}>{p.qty} units</strong></div>
              <span style={{ color: "#0070ba", fontWeight: "600" }}>Grouped into Pool #PO-2026-08</span>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

// --- View 7: Demand Aggregation ---

function DemandMesh() {
  const members = [
    { name: "AquaFlow Industries", qty: 12, share: "24%", sector: "Municipal Utilities" },
    { name: "GreenPump Solutions", qty: 15, share: "30%", sector: "Agricultural Systems" },
    { name: "HydroTech Systems", qty: 23, share: "46%", sector: "Civil Infrastructure" },
  ];

  return (
    <>
      <PageHeader
        title="Technical Specification Matching"
        description="Physical equipment tolerance and engineering specification matching across independent buyer orders."
      />

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <div style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a" }}>Specification Match: Centrifugal 5HP</div>
            <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>Reference: #SPEC-5HP-IP55</div>
          </div>
          <span style={{ fontSize: "11px", fontWeight: "600", color: "#059669", background: "#ecfdf5", padding: "3px 8px", borderRadius: "4px", border: "1px solid #a7f3d0" }}>
            100% Spec Match
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "16px" }}>
          {members.map((m) => (
            <div key={m.name} style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              padding: "14px",
            }}>
              <div style={{ fontSize: "11px", color: "#64748b" }}>{m.sector}</div>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a", margin: "4px 0 8px" }}>{m.name}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: "20px", fontWeight: "700", color: "#0070ba" }}>
                  {m.qty} <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "400" }}>units</span>
                </span>
                <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "500" }}>{m.share}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "12px",
          borderTop: "1px solid #e2e8f0",
          fontSize: "13px",
        }}>
          <div>
            <strong style={{ color: "#0f172a" }}>50 units combined</strong> · Unlocks Tier-1 Supplier Price Tier ($365/unit)
          </div>
          <div style={{ color: "#64748b", fontSize: "12px" }}>
            Flow 50 m³/h · Head 30m · IP55 · 400V
          </div>
        </div>
      </Card>
    </>
  );
}

// --- View 8: Volume Negotiations ---

function NegotiationRoom() {
  const messages = [
    { from: "Procurement Coordinator", text: "Issued collective RFQ for 50-unit volume commitment across 3 verified buyer organizations. Target unit rate: $350/unit.", type: "agent" },
    { from: "Equipment Manufacturer", text: "Counter-offered $365.00/unit (12.05% wholesale discount vs standard $415 retail) with 30-day price lock and warranty inclusion.", type: "supplier" },
    { from: "System Advisory", text: "Lock in $365.00/unit. Delivers $2,500 net direct savings across the cluster. Accept counter-offer.", type: "advisory" },
  ];

  return (
    <>
      <PageHeader
        title="Volume Negotiation Transcript"
        description="Automated counter-offers and multi-turn supplier volume agreements."
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "20px" }}>
        <Stat label="Retail Baseline" value="$415" sub="Standard catalog price" />
        <Stat label="Negotiated Offer" value="$365" sub="Locked for 50-unit pool" delta />
        <Stat label="Target Price" value="$350" sub="Initial RFQ objective" />
      </div>

      <Card>
        <div style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", marginBottom: "12px" }}>
          Negotiation History Log
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {messages.map((m, idx) => (
            <div key={idx} style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              padding: "12px 14px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}>
              <span style={{ fontSize: "11px", fontWeight: "600", color: "#0070ba" }}>{m.from}</span>
              <div style={{ fontSize: "13px", color: "#334155", lineHeight: "1.5" }}>{m.text}</div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

// --- View 8.5: Google Gemini AI Procurement Copilot ---

function GeminiCopilotView({ onStartCheckout, onNavigate }) {
  const [aiStatus, setAiStatus] = useState({ configured: false, model: "gemini-1.5-flash", provider: "Google Gemini AI" });
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      text: "Hello! I am your MINT Gemini AI Procurement Copilot. I analyze collective purchase volumes, evaluate supplier tier discount leverage, and ensure all transactions are protected under PayPal Orders v2 Bilateral Escrow.",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // Scenario Simulator
  const [simEquipment, setSimEquipment] = useState("pump");
  const [simUnits, setSimUnits] = useState(15);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  const equipmentCatalog = {
    pump: { name: "Industrial Centrifugal Pump 5HP", retail: 415, negotiated: 365, target: 50, committed: 38 },
    motor: { name: "3-Phase Induction Motor 15kW", retail: 570, negotiated: 480, target: 30, committed: 20 },
    flow: { name: "Electromagnetic Flowmeter DN80", retail: 475, negotiated: 390, target: 25, committed: 14 },
    valve: { name: "High-Pressure Gate Valve PN25", retail: 260, negotiated: 210, target: 50, committed: 32 },
  };

  const currentItem = equipmentCatalog[simEquipment];
  const simInvested = simUnits * currentItem.negotiated;
  const simSavings = simUnits * (currentItem.retail - currentItem.negotiated);

  useEffect(() => {
    fetch(`${getApiBase()}/api/v1/ai/status`)
      .then((res) => res.json())
      .then((data) => setAiStatus(data))
      .catch(() => setAiStatus({ configured: false, model: "gemini-1.5-flash", provider: "Google Gemini AI" }));
  }, []);

  async function handleSendMessage(customPrompt = null) {
    const textToSend = customPrompt || inputMessage;
    if (!textToSend.trim() || chatLoading) return;

    const userMsg = { role: "user", text: textToSend };
    setChatMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputMessage("");
    setChatLoading(true);

    try {
      const res = await fetch(`${getApiBase()}/api/v1/ai/copilot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          context: {
            equipment: currentItem.name,
            units: simUnits,
            retail_price: currentItem.retail,
            negotiated_price: currentItem.negotiated,
            total_invested: simInvested,
            savings: simSavings,
          },
        }),
      });
      const data = await res.json();
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.response || "No response received.", source: data.source },
      ]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Could not reach backend AI service at " + getApiBase() },
      ]);
    }
    setChatLoading(false);
  }

  async function handleRunAnalysis() {
    setAnalysisLoading(true);
    try {
      const res = await fetch(`${getApiBase()}/api/v1/ai/analyze-pool`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          equipment_type: currentItem.name,
          units: simUnits,
          retail_price: currentItem.retail,
          negotiated_price: currentItem.negotiated,
          pool_target: currentItem.target,
          current_committed: currentItem.committed,
        }),
      });
      const data = await res.json();
      setAnalysisResult(data);
    } catch (err) {
      alert("Error contacting Gemini AI analysis endpoint.");
    }
    setAnalysisLoading(false);
  }

  const quickPrompts = [
    "Analyze PayPal Escrow vs Bank Wire & Letter of Credit fees",
    "Recommend optimal volume tier to maximize company margin",
    "Generate negotiation counter-offer for 50 pump units",
    "Assess bilateral escrow protection against supplier non-delivery",
  ];

  return (
    <>
      <PageHeader
        title="Google Gemini AI Procurement Copilot"
        description="Real-time generative intelligence powered by Google Gemini to model tier discounts, optimize collective negotiations, and enforce PayPal Orders v2 bilateral escrow security."
        badge={aiStatus.configured ? "Gemini Live Active" : "Gemini Engine Ready"}
      />

      {/* Status Bar */}
      <Card style={{ marginBottom: "20px", padding: "14px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "10px", height: "10px", borderRadius: "50%",
              background: aiStatus.configured ? "#10b981" : "#0070ba",
              boxShadow: aiStatus.configured ? "0 0 8px rgba(16, 185, 129, 0.4)" : "none",
            }} />
            <div>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>
                {aiStatus.provider} ({aiStatus.model})
              </span>
              <span style={{ fontSize: "12px", color: "#64748b", marginLeft: "8px" }}>
                {aiStatus.configured ? "• Connected with Render GEMINI_API_KEY" : "• Ready for API Key"}
              </span>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px", fontSize: "11px" }}>
            <span style={{ background: "#eff6ff", color: "#0070ba", padding: "3px 8px", borderRadius: "4px", fontWeight: "600" }}>
              Bilateral Escrow Risk Engine
            </span>
            <span style={{ background: "#ecfdf5", color: "#059669", padding: "3px 8px", borderRadius: "4px", fontWeight: "600" }}>
              Tier Arbitrage
            </span>
          </div>
        </div>
      </Card>

      {/* Main Grid: Left Scenario Analyzer, Right Live Copilot */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)", gap: "20px", marginBottom: "24px", width: "100%" }}>
        {/* Left: Scenario Simulator */}
        <div>
          <Card style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>
              1. Procurement Scenario Simulator
            </div>
            <div style={{ fontSize: "12.5px", color: "#64748b", marginBottom: "16px" }}>
              Select equipment and units to generate an institutional executive briefing with Gemini AI.
            </div>

            {/* Equipment buttons */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "16px" }}>
              {Object.entries(equipmentCatalog).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => { setSimEquipment(key); setAnalysisResult(null); }}
                  style={{
                    padding: "9px 12px",
                    borderRadius: "6px",
                    textAlign: "left",
                    background: simEquipment === key ? "#eff6ff" : "#f8fafc",
                    border: `1.5px solid ${simEquipment === key ? "#0070ba" : "#e2e8f0"}`,
                    color: simEquipment === key ? "#003087" : "#475569",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontSize: "12px", fontWeight: "600" }}>{item.name}</div>
                  <div style={{ fontSize: "11px", color: "#059669", marginTop: "2px", fontWeight: "600" }}>
                    ${item.negotiated}/u (Retail: ${item.retail})
                  </div>
                </button>
              ))}
            </div>

            {/* Units Slider */}
            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
                <span style={{ fontSize: "12.5px", fontWeight: "600", color: "#0f172a" }}>Volume to Commit:</span>
                <span style={{ fontSize: "16px", fontWeight: "700", color: "#0070ba" }}>{simUnits} units (${simInvested.toLocaleString()} USD)</span>
              </div>
              <input
                type="range" min="2" max="40" value={simUnits}
                onChange={(e) => { setSimUnits(parseInt(e.target.value)); setAnalysisResult(null); }}
                style={{ width: "100%", accentColor: "#0070ba", cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
                <span>2 units</span>
                <span>Direct Savings: +${simSavings.toLocaleString()} USD</span>
                <span>40 units</span>
              </div>
            </div>

            <button
              onClick={handleRunAnalysis}
              disabled={analysisLoading}
              style={{
                width: "100%",
                padding: "11px 16px",
                background: "#003087",
                color: "#ffffff",
                borderRadius: "6px",
                fontSize: "13.5px",
                fontWeight: "700",
                cursor: "pointer",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <Icons.Gemini /> {analysisLoading ? "Querying Google Gemini AI..." : "Generate Gemini AI Executive Briefing"}
            </button>
          </Card>

          {/* Analysis Result Card */}
          {analysisResult && (
            <Card style={{ background: "#f8fafc", border: "1.5px solid #bfdbfe" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#003087", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Icons.Gemini /> Gemini AI Executive Assessment
                </div>
                <span style={{ fontSize: "10px", background: "#e0f2fe", color: "#0369a1", padding: "2px 6px", borderRadius: "4px", fontWeight: "600" }}>
                  {analysisResult.source === "gemini-live" ? "Live Generated via Gemini" : "Deterministic Engine"}
                </span>
              </div>

              <div style={{ fontSize: "12.5px", color: "#334155", lineHeight: "1.6", whiteSpace: "pre-wrap", marginBottom: "16px" }}>
                {analysisResult.analysis}
              </div>

              {/* Action row */}
              <button
                onClick={() => onStartCheckout({
                  id: 1,
                  name: currentItem.name,
                  qty: simUnits,
                  amount: simInvested,
                  savings: simSavings,
                })}
                style={{
                  width: "100%",
                  padding: "12px 20px",
                  background: "#ffc439",
                  color: "#003087",
                  borderRadius: "24px",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  border: "none",
                  boxShadow: "0 2px 6px rgba(0, 48, 135, 0.12)",
                }}
              >
                <Icons.PayPal /> Authorize ${simInvested.toLocaleString()} via PayPal Escrow
              </button>
            </Card>
          )}
        </div>

        {/* Right: Live Copilot Chat */}
        <Card style={{ display: "flex", flexDirection: "column", height: "600px", padding: "0", overflow: "hidden" }}>
          {/* Chat Header */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #e2e8f0", background: "#ffffff" }}>
            <div style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
              <Icons.Gemini /> Institutional Procurement Copilot
            </div>
            <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
              Ask questions on volume negotiation, cash arbitrage, or PayPal bilateral escrow protection.
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div style={{ padding: "10px 16px", background: "#fafcff", borderBottom: "1px solid #f1f5f9", display: "flex", gap: "6px", overflowX: "auto" }}>
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                style={{
                  padding: "4px 10px",
                  borderRadius: "14px",
                  background: "#ffffff",
                  border: "1px solid #cbd5e1",
                  fontSize: "11px",
                  color: "#0070ba",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  fontWeight: "600",
                }}
              >
                {q.length > 36 ? q.substring(0, 36) + "..." : q}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div style={{ flex: 1, padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "88%",
                  padding: "10px 14px",
                  borderRadius: msg.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                  background: msg.role === "user" ? "#003087" : "#f1f5f9",
                  color: msg.role === "user" ? "#ffffff" : "#0f172a",
                  fontSize: "12.5px",
                  lineHeight: "1.5",
                  whiteSpace: "pre-wrap",
                }}
              >
                {msg.text}
              </div>
            ))}
            {chatLoading && (
              <div style={{ alignSelf: "flex-start", padding: "8px 14px", background: "#f1f5f9", borderRadius: "12px", fontSize: "12px", color: "#64748b" }}>
                Gemini AI is analyzing procurement parameters...
              </div>
            )}
          </div>

          {/* Input Box */}
          <div style={{ padding: "12px 16px", borderTop: "1px solid #e2e8f0", background: "#ffffff", display: "flex", gap: "8px" }}>
            <input
              type="text"
              placeholder="Ask Gemini AI about procurement, negotiations, or PayPal escrow..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSendMessage(); }}
              style={{
                flex: 1,
                padding: "9px 12px",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                fontSize: "12.5px",
                outline: "none",
              }}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={chatLoading}
              style={{
                padding: "9px 18px",
                background: "#0070ba",
                color: "#ffffff",
                borderRadius: "6px",
                fontSize: "12.5px",
                fontWeight: "700",
                cursor: "pointer",
                border: "none",
              }}
            >
              Ask
            </button>
          </div>
        </Card>
      </div>
    </>
  );
}

// --- View 9: PayPal Settlement & Orders v2 ---

function Approvals({ token, setToken, orgName, setOrgName, onLogout, preselectedCheckout }) {
  const [loginEmail, setLoginEmail] = useState("");
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [orderState, setOrderState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRail, setSelectedRail] = useState("paypal_escrow");

  const demoAccounts = [
    { email: "aquaflow@example.com", name: "AquaFlow Industries", qty: 12, amount: 4380 },
    { email: "greenpump@example.com", name: "GreenPump Solutions", qty: 15, amount: 5475 },
    { email: "hydrotech@example.com", name: "HydroTech Systems", qty: 23, amount: 8395 },
  ];

  const buyers = [
    { id: 1, name: "AquaFlow Industries", email: "aquaflow@example.com", qty: 12, amount: 4380, status: "Pending" },
    { id: 2, name: "GreenPump Solutions", email: "greenpump@example.com", qty: 15, amount: 5475, status: "Pending" },
    { id: 3, name: "HydroTech Systems", email: "hydrotech@example.com", qty: 23, amount: 8395, status: "Authorized" },
  ];

  useEffect(() => {
    if (preselectedCheckout) {
      const customBuyer = {
        id: preselectedCheckout.id || 1,
        name: orgName || "AquaFlow Industries",
        email: "aquaflow@example.com",
        qty: preselectedCheckout.qty,
        amount: preselectedCheckout.amount,
        status: "Pending",
        description: preselectedCheckout.name,
      };
      setSelectedBuyer(customBuyer);
      initializePayPalOrder(customBuyer);
    }
  }, [preselectedCheckout]);

  async function handleLogin(e, directEmail = null) {
    if (e) e.preventDefault();
    const emailToUse = directEmail || loginEmail;
    if (!emailToUse) return;

    setLoading(true);
    try {
      const res = await fetch(`${getApiBase()}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToUse, password: "demo" }),
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.access_token);
        setOrgName(data.organization_name);
        const buyerMatch = buyers.find((b) => b.email === emailToUse);
        if (buyerMatch) setSelectedBuyer(buyerMatch);
      } else {
        alert(data.detail || "Authentication error");
      }
    } catch (err) {
      alert("Could not reach backend API at " + getApiBase());
    }
    setLoading(false);
  }

  async function initializePayPalOrder(buyer) {
    setLoading(true);
    setOrderState(null);
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "https://fintech-uaot.vercel.app";
      const apiBase = getApiBase();
      const res = await fetch(`${apiBase}/api/v1/payments/paypal/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organization_id: buyer.id,
          pool_id: 1,
          amount: buyer.amount,
          currency: "USD",
          buyer_name: buyer.name,
          description: buyer.description || `MINT Collective Procurement - ${buyer.qty}x Centrifugal Pump 5HP`,
          return_url: `${origin}/payment/return`,
          cancel_url: `${origin}/payment/cancel`,
        }),
      });
      const data = await res.json();
      if (data && data.paypal_order_id && !data.approval_url) {
        if (data.mode === "mock") {
          data.approval_url = `${origin}/payment/return?token=${data.paypal_order_id}&mode=mock`;
        } else {
          data.approval_url = `https://www.sandbox.paypal.com/checkoutnow?token=${data.paypal_order_id}`;
        }
      }
      if (data && data.approval_url) {
        // Defensive rewrite: if approval_url targets localhost but browser is on Vercel or custom domain, redirect to current origin
        if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
          try {
            const parsed = new URL(data.approval_url);
            if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") {
              data.approval_url = `${window.location.origin}${parsed.pathname}${parsed.search}`;
            }
          } catch (e) {}
        }
      }
      setOrderState(data);
    } catch (err) {
      setOrderState({ error: "Failed to connect to PayPal Orders v2 endpoint" });
    }
    setLoading(false);
  }

  return (
    <>
      <PageHeader
        title="PayPal Gateway Settlement & Escrow"
        description="Independent bilateral buyer authorization via PayPal Orders v2 with webhook integration."
        badge="Zero Commingling"
      />

      {/* Enterprise Sign-In Card */}
      {!token ? (
        <Card style={{ maxWidth: "460px", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <span style={{ color: "#0070ba" }}><Icons.PayPal /></span>
            <span style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a" }}>Enterprise Buyer Sign In</span>
          </div>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="buyer@enterprise.com"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "6px",
                border: "1px solid #d1d5db",
                background: "#ffffff",
                color: "#0f172a",
                fontSize: "13.5px",
                marginBottom: "10px",
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "10px 16px",
                background: "#0070ba",
                color: "#ffffff",
                borderRadius: "6px",
                fontSize: "13.5px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              {loading ? "Authenticating…" : "Sign In to Authorize"}
            </button>
          </form>

          <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid #f1f5f9" }}>
            <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "8px", fontWeight: "600" }}>
              Quick switch demo account:
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              {demoAccounts.map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => {
                    setLoginEmail(acc.email);
                    handleLogin(null, acc.email);
                  }}
                  style={{
                    padding: "4px 8px",
                    background: "#f1f5f9",
                    color: "#475569",
                    border: "1px solid #e2e8f0",
                    borderRadius: "4px",
                    fontSize: "11.5px",
                    cursor: "pointer",
                    fontWeight: "500",
                  }}
                >
                  {acc.name.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
        </Card>
      ) : (
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 16px",
          background: "#ecfdf5",
          border: "1px solid #a7f3d0",
          borderRadius: "8px",
          marginBottom: "24px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#059669" }}><Icons.Check /></span>
            <span style={{ fontSize: "13.5px", color: "#0f172a" }}>
              Authenticated Enterprise: <strong style={{ color: "#059669" }}>{orgName}</strong>
            </span>
          </div>
          <button
            onClick={onLogout}
            style={{
              fontSize: "12px",
              color: "#dc2626",
              background: "transparent",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Switch Account
          </button>
        </div>
      )}

      {/* Buyer Commitment List */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", marginBottom: "12px" }}>
          Pool Participant Orders & Authorizations
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {buyers.map((b) => (
            <div key={b.name} style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              padding: "12px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
            }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a" }}>{b.name}</div>
                <div style={{ fontSize: "12.5px", color: "#64748b", marginTop: "2px" }}>
                  {b.qty} units × $365.00 = <strong style={{ color: "#0070ba" }}>${b.amount.toLocaleString()} USD</strong>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  padding: "3px 8px",
                  borderRadius: "4px",
                  background: b.status === "Authorized" ? "#ecfdf5" : "#fef3c7",
                  color: b.status === "Authorized" ? "#059669" : "#b45309",
                  border: `1px solid ${b.status === "Authorized" ? "#a7f3d0" : "#fde68a"}`,
                }}>
                  {b.status}
                </span>

                {b.status === "Pending" && (
                  <button
                    onClick={() => {
                      setSelectedBuyer(b);
                      initializePayPalOrder(b);
                    }}
                    style={{
                      padding: "6px 14px",
                      background: "#0070ba",
                      color: "#ffffff",
                      borderRadius: "6px",
                      fontSize: "12.5px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Authorize Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Official PayPal Checkout Modal/Card */}
      {selectedBuyer && orderState && (
        <Card style={{ border: "2px solid #0070ba", marginTop: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Icons.PayPal />
              <div>
                <div style={{ fontSize: "15px", fontWeight: "700", color: "#003087" }}>
                  PayPal Orders v2 Settlement
                </div>
                <div style={{ fontSize: "11.5px", color: "#64748b" }}>
                  Individual Bilateral Escrow Authorization
                </div>
              </div>
            </div>
            <div style={{ textAlign: "right", fontSize: "12px", color: "#64748b" }}>
              {orderState.mint_order_id}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "6px" }}>
              Select PayPal Payment Rail:
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
              {[
                { id: "paypal_escrow", label: "PayPal Wallet", note: "Instant Escrow Hold" },
                { id: "paypal_working_capital", label: "Working Capital", note: "Net 30 Financing" },
                { id: "debit_card", label: "Business Card", note: "Debit or Credit" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedRail(m.id)}
                  style={{
                    padding: "10px",
                    borderRadius: "6px",
                    background: selectedRail === m.id ? "#eff6ff" : "#f8fafc",
                    border: `1.5px solid ${selectedRail === m.id ? "#0070ba" : "#e2e8f0"}`,
                    color: selectedRail === m.id ? "#003087" : "#475569",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontSize: "12.5px", fontWeight: "600" }}>{m.label}</div>
                  <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>{m.note}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Line Item Invoice Breakdown */}
          <div style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "14px 16px",
            marginBottom: "18px",
            fontSize: "13px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ color: "#64748b" }}>Item: {selectedBuyer.description || "Industrial Centrifugal Pump 5HP"}</span>
              <span style={{ color: "#0f172a", fontWeight: "600" }}>{selectedBuyer.qty} units × $365.00</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", color: "#64748b" }}>
              <span>Retail Baseline:</span>
              <span style={{ textDecoration: "line-through" }}>${(selectedBuyer.qty * 415).toLocaleString()} USD</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", color: "#059669", fontWeight: "600" }}>
              <span>Collective Volume Discount:</span>
              <span>-${(selectedBuyer.qty * (415 - 365)).toLocaleString()} USD</span>
            </div>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: "10px",
              borderTop: "1px solid #e2e8f0",
              fontSize: "15px",
              fontWeight: "700",
            }}>
              <span style={{ color: "#0f172a" }}>Total Escrow Commitment:</span>
              <span style={{ color: "#0070ba" }}>${orderState.amount?.toLocaleString()} USD</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth: "380px", margin: "0 auto" }}>
            {orderState.approval_url ? (
              <a
                href={orderState.approval_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "11px 20px",
                  background: "#ffc439",
                  color: "#003087",
                  borderRadius: "24px",
                  fontSize: "14px",
                  fontWeight: "700",
                  textDecoration: "none",
                  cursor: "pointer",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
                }}
              >
                <Icons.PayPal /> {selectedRail === "paypal_working_capital" ? "Pay Later with PayPal" : "Pay with PayPal"}
              </a>
            ) : (
              <button
                disabled
                style={{
                  padding: "11px",
                  background: "#e2e8f0",
                  color: "#94a3b8",
                  borderRadius: "24px",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                {loading ? "Creating PayPal Order…" : "Order Created"}
              </button>
            )}

            <button
              onClick={() => {
                if (orderState.approval_url) {
                  window.open(orderState.approval_url, "_blank");
                }
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "10px 20px",
                background: "#ffffff",
                color: "#1e293b",
                borderRadius: "24px",
                fontSize: "13.5px",
                fontWeight: "600",
                cursor: "pointer",
                border: "1px solid #d1d5db",
              }}
            >
              Debit or Credit Card
            </button>
          </div>

          <div style={{ textAlign: "center", marginTop: "12px", fontSize: "11.5px", color: "#64748b" }}>
            Secured by PayPal Sandbox Orders v2 · 180-Day Enterprise Buyer Protection Active
          </div>
        </Card>
      )}
    </>
  );
}
