"use client";

import { useState, useEffect, useMemo, useRef } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
      <polyline points="2 17 12 22 22 17M2 12 12 17 22 12" />
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
};

const navItems = [
  { key: "command", label: "Overview", icon: Icons.Command },
  { key: "probability", label: "ROI & Probability Engine", icon: Icons.Probability, highlight: true },
  { key: "analytics", label: "Demand & Savings Graph", icon: Icons.Analytics, badge: "Interactive" },
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
    fetch(`${API_BASE}/health`)
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
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f7fa", color: "#0f172a" }}>
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
      <main style={{ flex: 1, padding: "32px 40px", overflowY: "auto", maxWidth: "1240px" }}>
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
  const [equipmentType, setEquipmentType] = useState("pump");
  const svgRef = useRef(null);

  const equipmentOptions = {
    pump: { name: "Industrial Centrifugal Pump 5HP", retail: 415.00, negotiated: 365.00, poolTarget: 50, existingCommitted: 38 },
    motor: { name: "3-Phase Induction Motor 15kW", retail: 570.00, negotiated: 480.00, poolTarget: 30, existingCommitted: 20 },
    flow: { name: "Electromagnetic Flowmeter DN80", retail: 475.00, negotiated: 390.00, poolTarget: 25, existingCommitted: 14 },
    valve: { name: "High-Pressure Gate Valve PN25", retail: 260.00, negotiated: 210.00, poolTarget: 50, existingCommitted: 32 },
  };

  const selected = equipmentOptions[equipmentType];

  const investedAmount = units * selected.negotiated;
  const retailBaseline = units * selected.retail;
  const directSavings = retailBaseline - investedAmount;

  const totalPoolAfterInvestment = selected.existingCommitted + units;
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
    const steps = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30];
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
      const x = 70 + ((u - 2) / 28) * 660;
      const y = 160 - ((prob - 60) / 40) * 130;
      const inv = u * selected.negotiated;
      return { u, prob: prob.toFixed(1), x, y, inv };
    });
  }, [selected]);

  const currentX = 70 + ((units - 2) / 28) * 660;
  const currentY = 160 - ((fulfillmentProbability - 60) / 40) * 130;
  const polylineStr = curvePoints.map((p) => `${p.x},${p.y}`).join(" ");
  const polygonStr = `70,160 ${polylineStr} 730,160`;

  function handleSvgClick(e) {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const scale = 800 / rect.width;
    const svgX = clickX * scale;
    const ratio = Math.max(0, Math.min(1, (svgX - 70) / 660));
    const newUnits = Math.round(2 + ratio * 28);
    setUnits(newUnits);
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

      {/* Probability Curve Graph */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <div style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a" }}>
              Order Allocation vs Fulfillment Curve
            </div>
            <div style={{ fontSize: "12.5px", color: "#64748b", marginTop: "2px" }}>
              Click directly on the chart or drag the volume slider above to view real-time probability transitions.
            </div>
          </div>
          <span style={{ fontSize: "11px", color: "#0369a1", background: "#e0f2fe", padding: "3px 8px", borderRadius: "4px", fontWeight: "600" }}>
            Empirical Curve
          </span>
        </div>

        <div style={{ width: "100%", height: "210px", position: "relative" }}>
          <svg
            ref={svgRef}
            onClick={handleSvgClick}
            viewBox="0 0 800 200"
            style={{ width: "100%", height: "100%", overflow: "visible", cursor: "crosshair" }}
          >
            {/* Subtle Grid */}
            <line x1="50" y1="30" x2="760" y2="30" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="50" y1="73" x2="760" y2="73" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="50" y1="116" x2="760" y2="116" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="50" y1="160" x2="760" y2="160" stroke="#cbd5e1" strokeWidth="1" />

            <text x="40" y="34" fill="#94a3b8" fontSize="10" textAnchor="end">100%</text>
            <text x="40" y="77" fill="#94a3b8" fontSize="10" textAnchor="end">85%</text>
            <text x="40" y="120" fill="#94a3b8" fontSize="10" textAnchor="end">70%</text>
            <text x="40" y="164" fill="#94a3b8" fontSize="10" textAnchor="end">60%</text>

            {/* Clean Light Blue Fill */}
            <polygon points={polygonStr} fill="#eff6ff" />
            <polyline
              points={polylineStr}
              fill="none"
              stroke="#0070ba"
              strokeWidth="2.5"
            />

            {/* Milestone Points */}
            {curvePoints.filter((_, i) => i % 3 === 0).map((d) => (
              <g key={d.u} onClick={(e) => { e.stopPropagation(); setUnits(d.u); }} style={{ cursor: "pointer" }}>
                <circle cx={d.x} cy={d.y} r="4" fill="#ffffff" stroke="#0070ba" strokeWidth="2" />
                <text x={d.x} y={d.y - 10} fill="#64748b" fontSize="10" textAnchor="middle">{d.u}u ({d.prob}%)</text>
                <text x={d.x} y="178" fill="#94a3b8" fontSize="10" textAnchor="middle">${d.inv}</text>
              </g>
            ))}

            {/* Active Position Indicator */}
            <line x1={currentX} y1={currentY} x2={currentX} y2="160" stroke="#0070ba" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx={currentX} cy={currentY} r="7" fill="#0070ba" />
            <circle cx={currentX} cy={currentY} r="3" fill="#ffffff" />

            {/* Clean Floating Tooltip */}
            <g transform={`translate(${currentX}, ${Math.max(22, currentY - 24)})`}>
              <rect x="-65" y="-12" width="130" height="22" rx="4" fill="#003087" />
              <text x="0" y="3" fill="#ffffff" fontSize="11" fontWeight="600" textAnchor="middle">
                {units} Units · {fulfillmentProbability}%
              </text>
            </g>
          </svg>
        </div>
      </Card>
    </>
  );
}

// --- View 3: Dedicated Demand & Savings Interactive Graph Module ---

function DemandAndSavingsGraph({ onStartCheckout }) {
  const [activeUnits, setActiveUnits] = useState(25);
  const [equipmentType, setEquipmentType] = useState("pump");
  const svgRef = useRef(null);

  const catalog = {
    pump: { name: "Industrial Centrifugal Pump 5HP", retail: 415, negotiated: 365, maxUnits: 60 },
    motor: { name: "3-Phase Induction Motor 15kW", retail: 570, negotiated: 480, maxUnits: 40 },
    flow: { name: "Electromagnetic Flowmeter DN80", retail: 475, negotiated: 390, maxUnits: 40 },
    valve: { name: "High-Pressure Gate Valve PN25", retail: 260, negotiated: 210, maxUnits: 60 },
  };

  const current = catalog[equipmentType];
  const maxU = current.maxUnits;

  const currentRetailTotal = activeUnits * current.retail;
  const currentCollectiveTotal = activeUnits * current.negotiated;
  const currentSavings = currentRetailTotal - currentCollectiveTotal;

  const maxY = current.retail * maxU;

  const currentX = 60 + (activeUnits / maxU) * 680;
  const currentYRetail = 180 - (currentRetailTotal / maxY) * 140;
  const currentYCollective = 180 - (currentCollectiveTotal / maxY) * 140;

  function handleGraphClick(e) {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const scale = 800 / rect.width;
    const svgX = clickX * scale;
    const ratio = Math.max(0, Math.min(1, (svgX - 60) / 680));
    const newU = Math.max(1, Math.round(ratio * maxU));
    setActiveUnits(newU);
  }

  return (
    <>
      <PageHeader
        title="Demand & Savings Analytics Graph"
        description="Visualize the widening capital divergence between standalone retail procurement and collective PayPal bulk pricing."
        badge="Real-time Visualizer"
      />

      {/* Equipment Selector */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {Object.entries(catalog).map(([key, item]) => (
          <button
            key={key}
            onClick={() => setEquipmentType(key)}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              background: equipmentType === key ? "#eff6ff" : "#ffffff",
              border: `1.5px solid ${equipmentType === key ? "#0070ba" : "#e2e8f0"}`,
              color: equipmentType === key ? "#003087" : "#475569",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* Main Interactive Graph Card */}
      <Card style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <div style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a" }}>
              Total Spend vs Collective Savings Divergence
            </div>
            <div style={{ fontSize: "12.5px", color: "#64748b", marginTop: "2px" }}>
              Drag the volume scrubber below or click the chart to inspect pricing tiers.
            </div>
          </div>
          <div style={{ display: "flex", gap: "18px", fontSize: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "12px", height: "2px", background: "#94a3b8", borderTop: "1px dashed #94a3b8" }} />
              <span style={{ color: "#64748b" }}>Retail Catalog (${current.retail}/u)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "12px", height: "3px", background: "#0070ba" }} />
              <span style={{ color: "#0070ba", fontWeight: "600" }}>PayPal Collective (${current.negotiated}/u)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "10px", height: "10px", background: "#d1fae5", border: "1px solid #10b981", borderRadius: "2px" }} />
              <span style={{ color: "#059669", fontWeight: "600" }}>Cash Retained</span>
            </div>
          </div>
        </div>

        {/* SVG Chart */}
        <div style={{ width: "100%", height: "240px", position: "relative" }}>
          <svg
            ref={svgRef}
            onClick={handleGraphClick}
            viewBox="0 0 800 220"
            style={{ width: "100%", height: "100%", overflow: "visible", cursor: "crosshair" }}
          >
            {/* Grid */}
            <line x1="60" y1="40" x2="740" y2="40" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="60" y1="90" x2="740" y2="90" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="60" y1="140" x2="740" y2="140" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="60" y1="180" x2="740" y2="180" stroke="#cbd5e1" strokeWidth="1.5" />

            <text x="50" y="44" fill="#94a3b8" fontSize="10" textAnchor="end">${(maxY).toLocaleString()}</text>
            <text x="50" y="94" fill="#94a3b8" fontSize="10" textAnchor="end">${Math.round(maxY * 0.65).toLocaleString()}</text>
            <text x="50" y="144" fill="#94a3b8" fontSize="10" textAnchor="end">${Math.round(maxY * 0.3).toLocaleString()}</text>
            <text x="50" y="184" fill="#94a3b8" fontSize="10" textAnchor="end">$0</text>

            {/* Savings Area Between Retail and Collective */}
            <polygon
              points={`60,180 740,${180 - (current.retail * maxU / maxY) * 140} 740,${180 - (current.negotiated * maxU / maxY) * 140} 60,180`}
              fill="#ecfdf5"
              stroke="none"
            />

            {/* Retail Cost Line (Dashed) */}
            <line
              x1="60"
              y1="180"
              x2="740"
              y2={180 - (current.retail * maxU / maxY) * 140}
              stroke="#94a3b8"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* Collective PayPal Line (Solid Blue) */}
            <line
              x1="60"
              y1="180"
              x2="740"
              y2={180 - (current.negotiated * maxU / maxY) * 140}
              stroke="#0070ba"
              strokeWidth="2.5"
            />

            {/* X-Axis Milestone Labels */}
            {[10, 20, 30, 40, 50, maxU].map((u) => {
              const x = 60 + (u / maxU) * 680;
              return (
                <g key={u}>
                  <line x1={x} y1="180" x2={x} y2="185" stroke="#cbd5e1" />
                  <text x={x} y="198" fill="#64748b" fontSize="10" textAnchor="middle">{u} units</text>
                </g>
              );
            })}

            {/* Interactive Cursor Indicator */}
            <line x1={currentX} y1="30" x2={currentX} y2="180" stroke="#0070ba" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx={currentX} cy={currentYRetail} r="4" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />
            <circle cx={currentX} cy={currentYCollective} r="6" fill="#0070ba" />
            <circle cx={currentX} cy={currentYCollective} r="2.5" fill="#ffffff" />

            {/* Clean White Tooltip */}
            <g transform={`translate(${Math.min(670, Math.max(130, currentX))}, ${Math.max(35, currentYCollective - 35)})`}>
              <rect x="-110" y="-18" width="220" height="34" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" filter="drop-shadow(0 2px 6px rgba(0,0,0,0.06))" />
              <text x="0" y="-3" fill="#0f172a" fontSize="11" fontWeight="700" textAnchor="middle">
                {activeUnits} Units · Save ${currentSavings.toLocaleString()} USD
              </text>
              <text x="0" y="11" fill="#059669" fontSize="10" fontWeight="600" textAnchor="middle">
                Retail: ${currentRetailTotal.toLocaleString()} → Collective: ${currentCollectiveTotal.toLocaleString()}
              </text>
            </g>
          </svg>
        </div>

        {/* Real-time Volume Scrubber */}
        <div style={{ marginTop: "16px", padding: "14px 16px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>Interactive Volume Scrubber:</span>
            <span style={{ fontSize: "16px", fontWeight: "700", color: "#0070ba" }}>{activeUnits} units</span>
          </div>
          <input
            type="range"
            min="1"
            max={maxU}
            value={activeUnits}
            onChange={(e) => setActiveUnits(parseInt(e.target.value))}
            style={{ width: "100%", accentColor: "#0070ba", cursor: "pointer" }}
          />
        </div>
      </Card>

      {/* Financial Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr) 1.2fr", gap: "16px" }}>
        <Stat label="Total Retail Cost" value={`$${currentRetailTotal.toLocaleString()}`} sub="At standard single-unit price" />
        <Stat label="PayPal Collective Cost" value={`$${currentCollectiveTotal.toLocaleString()}`} sub="With bulk volume commitment" />
        <Stat label="Direct Cash Retained" value={`$${currentSavings.toLocaleString()}`} sub="Immediate margin saved" delta />
        <Card style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <button
            onClick={() => onStartCheckout({
              id: 1,
              name: current.name,
              qty: activeUnits,
              amount: currentCollectiveTotal,
              savings: currentSavings,
            })}
            style={{
              width: "100%",
              padding: "12px 20px",
              background: "#ffc439",
              color: "#003087",
              borderRadius: "24px",
              fontSize: "13.5px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <Icons.PayPal /> Authorize ${currentCollectiveTotal.toLocaleString()} on PayPal
          </button>
        </Card>
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
      const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
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
      alert("Could not reach backend API at " + API_BASE);
    }
    setLoading(false);
  }

  async function initializePayPalOrder(buyer) {
    setLoading(true);
    setOrderState(null);
    try {
      const res = await fetch(`${API_BASE}/api/v1/payments/paypal/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organization_id: buyer.id,
          pool_id: 1,
          amount: buyer.amount,
          currency: "USD",
          buyer_name: buyer.name,
          description: buyer.description || `MINT Collective Procurement - ${buyer.qty}x Centrifugal Pump 5HP`,
        }),
      });
      const data = await res.json();
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
