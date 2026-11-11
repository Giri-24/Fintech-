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
      <path d="M12 2a10 10 0 0 1 10 10" stroke="#00c3ff" strokeWidth="2.5" />
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
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00c3ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Zap: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  TrendingUp: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00c3ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
};

const navItems = [
  { key: "command", label: "Command Centre", icon: Icons.Command },
  { key: "probability", label: "ROI & Probability Engine", icon: Icons.Probability, highlight: true },
  { key: "analytics", label: "Demand & Savings Graph", icon: Icons.Analytics, badge: "Interactive" },
  { key: "services", label: "PayPal Services & Rails", icon: Icons.Services, badge: "5 Rails" },
  { key: "pools", label: "Active Demand Pools", icon: Icons.Pools },
  { key: "predictive", label: "Predictive Buying", icon: Icons.Predictive },
  { key: "mesh", label: "Demand Mesh", icon: Icons.Mesh },
  { key: "negotiation", label: "Negotiation Room", icon: Icons.Negotiation },
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
    <div style={{ display: "flex", minHeight: "100vh", background: "#070b14", color: "#f8fafc" }}>
      {/* Sidebar */}
      <aside style={{
        width: "264px",
        background: "#050810",
        borderRight: "1px solid rgba(255, 255, 255, 0.08)",
        padding: "24px 16px",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "22px", padding: "0 6px" }}>
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #0070ba 0%, #003087 100%)",
            border: "1px solid rgba(0, 195, 255, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            fontWeight: "800",
            color: "#ffffff",
            boxShadow: "0 0 16px rgba(0, 112, 186, 0.4)",
          }}>
            M
          </div>
          <div>
            <div style={{ fontSize: "16px", fontWeight: "800", letterSpacing: "-0.02em", color: "#f8fafc" }}>
              MINT <span style={{ color: "#00c3ff", fontSize: "13px", fontWeight: "600" }}>Fintech</span>
            </div>
            <div style={{ fontSize: "11px", color: "#64748b" }}>
              PayPal Procurement Platform
            </div>
          </div>
        </div>

        {/* Live Connectivity Status Pill with controlled luminescence */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 12px",
          borderRadius: "6px",
          background: backendOnline ? "rgba(16, 185, 129, 0.08)" : "rgba(245, 158, 11, 0.08)",
          border: `1px solid ${backendOnline ? "rgba(16, 185, 129, 0.3)" : "rgba(245, 158, 11, 0.3)"}`,
          marginBottom: "20px",
          fontSize: "12px",
          boxShadow: backendOnline ? "0 0 12px rgba(16, 185, 129, 0.12)" : "none",
        }}>
          <span style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            backgroundColor: backendOnline ? "#10b981" : "#f59e0b",
            boxShadow: backendOnline ? "0 0 8px #10b981" : "none",
          }} />
          <span style={{ color: backendOnline ? "#10b981" : "#f59e0b", fontWeight: "600" }}>
            {backendOnline ? "PayPal Orders v2 Connected" : "Sandbox Mock Mode Active"}
          </span>
        </div>

        {/* Navigation */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
          <div style={{ fontSize: "11px", color: "#475569", padding: "4px 8px", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "700" }}>
            Customer Architecture
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
                  borderRadius: "8px",
                  background: isActive ? "linear-gradient(90deg, rgba(0, 112, 186, 0.22) 0%, rgba(0, 195, 255, 0.06) 100%)" : "transparent",
                  color: isActive ? "#ffffff" : "#94a3b8",
                  border: isActive ? "1px solid rgba(0, 195, 255, 0.3)" : "1px solid transparent",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: isActive ? "600" : "500",
                  transition: "all 0.12s ease",
                  boxShadow: isActive ? "0 0 14px rgba(0, 112, 186, 0.2)" : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ color: isActive ? "#00c3ff" : "#64748b", display: "flex", alignItems: "center" }}>
                    <IconComponent />
                  </span>
                  {label}
                </div>
                {badge && (
                  <span style={{ fontSize: "10px", fontWeight: "700", background: "rgba(0, 195, 255, 0.15)", color: "#00c3ff", padding: "1px 6px", borderRadius: "4px" }}>
                    {badge}
                  </span>
                )}
                {highlight && !isActive && (
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00c3ff", boxShadow: "0 0 6px #00c3ff" }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Customer Session Card */}
        <div style={{
          padding: "14px",
          borderRadius: "8px",
          background: "#0c1322",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          fontSize: "12px",
        }}>
          {token ? (
            <div>
              <div style={{ color: "#64748b", fontSize: "11px" }}>Authorized Customer Org:</div>
              <div style={{ color: "#f8fafc", fontWeight: "700", marginTop: "2px", fontSize: "13px" }}>{orgName}</div>
              <button
                onClick={handleLogout}
                style={{
                  marginTop: "8px",
                  fontSize: "11.5px",
                  color: "#ef4444",
                  background: "transparent",
                  cursor: "pointer",
                  fontWeight: "600",
                  padding: 0,
                }}
              >
                Switch Buyer Account
              </button>
            </div>
          ) : (
            <div>
              <div style={{ color: "#94a3b8", fontWeight: "600" }}>Enterprise Guest</div>
              <div style={{ color: "#64748b", fontSize: "11px", marginTop: "2px" }}>
                Select an investment pool or log in under Settlement.
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Workspace */}
      <main style={{ flex: 1, padding: "34px 44px", overflowY: "auto", maxWidth: "1200px" }}>
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

        {/* Global Protection Banner */}
        <footer style={{
          marginTop: "48px",
          padding: "16px 22px",
          borderRadius: "10px",
          background: "linear-gradient(90deg, #0c1322 0%, #101a2e 100%)",
          border: "1px solid rgba(0, 195, 255, 0.2)",
          fontSize: "12px",
          color: "#94a3b8",
          lineHeight: "1.6",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          boxShadow: "0 0 20px rgba(0, 112, 186, 0.12)",
        }}>
          <span style={{ color: "#00c3ff", display: "flex", alignItems: "center" }}>
            <Icons.Shield />
          </span>
          <div>
            <strong style={{ color: "#f8fafc" }}>Enterprise Customer Protection:</strong> Funds are held in individual bilateral escrow via PayPal REST v2. If a collective volume threshold is not met within the 30-day window, holds are released back to your enterprise account with zero cancellation fees.
          </div>
        </footer>
      </main>
    </div>
  );
}

// --- Common UI Components ---

function PageHeader({ title, description, badge, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "26px" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "800", letterSpacing: "-0.02em", color: "#f8fafc", margin: 0 }}>
            {title}
          </h1>
          {badge && (
            <span style={{
              fontSize: "11px",
              fontWeight: "700",
              background: "rgba(0, 195, 255, 0.15)",
              color: "#00c3ff",
              border: "1px solid rgba(0, 195, 255, 0.35)",
              padding: "2px 8px",
              borderRadius: "4px",
              boxShadow: "0 0 8px rgba(0, 195, 255, 0.2)",
            }}>
              {badge}
            </span>
          )}
        </div>
        <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>
          {description}
        </p>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

function Card({ children, style = {}, glow = false }) {
  return (
    <div style={{
      background: "#0c1322",
      border: glow ? "1px solid rgba(0, 195, 255, 0.35)" : "1px solid rgba(255, 255, 255, 0.08)",
      borderRadius: "10px",
      padding: "22px 24px",
      boxShadow: glow ? "0 0 20px rgba(0, 112, 186, 0.18)" : "0 4px 16px rgba(0, 0, 0, 0.2)",
      ...style,
    }}>
      {children}
    </div>
  );
}

function Stat({ label, value, sub, delta, glowColor }) {
  return (
    <div style={{
      background: "#0c1322",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      borderRadius: "10px",
      padding: "18px 20px",
      position: "relative",
      overflow: "hidden",
    }}>
      {glowColor && (
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: glowColor,
          boxShadow: `0 0 10px ${glowColor}`,
        }} />
      )}
      <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "6px", fontWeight: "600" }}>{label}</div>
      <div style={{ fontSize: "26px", fontWeight: "800", color: "#f8fafc", letterSpacing: "-0.02em" }} className="tabular-nums">
        {value}
      </div>
      <div style={{ fontSize: "12px", color: delta ? "#10b981" : "#64748b", marginTop: "4px", fontWeight: delta ? "600" : "400" }}>
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
        title="Customer Procurement Command Centre"
        description="Consolidate corporate equipment orders into wholesale price tiers with instant bilateral PayPal escrow."
        badge="Enterprise V2"
        action={
          <button
            onClick={() => onNavigate("analytics")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "9px 16px",
              background: "linear-gradient(135deg, #0070ba 0%, #003087 100%)",
              border: "1px solid rgba(0, 195, 255, 0.4)",
              color: "#ffffff",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 0 14px rgba(0, 112, 186, 0.3)",
            }}
          >
            <Icons.Analytics /> View Interactive Demand Graphs →
          </button>
        }
      />

      {/* KPI Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
        <Stat label="Active Equipment Pools" value="4 Active" sub="128 units aggregated" glowColor="#00c3ff" />
        <Stat label="Net Cash Saved for Buyers" value="$9,575 USD" sub="Vs retail procurement" delta glowColor="#10b981" />
        <Stat label="Average Customer ROI" value="+16.8%" sub="Direct margin boost" delta glowColor="#10b981" />
        <Stat label="Fulfillment Probability" value="98.6%" sub="Backed by PayPal Escrow" glowColor="#00c3ff" />
      </div>

      {/* Customer Hero Card */}
      <Card glow style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
          <div>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#00c3ff", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "4px" }}>
              Ready for Settlement · Pool #PO-2026-08
            </div>
            <div style={{ fontSize: "18px", fontWeight: "800", color: "#f8fafc" }}>
              Industrial Centrifugal Water Pump 5HP (50 Units Aggregated)
            </div>
            <div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "2px" }}>
              AquaFlow (12 units) · GreenPump (15 units) · HydroTech (23 units)
            </div>
          </div>
          <span style={{
            fontSize: "12px",
            fontWeight: "700",
            padding: "4px 10px",
            borderRadius: "6px",
            background: "rgba(16, 185, 129, 0.15)",
            color: "#10b981",
            border: "1px solid rgba(16, 185, 129, 0.35)",
            boxShadow: "0 0 10px rgba(16, 185, 129, 0.2)",
          }}>
            100% Target Reached · $2,500 Savings Locked
          </span>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
          padding: "16px",
          background: "#080d18",
          borderRadius: "8px",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          marginBottom: "18px",
        }}>
          <div>
            <div style={{ color: "#64748b", fontSize: "12px" }}>Negotiated Unit Price</div>
            <div style={{ fontSize: "19px", fontWeight: "800", color: "#10b981", marginTop: "2px" }}>$365.00 <span style={{ fontSize: "12px", textDecoration: "line-through", color: "#64748b" }}>$415.00</span></div>
          </div>
          <div>
            <div style={{ color: "#64748b", fontSize: "12px" }}>Collective Cash Saved</div>
            <div style={{ fontSize: "19px", fontWeight: "800", color: "#10b981", marginTop: "2px" }}>$2,500.00 USD</div>
          </div>
          <div>
            <div style={{ color: "#64748b", fontSize: "12px" }}>Total PayPal Settlement Hold</div>
            <div style={{ fontSize: "19px", fontWeight: "800", color: "#00c3ff", marginTop: "2px" }}>$18,250.00 USD</div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "12.5px", color: "#94a3b8" }}>
            Bilateral escrow holds are currently active on PayPal Orders v2. Ready to capture upon final dispatch confirmation.
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => onNavigate("pools")}
              style={{
                padding: "9px 16px",
                background: "#142036",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "#f8fafc",
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
                padding: "9px 18px",
                background: "#0070ba",
                color: "#ffffff",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 0 14px rgba(0, 112, 186, 0.35)",
              }}
            >
              Review PayPal Escrow Approvals →
            </button>
          </div>
        </div>
      </Card>
    </>
  );
}

// --- View 2: Customer ROI & Dynamic Probability Engine (100% Working & Reactive) ---

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

  // Mathematical Probability & Customer Financial Model
  const investedAmount = units * selected.negotiated;
  const retailBaseline = units * selected.retail;
  const directSavings = retailBaseline - investedAmount;

  const totalPoolAfterInvestment = selected.existingCommitted + units;
  const progressTowardsTarget = Math.min(100, Math.round((totalPoolAfterInvestment / selected.poolTarget) * 100));

  // Fulfillment Probability Algorithm
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

  // Gateway Fee comparison for customer
  const paypalFee = (investedAmount * 0.015).toFixed(2); // 1.5%
  const traditionalFee = ((investedAmount * 0.035) + 45.00).toFixed(2); // 3.5% + wire fee
  const financingSaved = (traditionalFee - paypalFee).toFixed(2);
  const totalNetCustomerGain = (directSavings + parseFloat(financingSaved)).toFixed(2);
  const customerRoi = ((totalNetCustomerGain / investedAmount) * 100).toFixed(1);

  // Dynamic SVG Curve Points Calculation based on current pool & equipment
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

  // Current active cursor position on graph
  const currentX = 70 + ((units - 2) / 28) * 660;
  const currentY = 160 - ((fulfillmentProbability - 60) / 40) * 130;
  const polylineStr = curvePoints.map((p) => `${p.x},${p.y}`).join(" ");
  const polygonStr = `70,160 ${polylineStr} 730,160`;

  // Interactive Click to Select on Graph
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
        title="Customer Investment & Probability Engine"
        description="Simulate your enterprise capital commitment: drag slider or click graph to see fulfillment probability, fees, and ROI."
        badge="Probability AI"
      />

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "20px", marginBottom: "24px" }}>
        {/* Left: Input Panel */}
        <Card glow>
          <div style={{ fontSize: "16px", fontWeight: "700", color: "#f8fafc", marginBottom: "6px" }}>
            1. Configure Your Procurement Commitment
          </div>
          <div style={{ fontSize: "12.5px", color: "#94a3b8", marginBottom: "18px" }}>
            Adjust your order size to calculate fulfillment probability and payment charges.
          </div>

          <div style={{ marginBottom: "18px" }}>
            <label style={{ display: "block", fontSize: "12.5px", color: "#64748b", fontWeight: "600", marginBottom: "8px" }}>
              Select Equipment Category:
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
                    background: equipmentType === key ? "rgba(0, 112, 186, 0.25)" : "#080d18",
                    border: `1.5px solid ${equipmentType === key ? "#00c3ff" : "rgba(255, 255, 255, 0.08)"}`,
                    color: equipmentType === key ? "#f8fafc" : "#94a3b8",
                    cursor: "pointer",
                    boxShadow: equipmentType === key ? "0 0 12px rgba(0, 195, 255, 0.2)" : "none",
                  }}
                >
                  <div style={{ fontSize: "12.5px", fontWeight: "700" }}>{item.name}</div>
                  <div style={{ fontSize: "11px", color: "#10b981", marginTop: "2px" }}>
                    ${item.negotiated}/unit (Save ${item.retail - item.negotiated})
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Unit Slider */}
          <div style={{ marginBottom: "22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#f8fafc" }}>Units to Commit:</span>
              <span style={{ fontSize: "20px", fontWeight: "800", color: "#00c3ff" }} className="tabular-nums">
                {units} units (${investedAmount.toLocaleString()} USD)
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="30"
              value={units}
              onChange={(e) => setUnits(parseInt(e.target.value))}
              style={{ width: "100%", accentColor: "#00c3ff", cursor: "pointer", height: "6px" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
              <span>2 units (${(2 * selected.negotiated).toLocaleString()})</span>
              <span>15 units (${(15 * selected.negotiated).toLocaleString()})</span>
              <span>30 units (${(30 * selected.negotiated).toLocaleString()})</span>
            </div>
          </div>

          {/* Pool Contribution Summary */}
          <div style={{
            background: "#080d18",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: "8px",
            padding: "14px 16px",
            fontSize: "13px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ color: "#94a3b8" }}>Current Pool Status:</span>
              <span style={{ color: "#f8fafc" }}>{selected.existingCommitted} units committed by peers</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ color: "#94a3b8" }}>With Your Commitment:</span>
              <strong style={{ color: "#00c3ff" }}>{totalPoolAfterInvestment} / {selected.poolTarget} units ({progressTowardsTarget}%)</strong>
            </div>
            <div style={{ width: "100%", height: "6px", background: "#142036", borderRadius: "3px", overflow: "hidden", marginTop: "8px" }}>
              <div style={{ width: `${progressTowardsTarget}%`, height: "100%", background: progressTowardsTarget >= 100 ? "#10b981" : "#00c3ff", boxShadow: "0 0 10px #00c3ff" }} />
            </div>
          </div>
        </Card>

        {/* Right: Probability Dial & Financial Gain */}
        <Card glow style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: "16px", fontWeight: "700", color: "#f8fafc", marginBottom: "4px" }}>
              2. Probability & Investment Outcome
            </div>
            <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "20px" }}>
              Statistical likelihood of pool locking tier-1 wholesale pricing.
            </div>

            {/* Glowing Probability Gauge Indicator */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              padding: "16px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, rgba(0, 112, 186, 0.15) 0%, rgba(0, 195, 255, 0.08) 100%)",
              border: "1px solid rgba(0, 195, 255, 0.3)",
              boxShadow: "0 0 18px rgba(0, 112, 186, 0.2)",
              marginBottom: "18px",
            }}>
              <div style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "#080d18",
                border: "4px solid #00c3ff",
                boxShadow: "0 0 16px rgba(0, 195, 255, 0.4)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                <div style={{ fontSize: "20px", fontWeight: "800", color: "#ffffff" }}>{fulfillmentProbability}%</div>
                <div style={{ fontSize: "9px", color: "#00c3ff", textTransform: "uppercase", fontWeight: "700" }}>Probability</div>
              </div>

              <div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "#f8fafc" }}>
                  {totalPoolAfterInvestment >= selected.poolTarget ? "Tier-1 Pricing Guaranteed" : "Extremely High Fulfillment Confidence"}
                </div>
                <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "3px", lineHeight: "1.4" }}>
                  Statistical cycle confirms remaining units will be captured before 30-day RFQ expiration.
                </div>
              </div>
            </div>

            {/* Financial Returns Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px", fontSize: "12.5px" }}>
              <div style={{ background: "#080d18", padding: "10px 14px", borderRadius: "6px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <div style={{ color: "#64748b" }}>Direct Equipment Savings:</div>
                <div style={{ fontSize: "16px", fontWeight: "800", color: "#10b981", marginTop: "2px" }}>+${directSavings.toLocaleString()} USD</div>
              </div>
              <div style={{ background: "#080d18", padding: "10px 14px", borderRadius: "6px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <div style={{ color: "#64748b" }}>PayPal Fee vs Bank Wire:</div>
                <div style={{ fontSize: "16px", fontWeight: "800", color: "#00c3ff", marginTop: "2px" }}>Save ${financingSaved}</div>
              </div>
            </div>

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 16px",
              background: "#080d18",
              borderRadius: "6px",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              boxShadow: "0 0 12px rgba(16, 185, 129, 0.12)",
              marginBottom: "18px",
            }}>
              <div>
                <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: "700" }}>Net Enterprise Capital Gain</div>
                <div style={{ fontSize: "18px", fontWeight: "800", color: "#10b981" }}>+${totalNetCustomerGain} USD</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "11px", color: "#64748b" }}>Annualized ROI Margin</div>
                <div style={{ fontSize: "18px", fontWeight: "800", color: "#10b981" }}>+{customerRoi}%</div>
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
              fontSize: "14.5px",
              fontWeight: "800",
              cursor: "pointer",
              boxShadow: "0 0 18px rgba(255, 196, 57, 0.35)",
            }}
          >
            <Icons.PayPal /> Authorize ${investedAmount.toLocaleString()} via PayPal Escrow
          </button>
        </Card>
      </div>

      {/* GRAPH: Fully Interactive & Dynamic Probability Curve (Click or Drag Slider to see position update) */}
      <Card glow>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <div style={{ fontSize: "15px", fontWeight: "700", color: "#f8fafc" }}>
              Customer Capital Allocation vs Probability Curve (Live Interactive)
            </div>
            <div style={{ fontSize: "12.5px", color: "#94a3b8", marginTop: "2px" }}>
              Click anywhere on the graph or drag the slider above. The cyan cursor tracks your live allocation.
            </div>
          </div>
          <span style={{ fontSize: "11px", color: "#00c3ff", background: "rgba(0, 195, 255, 0.12)", padding: "4px 8px", borderRadius: "4px" }}>
            Monte Carlo Mathematical Model
          </span>
        </div>

        <div style={{ width: "100%", height: "220px", position: "relative" }}>
          <svg
            ref={svgRef}
            onClick={handleSvgClick}
            viewBox="0 0 800 200"
            style={{ width: "100%", height: "100%", overflow: "visible", cursor: "crosshair" }}
          >
            {/* Grid */}
            <line x1="50" y1="30" x2="760" y2="30" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <line x1="50" y1="73" x2="760" y2="73" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <line x1="50" y1="116" x2="760" y2="116" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <line x1="50" y1="160" x2="760" y2="160" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

            <text x="40" y="34" fill="#64748b" fontSize="10" textAnchor="end">100%</text>
            <text x="40" y="77" fill="#64748b" fontSize="10" textAnchor="end">85%</text>
            <text x="40" y="120" fill="#64748b" fontSize="10" textAnchor="end">70%</text>
            <text x="40" y="164" fill="#64748b" fontSize="10" textAnchor="end">60%</text>

            {/* Glowing Gradient Curve */}
            <defs>
              <linearGradient id="probGlowActive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00c3ff" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#00c3ff" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            <polygon points={polygonStr} fill="url(#probGlowActive)" />
            <polyline
              points={polylineStr}
              fill="none"
              stroke="#00c3ff"
              strokeWidth="3.5"
              style={{ filter: "drop-shadow(0 0 8px #00c3ff)" }}
            />

            {/* Benchmark Milestone Points */}
            {curvePoints.filter((_, i) => i % 3 === 0).map((d) => (
              <g key={d.u} onClick={(e) => { e.stopPropagation(); setUnits(d.u); }} style={{ cursor: "pointer" }}>
                <circle cx={d.x} cy={d.y} r="4" fill="#0c1322" stroke="#00c3ff" strokeWidth="2" />
                <text x={d.x} y={d.y - 10} fill="#94a3b8" fontSize="10" textAnchor="middle">{d.u}u ({d.prob}%)</text>
                <text x={d.x} y="178" fill="#64748b" fontSize="10" textAnchor="middle">${d.inv}</text>
              </g>
            ))}

            {/* DYNAMIC LIVE ACTIVE CURSOR PIN (Moves in real time with slider!) */}
            <line x1={currentX} y1={currentY} x2={currentX} y2="160" stroke="#00c3ff" strokeWidth="2" strokeDasharray="3 3" opacity="0.8" />
            <circle cx={currentX} cy={currentY} r="10" fill="#00c3ff" style={{ filter: "drop-shadow(0 0 12px #00c3ff)" }} />
            <circle cx={currentX} cy={currentY} r="4" fill="#ffffff" />

            {/* Active Tooltip Pill hovering over cursor */}
            <g transform={`translate(${currentX}, ${Math.max(22, currentY - 24)})`}>
              <rect x="-68" y="-12" width="136" height="22" rx="4" fill="#003087" stroke="#00c3ff" strokeWidth="1.5" style={{ filter: "drop-shadow(0 0 8px rgba(0, 195, 255, 0.4))" }} />
              <text x="0" y="3" fill="#ffffff" fontSize="11" fontWeight="800" textAnchor="middle">
                SELECTED: {units}u · {fulfillmentProbability}%
              </text>
            </g>
          </svg>
        </div>
        <div style={{ textAlign: "center", fontSize: "11px", color: "#64748b", marginTop: "10px" }}>
          Tip: Click anywhere along the curve or use the slider above to see real-time probability & financing fee recalculation.
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

  // Max scale calculation for Y axis
  const maxY = current.retail * maxU;

  // Interactive scrubber calculation
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
        title="Interactive Demand & Savings Analytics Graph"
        description="Scrub through order quantities to visualize the growing cash savings between single-buyer retail and collective PayPal escrow."
        badge="Live Graph"
      />

      {/* Equipment Selector */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {Object.entries(catalog).map(([key, item]) => (
          <button
            key={key}
            onClick={() => setEquipmentType(key)}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              background: equipmentType === key ? "rgba(0, 112, 186, 0.3)" : "#0c1322",
              border: `1.5px solid ${equipmentType === key ? "#00c3ff" : "rgba(255, 255, 255, 0.08)"}`,
              color: equipmentType === key ? "#ffffff" : "#94a3b8",
              fontSize: "12.5px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* Main Interactive Graph Card */}
      <Card glow style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
          <div>
            <div style={{ fontSize: "16px", fontWeight: "700", color: "#f8fafc" }}>
              Spend Comparison & Cash Margin Divergence
            </div>
            <div style={{ fontSize: "12.5px", color: "#94a3b8", marginTop: "2px" }}>
              Hover or click anywhere across the graph to inspect exact price points and savings.
            </div>
          </div>
          <div style={{ display: "flex", gap: "20px", fontSize: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "12px", height: "3px", background: "#9ca3af", borderTop: "1px dashed #9ca3af" }} />
              <span style={{ color: "#9ca3af" }}>Individual Retail Cost (${current.retail}/u)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "12px", height: "3px", background: "#00c3ff" }} />
              <span style={{ color: "#00c3ff", fontWeight: "700" }}>MINT PayPal Collective (${current.negotiated}/u)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "12px", height: "12px", background: "rgba(16, 185, 129, 0.3)", border: "1px solid #10b981", borderRadius: "2px" }} />
              <span style={{ color: "#10b981", fontWeight: "700" }}>Customer Net Savings</span>
            </div>
          </div>
        </div>

        {/* SVG Chart */}
        <div style={{ width: "100%", height: "250px", position: "relative" }}>
          <svg
            ref={svgRef}
            onClick={handleGraphClick}
            viewBox="0 0 800 220"
            style={{ width: "100%", height: "100%", overflow: "visible", cursor: "crosshair" }}
          >
            {/* Grid */}
            <line x1="60" y1="40" x2="740" y2="40" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <line x1="60" y1="90" x2="740" y2="90" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <line x1="60" y1="140" x2="740" y2="140" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <line x1="60" y1="180" x2="740" y2="180" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />

            <text x="50" y="44" fill="#64748b" fontSize="10" textAnchor="end">${(maxY).toLocaleString()}</text>
            <text x="50" y="94" fill="#64748b" fontSize="10" textAnchor="end">${Math.round(maxY * 0.65).toLocaleString()}</text>
            <text x="50" y="144" fill="#64748b" fontSize="10" textAnchor="end">${Math.round(maxY * 0.3).toLocaleString()}</text>
            <text x="50" y="184" fill="#64748b" fontSize="10" textAnchor="end">$0</text>

            {/* Savings Area Between Retail and Collective */}
            <polygon
              points={`60,180 740,${180 - (current.retail * maxU / maxY) * 140} 740,${180 - (current.negotiated * maxU / maxY) * 140} 60,180`}
              fill="rgba(16, 185, 129, 0.15)"
              stroke="none"
            />

            {/* Retail Cost Line (Dashed) */}
            <line
              x1="60"
              y1="180"
              x2="740"
              y2={180 - (current.retail * maxU / maxY) * 140}
              stroke="#9ca3af"
              strokeWidth="2.5"
              strokeDasharray="4 4"
            />

            {/* Collective PayPal Line (Glowing Cyan) */}
            <line
              x1="60"
              y1="180"
              x2="740"
              y2={180 - (current.negotiated * maxU / maxY) * 140}
              stroke="#00c3ff"
              strokeWidth="3.5"
              style={{ filter: "drop-shadow(0 0 8px #00c3ff)" }}
            />

            {/* X-Axis Milestone Labels */}
            {[10, 20, 30, 40, 50, maxU].map((u) => {
              const x = 60 + (u / maxU) * 680;
              return (
                <g key={u}>
                  <line x1={x} y1="180" x2={x} y2="185" stroke="rgba(255,255,255,0.2)" />
                  <text x={x} y="198" fill="#64748b" fontSize="10" textAnchor="middle">{u} units</text>
                </g>
              );
            })}

            {/* ACTIVE INTERACTIVE SCRUBBER CURSOR */}
            <line x1={currentX} y1="30" x2={currentX} y2="180" stroke="#00c3ff" strokeWidth="2" strokeDasharray="3 3" />
            <circle cx={currentX} cy={currentYRetail} r="5" fill="#ffffff" stroke="#9ca3af" strokeWidth="2" />
            <circle cx={currentX} cy={currentYCollective} r="7" fill="#00c3ff" style={{ filter: "drop-shadow(0 0 10px #00c3ff)" }} />
            <circle cx={currentX} cy={currentYCollective} r="3" fill="#ffffff" />

            {/* Floating Tooltip Pill */}
            <g transform={`translate(${Math.min(670, Math.max(130, currentX))}, ${Math.max(35, currentYCollective - 35)})`}>
              <rect x="-115" y="-18" width="230" height="34" rx="6" fill="#050810" stroke="#00c3ff" strokeWidth="1.5" style={{ filter: "drop-shadow(0 0 10px rgba(0, 195, 255, 0.4))" }} />
              <text x="0" y="-3" fill="#ffffff" fontSize="11" fontWeight="800" textAnchor="middle">
                {activeUnits} Units · Save ${currentSavings.toLocaleString()} USD
              </text>
              <text x="0" y="11" fill="#10b981" fontSize="10" fontWeight="600" textAnchor="middle">
                Retail: ${currentRetailTotal.toLocaleString()} → PayPal: ${currentCollectiveTotal.toLocaleString()}
              </text>
            </g>
          </svg>
        </div>

        {/* Real-time Slider Control */}
        <div style={{ marginTop: "16px", padding: "14px", background: "#080d18", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "13px", fontWeight: "700", color: "#f8fafc" }}>Interactive Volume Scrubber:</span>
            <span style={{ fontSize: "16px", fontWeight: "800", color: "#00c3ff" }}>{activeUnits} units</span>
          </div>
          <input
            type="range"
            min="1"
            max={maxU}
            value={activeUnits}
            onChange={(e) => setActiveUnits(parseInt(e.target.value))}
            style={{ width: "100%", accentColor: "#00c3ff", cursor: "pointer" }}
          />
        </div>
      </Card>

      {/* Financial Summary & Action */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr) 1.2fr", gap: "16px" }}>
        <Stat label="Total Retail Cost" value={`$${currentRetailTotal.toLocaleString()}`} sub="At standard pricing" />
        <Stat label="PayPal Collective Cost" value={`$${currentCollectiveTotal.toLocaleString()}`} sub="With bulk volume lock" glowColor="#00c3ff" />
        <Stat label="Total Cash Saved" value={`$${currentSavings.toLocaleString()}`} sub="Direct capital retained" delta glowColor="#10b981" />
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
              fontSize: "14px",
              fontWeight: "800",
              cursor: "pointer",
              boxShadow: "0 0 16px rgba(255, 196, 57, 0.3)",
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

// --- View 4: Extended PayPal Enterprise Services & Multi-Gateway Hub ---

function PayPalEnterpriseServicesHub({ onNavigate }) {
  const [services, setServices] = useState([
    {
      id: "paypal_escrow",
      name: "PayPal Orders v2 Bilateral Escrow",
      badge: "Core Active Rail",
      status: "Active & Operating",
      description: "Server-side cryptographic escrow hold. Zero commingling of customer funds. Auto-capture upon verified physical dispatch.",
      customer_benefit: "Eliminates counterparty risk. 180-day buyer protection policy.",
      processing_fee: "1.5% flat (Save 2.0% vs traditional bank wire & factoring)",
      recommended_for: "All collective procurement pools ($1,000 - $100,000)",
      activeState: true,
    },
    {
      id: "paypal_working_capital",
      name: "PayPal Commercial Working Capital",
      badge: "Growth Financing",
      status: "Pre-Approved",
      description: "Instant pre-approved credit lines from $10,000 to $50,000 based on procurement invoice history with single fixed fee.",
      customer_benefit: "Enables purchasing larger volume tiers without depleting enterprise operating cash flow.",
      processing_fee: "Single fixed fee (No compounding monthly interest)",
      recommended_for: "SMEs scaling orders from 10 units to 50+ bulk tiers",
      activeState: true,
    },
    {
      id: "paypal_subscriptions",
      name: "PayPal Automated B2B Subscriptions",
      badge: "Recurring Replenishment",
      status: "Available to Activate",
      description: "Automated recurring order scheduling for periodic industrial consumables (mechanical seals, filter media, replacement impellers).",
      customer_benefit: "Zero downtime from stockouts. Automatically aggregates recurring schedules into bulk tiers.",
      processing_fee: "Standard PayPal merchant processing",
      recommended_for: "Recurring 6-month & 12-month maintenance contracts",
      activeState: false,
    },
    {
      id: "ach_direct_rail",
      name: "PayPal Braintree Corporate ACH Rail",
      badge: "Enterprise High-Volume",
      status: "Available to Activate",
      description: "Direct bank-to-bank automated clearing house settlement for large civil infrastructure purchase orders exceeding $50,000.",
      customer_benefit: "Lowest cost per transaction ($5 cap) for mega-capital equipment procurements.",
      processing_fee: "0.75% capped at $5.00 per transaction",
      recommended_for: "Civil engineering and municipal orders > $50,000",
      activeState: false,
    },
    {
      id: "iot_escrow_release",
      name: "IoT Smart Delivery Verification Lock",
      badge: "Automated Quality Lock",
      status: "Active Telemetry",
      description: "PayPal webhook integration with factory IoT telemetry. Funds released from escrow only when digital signature and flow sensors confirm spec compliance.",
      customer_benefit: "Guarantees pump flow rate (50 m³/h) and motor insulation (IP55) before vendor payout.",
      processing_fee: "Included in PayPal Orders v2",
      recommended_for: "Precision engineered pumps and calibrated sensors",
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
        title="Enterprise Payment Services & Gateway Hub"
        description="Adopt institutional PayPal financial services in your company: working capital, automated subscriptions, and ACH settlement."
        badge="Fintech Services"
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "14px", marginBottom: "24px" }}>
        {services.map((s) => (
          <Card key={s.id} glow={s.activeState}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ fontSize: "16px", fontWeight: "700", color: "#f8fafc" }}>{s.name}</div>
                  <span style={{
                    fontSize: "10.5px",
                    fontWeight: "700",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    background: s.activeState ? "rgba(0, 195, 255, 0.15)" : "rgba(255, 255, 255, 0.05)",
                    color: s.activeState ? "#00c3ff" : "#64748b",
                    border: `1px solid ${s.activeState ? "rgba(0, 195, 255, 0.3)" : "rgba(255, 255, 255, 0.1)"}`,
                  }}>
                    {s.badge}
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px", lineHeight: "1.5" }}>
                  {s.description}
                </div>
              </div>

              <button
                onClick={() => toggleService(s.id)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "700",
                  cursor: "pointer",
                  background: s.activeState ? "rgba(16, 185, 129, 0.15)" : "#142036",
                  color: s.activeState ? "#10b981" : "#94a3b8",
                  border: `1px solid ${s.activeState ? "rgba(16, 185, 129, 0.4)" : "rgba(255, 255, 255, 0.12)"}`,
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
              background: "#080d18",
              borderRadius: "6px",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              fontSize: "12px",
            }}>
              <div>
                <strong style={{ color: "#00c3ff" }}>Direct Customer Benefit:</strong>{" "}
                <span style={{ color: "#f8fafc" }}>{s.customer_benefit}</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ color: "#64748b" }}>Processing Cost:</span>{" "}
                <strong style={{ color: "#10b981" }}>{s.processing_fee}</strong>
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
        title="Active Industrial Demand Pools"
        description="Pools currently accumulating enterprise volume. Select an allocation to authorize hold with PayPal."
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {pools.map((p) => (
          <Card key={p.id} glow={p.pct === 100}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
              <div>
                <span style={{ fontSize: "11px", fontWeight: "700", color: "#00c3ff", background: "rgba(0, 195, 255, 0.12)", padding: "2px 8px", borderRadius: "4px" }}>
                  {p.category}
                </span>
                <div style={{ fontSize: "16px", fontWeight: "700", color: "#f8fafc", marginTop: "6px" }}>
                  {p.name}
                </div>
              </div>
              <span style={{
                fontSize: "11px",
                fontWeight: "700",
                padding: "3px 8px",
                borderRadius: "4px",
                background: p.pct === 100 ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
                color: p.pct === 100 ? "#10b981" : "#f59e0b",
                border: `1px solid ${p.pct === 100 ? "rgba(16, 185, 129, 0.3)" : "rgba(245, 158, 11, 0.3)"}`,
              }}>
                {p.status}
              </span>
            </div>

            <div style={{ fontSize: "12.5px", color: "#94a3b8", marginBottom: "14px" }}>
              {p.specs}
            </div>

            {/* Progress bar */}
            <div style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                <span style={{ color: "#64748b" }}>{p.committed} of {p.target} units committed</span>
                <strong style={{ color: p.pct === 100 ? "#10b981" : "#00c3ff" }}>{p.pct}%</strong>
              </div>
              <div style={{ width: "100%", height: "6px", background: "#142036", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ width: `${p.pct}%`, height: "100%", background: p.pct === 100 ? "#10b981" : "#00c3ff", boxShadow: p.pct === 100 ? "0 0 8px #10b981" : "0 0 8px #00c3ff" }} />
              </div>
            </div>

            {/* Price Box */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 14px",
              background: "#080d18",
              borderRadius: "6px",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              fontSize: "12.5px",
              marginBottom: "16px",
            }}>
              <div>
                <span style={{ color: "#64748b" }}>Negotiated:</span>{" "}
                <strong style={{ color: "#10b981" }}>${p.negotiated.toFixed(2)}</strong>{" "}
                <span style={{ textDecoration: "line-through", color: "#64748b", fontSize: "11px" }}>${p.retail}</span>
              </div>
              <div>
                <span style={{ color: "#64748b" }}>Collective Savings:</span>{" "}
                <strong style={{ color: "#10b981" }}>${p.savings.toLocaleString()}</strong>
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
                boxShadow: "0 0 14px rgba(255, 196, 57, 0.25)",
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

// --- View 6: Predictive Buying ---

function PredictiveBuying() {
  const predictions = [
    { id: 1, buyer: "AquaFlow Industries", product: "Industrial Centrifugal Water Pump 5HP", qty: 12, date: "2026-12-15", confidence: "High", reason: "Recurring 5–6 month municipal cycle verified from historical invoices" },
    { id: 2, buyer: "GreenPump Solutions", product: "Industrial Centrifugal Water Pump 5HP", qty: 15, date: "2026-12-20", confidence: "Medium", reason: "Seasonal agricultural flush + growth trend model" },
    { id: 3, buyer: "HydroTech Systems", product: "Industrial Centrifugal Water Pump 5HP", qty: 23, date: "2026-12-10", confidence: "High", reason: "Annual Q4 civil infrastructure procurement schedule" },
  ];

  return (
    <>
      <PageHeader
        title="Predictive Procurement Forecasting"
        description="Factual invoice pattern recognition separated from statistical forecasting models."
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {predictions.map((p) => (
          <Card key={p.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
              <div>
                <div style={{ fontSize: "15px", fontWeight: "700", color: "#f8fafc" }}>{p.product}</div>
                <div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "2px" }}>
                  Procurement forecast for <strong style={{ color: "#00c3ff" }}>{p.buyer}</strong> · Target delivery: {p.date}
                </div>
              </div>
              <span style={{
                fontSize: "11px",
                fontWeight: "700",
                padding: "3px 8px",
                borderRadius: "4px",
                background: "rgba(16, 185, 129, 0.15)",
                color: "#10b981",
                border: "1px solid rgba(16, 185, 129, 0.3)",
              }}>
                {p.confidence} Confidence
              </span>
            </div>
            <div style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "12px", lineHeight: "1.5" }}>
              {p.reason}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid rgba(255, 255, 255, 0.06)", fontSize: "13px" }}>
              <div>Forecasted Quantity: <strong style={{ color: "#f8fafc" }}>{p.qty} units</strong></div>
              <span style={{ color: "#00c3ff", fontWeight: "600" }}>Automatically Clustered into Pool #PO-2026-08</span>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

// --- View 7: Demand Mesh ---

function DemandMesh() {
  const members = [
    { name: "AquaFlow Industries", qty: 12, share: "24%", sector: "Municipal Utilities" },
    { name: "GreenPump Solutions", qty: 15, share: "30%", sector: "Agricultural Dynamics" },
    { name: "HydroTech Systems", qty: 23, share: "46%", sector: "Civil Engineering" },
  ];

  return (
    <>
      <PageHeader
        title="Demand Mesh Compatibility"
        description="Physical engineering tolerance matching across independent enterprise buyers."
      />

      <Card glow>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
          <div>
            <div style={{ fontSize: "16px", fontWeight: "700", color: "#f8fafc" }}>Specification Match: Centrifugal 5HP</div>
            <div style={{ fontSize: "12.5px", color: "#64748b", marginTop: "2px" }}>Cluster Reference: #MESH-5HP-IP55</div>
          </div>
          <span style={{ fontSize: "12px", fontWeight: "700", color: "#10b981", background: "rgba(16, 185, 129, 0.15)", padding: "4px 10px", borderRadius: "6px", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
            100% Technical Match
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "18px" }}>
          {members.map((m) => (
            <div key={m.name} style={{
              background: "#080d18",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: "8px",
              padding: "16px",
            }}>
              <div style={{ fontSize: "11px", color: "#64748b" }}>{m.sector}</div>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#f8fafc", margin: "4px 0 10px" }}>{m.name}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: "22px", fontWeight: "800", color: "#00c3ff" }}>
                  {m.qty} <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "400" }}>units</span>
                </span>
                <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>{m.share}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "14px",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          fontSize: "13px",
        }}>
          <div>
            <strong style={{ color: "#f8fafc" }}>50 units combined</strong> · Unlocks Tier-1 Supplier Price Tier ($365/unit)
          </div>
          <div style={{ color: "#94a3b8", fontFamily: "monospace", fontSize: "12px" }}>
            Flow 50 m³/h · Head 30m · IP55 · 400V
          </div>
        </div>
      </Card>
    </>
  );
}

// --- View 8: Negotiation Room ---

function NegotiationRoom() {
  const messages = [
    { from: "AI Coordinator", text: "Opened collective RFP for 50-unit volume commitment across 3 verified organizations. Requested tier-1 rate: $350/unit.", type: "agent" },
    { from: "Industrial Supplier", text: "Counter-offered $365.00/unit (12.05% discount vs standard $415 retail) with 30-day price lock and warranty inclusion.", type: "simulated" },
    { from: "System Recommendation", text: "Lock in $365.00/unit. Delivers $2,250 net direct savings across the cluster. Accept counter-offer.", type: "recommendation" },
  ];

  return (
    <>
      <PageHeader
        title="Autonomous Volume Negotiation Transcript"
        description="Automated counter-offers and multi-turn volume commitments."
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "20px" }}>
        <Stat label="Retail Baseline" value="$415" sub="Standard single-buyer pricing" />
        <Stat label="Negotiated Offer" value="$365" sub="Locked for 50 units" delta glowColor="#10b981" />
        <Stat label="Target Price" value="$350" sub="Initial RFP threshold" />
      </div>

      <Card glow>
        <div style={{ fontSize: "14px", fontWeight: "700", color: "#f8fafc", marginBottom: "14px" }}>
          Verified Negotiation Log
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {messages.map((m, idx) => (
            <div key={idx} style={{
              background: "#080d18",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: "8px",
              padding: "14px 16px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}>
              <span style={{ fontSize: "11px", fontWeight: "700", color: "#00c3ff" }}>{m.from}</span>
              <div style={{ fontSize: "13.5px", color: "#f8fafc", lineHeight: "1.5" }}>{m.text}</div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

// --- View 9: PayPal Orders v2 Settlement ---

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
        title="PayPal Gateway Approvals & Escrow Settlement"
        description="Independent bilateral buyer authorization via PayPal Orders v2 with cryptographic webhooks."
        badge="Zero Commingling"
      />

      {/* Enterprise Sign-In Card */}
      {!token ? (
        <Card glow style={{ maxWidth: "480px", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <span style={{ color: "#00c3ff" }}><Icons.PayPal /></span>
            <span style={{ fontSize: "15px", fontWeight: "700", color: "#f8fafc" }}>Enterprise Buyer Sign In</span>
          </div>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="buyer@enterprise.com"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "6px",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                background: "#080d18",
                color: "#f8fafc",
                fontSize: "13.5px",
                marginBottom: "12px",
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
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 0 14px rgba(0, 112, 186, 0.3)",
              }}
            >
              {loading ? "Authenticating…" : "Sign In to Authorize"}
            </button>
          </form>

          <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
            <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "8px", fontWeight: "700", textTransform: "uppercase" }}>
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
                    padding: "5px 10px",
                    background: "#142036",
                    color: "#94a3b8",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "4px",
                    fontSize: "11px",
                    cursor: "pointer",
                    fontWeight: "600",
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
          padding: "12px 18px",
          background: "rgba(16, 185, 129, 0.12)",
          border: "1px solid rgba(16, 185, 129, 0.35)",
          borderRadius: "8px",
          marginBottom: "24px",
          boxShadow: "0 0 12px rgba(16, 185, 129, 0.15)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: "#10b981" }}><Icons.Check /></span>
            <span style={{ fontSize: "13.5px", color: "#f8fafc" }}>
              Authenticated Enterprise: <strong style={{ color: "#10b981" }}>{orgName}</strong>
            </span>
          </div>
          <button
            onClick={onLogout}
            style={{
              fontSize: "12px",
              color: "#ef4444",
              background: "transparent",
              cursor: "pointer",
              fontWeight: "700",
            }}
          >
            Switch Account
          </button>
        </div>
      )}

      {/* Buyer Commitment List */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ fontSize: "14px", fontWeight: "700", color: "#f8fafc", marginBottom: "12px" }}>
          Pool Participant Orders & Authorizations
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {buyers.map((b) => (
            <div key={b.name} style={{
              background: "#0c1322",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "8px",
              padding: "14px 18px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <div>
                <div style={{ fontSize: "14.5px", fontWeight: "700", color: "#f8fafc" }}>{b.name}</div>
                <div style={{ fontSize: "12.5px", color: "#94a3b8", marginTop: "2px" }}>
                  {b.qty} units × $365.00 = <strong style={{ color: "#00c3ff" }}>${b.amount.toLocaleString()} USD</strong>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  padding: "4px 10px",
                  borderRadius: "4px",
                  background: b.status === "Authorized" ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
                  color: b.status === "Authorized" ? "#10b981" : "#f59e0b",
                  border: `1px solid ${b.status === "Authorized" ? "rgba(16, 185, 129, 0.3)" : "rgba(245, 158, 11, 0.3)"}`,
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
                      padding: "7px 16px",
                      background: "#0070ba",
                      color: "#ffffff",
                      borderRadius: "6px",
                      fontSize: "12.5px",
                      fontWeight: "700",
                      cursor: "pointer",
                      boxShadow: "0 0 10px rgba(0, 112, 186, 0.3)",
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

      {/* --- REAL PAYPAL CHECKOUT CARD --- */}
      {selectedBuyer && orderState && (
        <Card glow style={{ border: "2px solid #0070ba", marginTop: "16px" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", paddingBottom: "14px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Icons.PayPal />
              <div>
                <div style={{ fontSize: "16px", fontWeight: "800", color: "#f8fafc" }}>
                  PayPal Checkout · Orders v2
                </div>
                <div style={{ fontSize: "11.5px", color: "#00c3ff" }}>
                  Individual Bilateral Escrow Authorization
                </div>
              </div>
            </div>
            <div style={{ textAlign: "right", fontFamily: "monospace", fontSize: "12px", color: "#94a3b8" }}>
              {orderState.mint_order_id}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600", marginBottom: "8px" }}>
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
                    background: selectedRail === m.id ? "rgba(0, 112, 186, 0.25)" : "#080d18",
                    border: `1.5px solid ${selectedRail === m.id ? "#00c3ff" : "rgba(255, 255, 255, 0.08)"}`,
                    color: selectedRail === m.id ? "#ffffff" : "#94a3b8",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontSize: "12.5px", fontWeight: "700" }}>{m.label}</div>
                  <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>{m.note}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Line Item Invoice Breakdown */}
          <div style={{
            background: "#080d18",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "20px",
            fontSize: "13.5px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ color: "#94a3b8" }}>Item: {selectedBuyer.description || "Industrial Centrifugal Pump 5HP"}</span>
              <span style={{ color: "#f8fafc", fontWeight: "700" }}>{selectedBuyer.qty} units × $365.00</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", color: "#64748b" }}>
              <span>Retail Baseline Price:</span>
              <span style={{ textDecoration: "line-through" }}>${(selectedBuyer.qty * 415).toLocaleString()} USD</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", color: "#10b981", fontWeight: "600" }}>
              <span>MINT Volume Discount:</span>
              <span>-${(selectedBuyer.qty * (415 - 365)).toLocaleString()} USD</span>
            </div>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: "12px",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              fontSize: "16px",
              fontWeight: "800",
            }}>
              <span style={{ color: "#f8fafc" }}>Total Escrow Commitment:</span>
              <span style={{ color: "#00c3ff" }}>${orderState.amount?.toLocaleString()} USD</span>
            </div>
          </div>

          {/* Official PayPal Buttons Container */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px", margin: "0 auto" }}>
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
                  padding: "12px 20px",
                  background: "#ffc439",
                  color: "#003087",
                  borderRadius: "24px",
                  fontSize: "14.5px",
                  fontWeight: "800",
                  textDecoration: "none",
                  cursor: "pointer",
                  boxShadow: "0 0 16px rgba(255, 196, 57, 0.3)",
                }}
              >
                <Icons.PayPal /> {selectedRail === "paypal_working_capital" ? "Pay Later with PayPal" : "Pay with PayPal"}
              </a>
            ) : (
              <button
                disabled
                style={{
                  padding: "12px",
                  background: "#142036",
                  color: "#64748b",
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
                padding: "11px 20px",
                background: "#142036",
                color: "#f8fafc",
                borderRadius: "24px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                border: "1px solid rgba(255, 255, 255, 0.12)",
              }}
            >
              Debit or Credit Card
            </button>
          </div>

          <div style={{ textAlign: "center", marginTop: "14px", fontSize: "11.5px", color: "#64748b" }}>
            Secured by PayPal Sandbox Orders v2 · 180-Day Enterprise Buyer Protection Active
          </div>
        </Card>
      )}
    </>
  );
}
