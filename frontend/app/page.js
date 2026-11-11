"use client";

import { useState, useEffect, useMemo } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// --- Clean Line Icons (16x16, 1.8 stroke) ---
const Icons = {
  Command: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  Analytics: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  ),
  Pools: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  ),
  Predictive: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4" />
      <path d="M12 18v4" />
      <path d="M4.93 4.93l2.83 2.83" />
      <path d="M16.24 16.24l2.83 2.83" />
      <path d="M2 12h4" />
      <path d="M18 12h4" />
      <path d="M4.93 19.07l2.83-2.83" />
      <path d="M16.24 7.76l2.83-2.83" />
    </svg>
  ),
  Mesh: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  Negotiation: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m16 3 4 4-4 4" />
      <path d="M20 7H4" />
      <path d="m8 21-4-4 4-4" />
      <path d="M4 17h16" />
    </svg>
  ),
  Approvals: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  ),
  PayPal: () => (
    <svg width="18" height="20" viewBox="0 0 24 28" fill="none">
      <path d="M4.5 24.5L7.2 4.2h7.8c3.2 0 5.4.7 6.3 2.1.9 1.4.9 3.2.1 5.3-.9 2.5-2.7 4.2-5.3 5.2-1.2.5-2.7.7-4.6.7H8.8L6.9 24.5H4.5z" fill="#003087" />
      <path d="M8.8 17.5h2.7c3.2 0 5.4-.7 6.3-2.1.9-1.4.9-3.2.1-5.3-.9-2.5-2.7-4.2-5.3-5.2-1.2-.5-2.7-.7-4.6-.7H3.5L.8 24.5h3.8l2.2-7z" fill="#0079C1" opacity="0.95" />
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Shield: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Zap: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
};

const navItems = [
  { key: "command", label: "Command Centre", icon: Icons.Command },
  { key: "analytics", label: "Demand & Savings Graph", icon: Icons.Analytics },
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
  const [selectedPoolForCheckout, setSelectedPoolForCheckout] = useState(null);

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

  function handleDirectPoolCheckout(pool) {
    setSelectedPoolForCheckout(pool);
    setActive("approvals");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f7fa", color: "#111827" }}>
      {/* Sidebar */}
      <aside style={{
        width: "256px",
        background: "#ffffff",
        borderRight: "1px solid #e5e7eb",
        padding: "24px 16px",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", padding: "0 6px" }}>
          <div style={{
            width: "34px",
            height: "34px",
            borderRadius: "8px",
            background: "#003087",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "15px",
            fontWeight: "700",
            color: "#ffffff",
          }}>
            M
          </div>
          <div>
            <div style={{ fontSize: "16px", fontWeight: "700", letterSpacing: "-0.01em", color: "#003087" }}>
              MINT
            </div>
            <div style={{ fontSize: "11px", color: "#6b7280" }}>
              PayPal Procurement Gateway
            </div>
          </div>
        </div>

        {/* Connectivity Status */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 12px",
          borderRadius: "6px",
          background: backendOnline ? "#ecfdf5" : "#fffbeb",
          border: `1px solid ${backendOnline ? "#a7f3d0" : "#fde68a"}`,
          marginBottom: "18px",
          fontSize: "12px",
        }}>
          <span style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: backendOnline ? "#059669" : "#d97706",
          }} />
          <span style={{ color: backendOnline ? "#065f46" : "#92400e", fontWeight: "600" }}>
            {backendOnline ? "PayPal API Connected" : "Sandbox Mock Mode"}
          </span>
        </div>

        {/* Navigation */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "3px", flex: 1 }}>
          <div style={{ fontSize: "11px", color: "#9ca3af", padding: "4px 8px", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: "700" }}>
            Core Modules
          </div>
          {navItems.map(({ key, label, icon: IconComponent }) => {
            const isActive = active === key;
            return (
              <button
                key={key}
                onClick={() => setActive(key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  width: "100%",
                  textAlign: "left",
                  padding: "9px 12px",
                  borderRadius: "6px",
                  background: isActive ? "#f0f7fd" : "transparent",
                  color: isActive ? "#0070ba" : "#4b5563",
                  borderLeft: isActive ? "3px solid #0070ba" : "3px solid transparent",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: isActive ? "600" : "500",
                  transition: "background 0.12s ease, color 0.12s ease",
                }}
              >
                <span style={{ color: isActive ? "#0070ba" : "#9ca3af", display: "flex", alignItems: "center" }}>
                  <IconComponent />
                </span>
                {label}
              </button>
            );
          })}
        </nav>

        {/* Session Card */}
        <div style={{
          padding: "12px 14px",
          borderRadius: "8px",
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          fontSize: "12px",
        }}>
          {token ? (
            <div>
              <div style={{ color: "#6b7280", fontSize: "11px" }}>Active Buyer Account:</div>
              <div style={{ color: "#111827", fontWeight: "600", marginTop: "2px" }}>{orgName}</div>
              <button
                onClick={handleLogout}
                style={{
                  marginTop: "8px",
                  fontSize: "11.5px",
                  color: "#dc2626",
                  background: "transparent",
                  cursor: "pointer",
                  fontWeight: "600",
                  padding: 0,
                }}
              >
                Sign out
              </button>
            </div>
          ) : (
            <div style={{ color: "#6b7280" }}>
              <div style={{ fontWeight: "600", color: "#111827", marginBottom: "2px" }}>Guest Mode</div>
              Sign in under Settlement to authorize orders.
            </div>
          )}
        </div>
      </aside>

      {/* Main Workspace */}
      <main style={{ flex: 1, padding: "36px 44px", overflowY: "auto", maxWidth: "1180px" }}>
        {active === "command" && (
          <CommandCentre
            onNavigate={setActive}
            onCheckoutPool={handleDirectPoolCheckout}
          />
        )}
        {active === "analytics" && <SavingsAndDemandAnalytics onNavigate={setActive} />}
        {active === "pools" && <ActivePoolsCatalog onCheckoutPool={handleDirectPoolCheckout} />}
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
            preselectedPool={selectedPoolForCheckout}
          />
        )}

        {/* PayPal Security Footer */}
        <footer style={{
          marginTop: "48px",
          padding: "16px 20px",
          borderRadius: "8px",
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
          fontSize: "12px",
          color: "#6b7280",
          lineHeight: "1.6",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}>
          <span style={{ color: "#0070ba", display: "flex", alignItems: "center" }}>
            <Icons.Shield />
          </span>
          <div>
            <strong style={{ color: "#111827" }}>PayPal Orders v2 Enterprise Escrow:</strong> MINT does not commingle funds or operate pooled wallets. Each industrial participant authorizes an individual bilateral hold through PayPal REST v2. Funds are captured only upon verified pool threshold finalization with cryptographic webhook validation.
          </div>
        </footer>
      </main>
    </div>
  );
}

// --- Common UI Components ---

function PageHeader({ title, description, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px" }}>
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: "700", letterSpacing: "-0.02em", color: "#111827", margin: "0 0 4px" }}>
          {title}
        </h1>
        <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>
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
      border: "1px solid #e5e7eb",
      borderRadius: "10px",
      padding: "20px 24px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)",
      ...style,
    }}>
      {children}
    </div>
  );
}

function Stat({ label, value, sub, delta, icon: IconComponent }) {
  return (
    <div style={{
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: "10px",
      padding: "18px 20px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
    }}>
      <div>
        <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "6px", fontWeight: "500" }}>{label}</div>
        <div style={{ fontSize: "26px", fontWeight: "700", color: "#111827", letterSpacing: "-0.02em" }} className="tabular-nums">
          {value}
        </div>
        <div style={{ fontSize: "12px", color: delta ? "#059669" : "#6b7280", marginTop: "4px", fontWeight: delta ? "600" : "400" }}>
          {sub}
        </div>
      </div>
      {IconComponent && (
        <span style={{ color: "#0070ba", background: "#f0f7fd", padding: "8px", borderRadius: "8px" }}>
          <IconComponent />
        </span>
      )}
    </div>
  );
}

// --- View 1: Command Centre with Interactive Calculator & Live Graph ---

function CommandCentre({ onNavigate, onCheckoutPool }) {
  const [data, setData] = useState({
    predicted_purchases: 3,
    active_pools: 4,
    estimated_savings: 9575,
    pending_approvals: 2,
    combined_qty: 50,
    price: "$365 / unit",
    status: "Awaiting Buyer Authorizations",
  });

  // Interactive Calculator State
  const [calcEquipment, setCalcEquipment] = useState("pump");
  const [calcUnits, setCalcUnits] = useState(15);

  const equipmentCatalog = {
    pump: { name: "Industrial Centrifugal Pump 5HP", retail: 415, collective: 365, poolId: 1 },
    motor: { name: "3-Phase Induction Motor 15kW", retail: 570, collective: 480, poolId: 2 },
    flow: { name: "Smart Electromagnetic Flowmeter", retail: 475, collective: 390, poolId: 3 },
    valve: { name: "High-Pressure Gate Valve PN25", retail: 260, collective: 210, poolId: 4 },
  };

  const selectedItem = equipmentCatalog[calcEquipment];
  const retailSubtotal = selectedItem.retail * calcUnits;
  const collectiveSubtotal = selectedItem.collective * calcUnits;
  const calculatedSavings = retailSubtotal - collectiveSubtotal;
  const savingsPct = ((calculatedSavings / retailSubtotal) * 100).toFixed(1);

  return (
    <>
      <PageHeader
        title="Command Centre"
        description="Collective demand aggregation across industrial enterprises with automated PayPal escrow settlement."
        action={
          <button
            onClick={() => onNavigate("analytics")}
            style={{
              padding: "8px 16px",
              background: "#ffffff",
              border: "1px solid #d1d5db",
              color: "#374151",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            View Demand Graphs & Analytics →
          </button>
        }
      />

      {/* KPI Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
        <Stat label="Active Demand Pools" value="4 Active" sub="128 units total" icon={Icons.Pools} />
        <Stat label="Total Cash Savings" value="$9,575 USD" sub="Across 4 equipment pools" delta icon={Icons.Zap} />
        <Stat label="PayPal Escrow Processed" value="$18,250" sub="100% bilateral hold rate" icon={Icons.PayPal} />
        <Stat label="Pending Authorizations" value="2 Orders" sub="Awaiting buyer signature" icon={Icons.Approvals} />
      </div>

      {/* FEATURE: Interactive Savings & PayPal Order Calculator */}
      <Card style={{ marginBottom: "24px", border: "1px solid #0070ba", background: "#f0f7fd" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#0070ba", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Interactive Collective Procurement Calculator
            </div>
            <div style={{ fontSize: "17px", fontWeight: "700", color: "#003087" }}>
              Calculate Immediate PayPal Escrow Hold & Savings
            </div>
          </div>
          <span style={{ fontSize: "12px", background: "#ffffff", color: "#0070ba", border: "1px solid #bfdbfe", padding: "4px 10px", borderRadius: "6px", fontWeight: "600" }}>
            Unlocks PayPal Instant Volume Escrow
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px" }}>
          {/* Left: Inputs */}
          <div>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
              Select Mission-Critical Equipment:
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "16px" }}>
              {Object.entries(equipmentCatalog).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => setCalcEquipment(key)}
                  style={{
                    padding: "10px 12px",
                    borderRadius: "6px",
                    textAlign: "left",
                    background: calcEquipment === key ? "#ffffff" : "#f8fafc",
                    border: `1.5px solid ${calcEquipment === key ? "#0070ba" : "#e2e8f0"}`,
                    color: calcEquipment === key ? "#003087" : "#4b5563",
                    fontSize: "12.5px",
                    fontWeight: calcEquipment === key ? "600" : "500",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
                  <div style={{ fontSize: "11px", color: "#059669", marginTop: "2px" }}>
                    ${item.collective}/unit (save ${item.retail - item.collective})
                  </div>
                </button>
              ))}
            </div>

            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", fontWeight: "600", marginBottom: "6px" }}>
                <span>Order Quantity:</span>
                <span style={{ color: "#0070ba", fontSize: "14px" }}>{calcUnits} units</span>
              </div>
              <input
                type="range"
                min="1"
                max="40"
                value={calcUnits}
                onChange={(e) => setCalcUnits(parseInt(e.target.value))}
                style={{ width: "100%", accentColor: "#0070ba", cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#9ca3af" }}>
                <span>1 unit</span>
                <span>20 units</span>
                <span>40 units</span>
              </div>
            </div>
          </div>

          {/* Right: Real-time Financial Breakdown & Direct PayPal Authorization */}
          <div style={{
            background: "#ffffff",
            border: "1px solid #bfdbfe",
            borderRadius: "8px",
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#6b7280", marginBottom: "6px" }}>
                <span>Standard Retail Baseline:</span>
                <span style={{ textDecoration: "line-through" }}>${retailSubtotal.toLocaleString()} USD</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#059669", fontWeight: "600", marginBottom: "10px" }}>
                <span>MINT Negotiated Discount ({savingsPct}%):</span>
                <span>-${calculatedSavings.toLocaleString()} USD</span>
              </div>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: "10px",
                borderTop: "1px solid #e5e7eb",
                fontSize: "16px",
                fontWeight: "700",
                color: "#111827",
              }}>
                <span>PayPal Escrow Hold:</span>
                <span style={{ color: "#0070ba" }}>${collectiveSubtotal.toLocaleString()} USD</span>
              </div>
            </div>

            <button
              onClick={() => onCheckoutPool({
                name: selectedItem.name,
                qty: calcUnits,
                amount: collectiveSubtotal,
                savings: calculatedSavings,
                id: selectedItem.poolId,
              })}
              style={{
                marginTop: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "11px 18px",
                background: "#ffc439",
                color: "#003087",
                borderRadius: "20px",
                fontSize: "13.5px",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
              }}
            >
              <Icons.PayPal /> Authorize ${collectiveSubtotal.toLocaleString()} with PayPal
            </button>
          </div>
        </div>
      </Card>

      {/* Featured Water Pump Collective Pool */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
          <div>
            <div style={{ fontSize: "11.5px", color: "#0070ba", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "4px" }}>
              Active Demand Pool #PO-2026-08
            </div>
            <div style={{ fontSize: "17px", fontWeight: "700", color: "#111827" }}>
              Industrial Centrifugal Water Pump 5HP
            </div>
            <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "2px" }}>
              Specifications: Flow 50 m³/h · Head 30 m · IP55 Weatherproof · 3-Phase 400V
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
            100% Volume Locked (50/50 units)
          </span>
        </div>

        {/* Demand Progress Bar */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#6b7280", marginBottom: "6px" }}>
            <span>Target Volume: 50 units</span>
            <strong style={{ color: "#0070ba" }}>50 units committed by 3 enterprises</strong>
          </div>
          <div style={{ width: "100%", height: "8px", background: "#e2e8f0", borderRadius: "4px", overflow: "hidden" }}>
            <div style={{ width: "100%", height: "100%", background: "#0070ba", borderRadius: "4px" }} />
          </div>
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
            <div style={{ color: "#6b7280", fontSize: "12px" }}>Negotiated Unit Price</div>
            <div style={{ fontSize: "18px", fontWeight: "700", color: "#059669", marginTop: "2px" }}>$365.00 / unit</div>
          </div>
          <div>
            <div style={{ color: "#6b7280", fontSize: "12px" }}>Direct Collective Savings</div>
            <div style={{ fontSize: "18px", fontWeight: "700", color: "#059669", marginTop: "2px" }}>$2,500.00 USD</div>
          </div>
          <div>
            <div style={{ color: "#6b7280", fontSize: "12px" }}>Total Pool PayPal Value</div>
            <div style={{ fontSize: "18px", fontWeight: "700", color: "#111827", marginTop: "2px" }}>$18,250.00 USD</div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button
            onClick={() => onNavigate("pools")}
            style={{
              padding: "9px 16px",
              background: "#ffffff",
              border: "1px solid #d1d5db",
              color: "#374151",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Browse All Active Pools (4)
          </button>
          <button
            onClick={() => onNavigate("approvals")}
            style={{
              padding: "9px 18px",
              background: "#0070ba",
              color: "#ffffff",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0, 112, 186, 0.2)",
            }}
          >
            Review PayPal Escrow Approvals →
          </button>
        </div>
      </Card>
    </>
  );
}

// --- View 2: Interactive Graphs & Demand/Savings Analytics ---

function SavingsAndDemandAnalytics({ onNavigate }) {
  const [timeframe, setTimeframe] = useState("1Y");
  const [activeCurvePoint, setActiveCurvePoint] = useState(2); // 50 units tier

  const monthlyTrendData = [
    { month: "Jun 2025", retail: 42.2, collective: 36.5, savings: 5.7, volume: 36.5 },
    { month: "Aug 2025", retail: 58.1, collective: 49.9, savings: 8.2, volume: 49.9 },
    { month: "Oct 2025", retail: 64.3, collective: 54.8, savings: 9.5, volume: 54.8 },
    { month: "Dec 2025", retail: 82.0, collective: 69.7, savings: 12.3, volume: 69.7 },
    { month: "Feb 2026", retail: 71.5, collective: 60.9, savings: 10.6, volume: 60.9 },
    { month: "Apr 2026", retail: 89.4, collective: 75.2, savings: 14.2, volume: 75.2 },
    { month: "Jun 2026", retail: 98.2, collective: 81.8, savings: 16.4, volume: 81.8 },
    { month: "Aug 2026", retail: 112.0, collective: 92.5, savings: 19.5, volume: 92.5 },
    { month: "Oct 2026", retail: 128.0, collective: 104.5, savings: 23.5, volume: 104.5 },
    { month: "Dec 2026", retail: 145.0, collective: 117.2, savings: 27.8, volume: 117.2 },
  ];

  const volumeTiers = [
    { units: 10, price: 415, savings: 0, label: "Retail Single Buyer", note: "1-15 units baseline" },
    { units: 25, price: 390, savings: 25, label: "Tier-3 Collective", note: "16-30 units ($25/u discount)" },
    { units: 50, price: 365, savings: 50, label: "Tier-2 Collective (Active)", note: "31-60 units ($50/u discount)" },
    { units: 75, price: 345, savings: 70, label: "Tier-1 Enterprise", note: "61-80 units ($70/u discount)" },
    { units: 100, price: 330, savings: 85, label: "Mega-Pool Super Tier", note: "81-100+ units ($85/u discount)" },
  ];

  return (
    <>
      <PageHeader
        title="Procurement Demand & Savings Graphs"
        description="Comprehensive volume elasticity curves and total PayPal Payment Volume (TPV) settlement analytics."
      />

      {/* Top Telemetry */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
        <Stat label="Cumulative Cash Saved" value="$147,700" sub="Vs retail procurement" delta />
        <Stat label="Total PayPal TPV" value="$678,000" sub="100% verified settlement" />
        <Stat label="Escrow Capture Rate" value="100.0%" sub="0 disputes or chargebacks" delta />
        <Stat label="Avg Hold Duration" value="18.4 Hours" sub="Rapid bilateral release" />
      </div>

      {/* GRAPH 1: Interactive Monthly Spend & Savings Comparison Area/Line Chart */}
      <Card style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <div style={{ fontSize: "16px", fontWeight: "700", color: "#111827" }}>
              Procurement Spend & PayPal Settlement Progression
            </div>
            <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "2px" }}>
              Visualizing Historical Retail Invoices vs MINT Collective PayPal Volume (in thousands USD)
            </div>
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            {["6M", "1Y", "All Time"].map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                style={{
                  padding: "5px 12px",
                  borderRadius: "4px",
                  background: timeframe === t ? "#0070ba" : "#f1f5f9",
                  color: timeframe === t ? "#ffffff" : "#4b5563",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Graph */}
        <div style={{ width: "100%", height: "240px", position: "relative" }}>
          <svg viewBox="0 0 800 220" style={{ width: "100%", height: "100%", overflow: "visible" }}>
            {/* Grid Lines */}
            <line x1="40" y1="20" x2="780" y2="20" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="40" y1="70" x2="780" y2="70" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="40" y1="120" x2="780" y2="120" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="40" y1="170" x2="780" y2="170" stroke="#e5e7eb" strokeWidth="1.5" />

            {/* Y Axis Labels */}
            <text x="32" y="24" fill="#9ca3af" fontSize="10" textAnchor="end">$150k</text>
            <text x="32" y="74" fill="#9ca3af" fontSize="10" textAnchor="end">$100k</text>
            <text x="32" y="124" fill="#9ca3af" fontSize="10" textAnchor="end">$50k</text>
            <text x="32" y="174" fill="#9ca3af" fontSize="10" textAnchor="end">$0</text>

            {/* Area under PayPal Volume Curve */}
            <polygon
              points="60,170 60,128 140,113 220,107 300,90 380,100 460,84 540,76 620,63 700,50 780,36 780,170"
              fill="rgba(0, 112, 186, 0.08)"
            />

            {/* Retail Cost Line (Dashed Gray) */}
            <polyline
              points="60,122 140,103 220,96 300,75 380,88 460,68 540,58 620,43 700,25 780,10"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* MINT + PayPal Collective Volume Line (Solid PayPal Blue) */}
            <polyline
              points="60,128 140,113 220,107 300,90 380,100 460,84 540,76 620,63 700,50 780,36"
              fill="none"
              stroke="#0070ba"
              strokeWidth="2.5"
            />

            {/* Savings Delta Line (Green) */}
            <polyline
              points="60,163 140,160 220,158 300,155 380,157 460,153 540,150 620,146 700,142 780,137"
              fill="none"
              stroke="#059669"
              strokeWidth="2"
            />

            {/* Data Points on PayPal Line */}
            {[
              [60, 128], [140, 113], [220, 107], [300, 90], [380, 100],
              [460, 84], [540, 76], [620, 63], [700, 50], [780, 36],
            ].map(([x, y], idx) => (
              <circle key={idx} cx={x} cy={y} r="4" fill="#ffffff" stroke="#0070ba" strokeWidth="2" />
            ))}

            {/* X Axis Labels */}
            {monthlyTrendData.map((d, idx) => (
              <text key={idx} x={60 + idx * 80} y="192" fill="#6b7280" fontSize="10" textAnchor="middle">
                {d.month.split(" ")[0]}
              </text>
            ))}
          </svg>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginTop: "14px", fontSize: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "12px", height: "3px", background: "#9ca3af", borderTop: "1px dashed #9ca3af" }} />
            <span style={{ color: "#6b7280" }}>Retail Fragmented Cost</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "12px", height: "3px", background: "#0070ba" }} />
            <span style={{ color: "#003087", fontWeight: "600" }}>MINT Collective PayPal Volume</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "12px", height: "3px", background: "#059669" }} />
            <span style={{ color: "#059669", fontWeight: "600" }}>Net Direct Cash Savings</span>
          </div>
        </div>
      </Card>

      {/* GRAPH 2: Volume Elasticity Tier Curve */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "20px" }}>
        <Card>
          <div style={{ fontSize: "15px", fontWeight: "700", color: "#111827", marginBottom: "4px" }}>
            Volume Discount Elasticity Curve
          </div>
          <div style={{ fontSize: "12.5px", color: "#6b7280", marginBottom: "16px" }}>
            Click a volume tier to inspect supplier pricing and PayPal hold requirements
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {volumeTiers.map((t, idx) => {
              const isSelected = activeCurvePoint === idx;
              return (
                <div
                  key={t.units}
                  onClick={() => setActiveCurvePoint(idx)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    background: isSelected ? "#f0f7fd" : "#f8fafc",
                    border: `1.5px solid ${isSelected ? "#0070ba" : "#e2e8f0"}`,
                    cursor: "pointer",
                    transition: "all 0.1s ease",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "13.5px", fontWeight: "600", color: isSelected ? "#003087" : "#111827" }}>
                      {t.label} ({t.units} units)
                    </div>
                    <div style={{ fontSize: "11.5px", color: "#6b7280" }}>{t.note}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "15px", fontWeight: "700", color: isSelected ? "#0070ba" : "#111827" }}>
                      ${t.price} <span style={{ fontSize: "11px", color: "#6b7280", fontWeight: "400" }}>/ unit</span>
                    </div>
                    {t.savings > 0 && (
                      <div style={{ fontSize: "11px", color: "#059669", fontWeight: "600" }}>
                        Save ${t.savings * t.units} total
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* PayPal Gateway Settlement Share */}
        <Card>
          <div style={{ fontSize: "15px", fontWeight: "700", color: "#111827", marginBottom: "4px" }}>
            PayPal Payment Source Share
          </div>
          <div style={{ fontSize: "12.5px", color: "#6b7280", marginBottom: "16px" }}>
            Breakdown of commercial funding methods across active pools
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                <span style={{ fontWeight: "600", color: "#003087" }}>PayPal Enterprise Wallet</span>
                <span style={{ fontWeight: "700" }}>58% ($393,240)</span>
              </div>
              <div style={{ width: "100%", height: "8px", background: "#e2e8f0", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ width: "58%", height: "100%", background: "#0070ba", borderRadius: "4px" }} />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                <span style={{ fontWeight: "600", color: "#059669" }}>PayPal Pay Later (Net 30 Escrow)</span>
                <span style={{ fontWeight: "700" }}>26% ($176,280)</span>
              </div>
              <div style={{ width: "100%", height: "8px", background: "#e2e8f0", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ width: "26%", height: "100%", background: "#059669", borderRadius: "4px" }} />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                <span style={{ fontWeight: "600", color: "#374151" }}>PayPal Business Debit & Cards</span>
                <span style={{ fontWeight: "700" }}>16% ($108,480)</span>
              </div>
              <div style={{ width: "100%", height: "8px", background: "#e2e8f0", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ width: "16%", height: "100%", background: "#2c2e2f", borderRadius: "4px" }} />
              </div>
            </div>
          </div>

          <div style={{
            marginTop: "20px",
            padding: "12px",
            background: "#f0f7fd",
            borderRadius: "6px",
            border: "1px solid #bfdbfe",
            fontSize: "12px",
            color: "#003087",
            lineHeight: "1.5",
          }}>
            <strong>PayPal Growth Engine:</strong> Collective procurement drives high-ticket B2B payment frequency to PayPal's REST v2 gateway, transitioning spot offline payments into automated cryptographic online capture.
          </div>
        </Card>
      </div>
    </>
  );
}

// --- View 3: Active Demand Pools Catalog ---

function ActivePoolsCatalog({ onCheckoutPool }) {
  const [pools, setPools] = useState([
    {
      id: 1,
      name: "Industrial Centrifugal Water Pump 5HP",
      category: "Fluid Mechanics",
      target_quantity: 50,
      committed_quantity: 50,
      retail_price: 415.00,
      negotiated_price: 365.00,
      savings_per_unit: 50.00,
      total_savings: 2500.00,
      status: "Ready for PayPal Capture",
      completion_pct: 100,
      days_remaining: 8,
      specs: "Flow 50 m³/h · Head 30m · IP55 · 400V 3-Phase",
      buyers_count: 3,
    },
    {
      id: 2,
      name: "High-Efficiency 3-Phase Induction Motors 15kW",
      category: "Electromechanical",
      target_quantity: 30,
      committed_quantity: 24,
      retail_price: 570.00,
      negotiated_price: 480.00,
      savings_per_unit: 90.00,
      total_savings: 2700.00,
      status: "Active Aggregation",
      completion_pct: 80,
      days_remaining: 14,
      specs: "15kW (20HP) · 1460 RPM · IE3 Premium · Cast Iron",
      buyers_count: 4,
    },
    {
      id: 3,
      name: "Smart Electromagnetic Flowmeters DN80",
      category: "Industrial Sensors",
      target_quantity: 25,
      committed_quantity: 16,
      retail_price: 475.00,
      negotiated_price: 390.00,
      savings_per_unit: 85.00,
      total_savings: 2125.00,
      status: "Active Aggregation",
      completion_pct: 64,
      days_remaining: 18,
      specs: "DN80 (3 inch) · Flanged PN16 · RS485 Modbus · PTFE",
      buyers_count: 2,
    },
    {
      id: 4,
      name: "High-Pressure Industrial Gate Valves PN25",
      category: "Fluid Valves",
      target_quantity: 50,
      committed_quantity: 38,
      retail_price: 260.00,
      negotiated_price: 210.00,
      savings_per_unit: 50.00,
      total_savings: 2500.00,
      status: "Active Aggregation",
      completion_pct: 76,
      days_remaining: 11,
      specs: "DN100 · Flanged PN25 · WCB Cast Steel · Stainless Trim",
      buyers_count: 5,
    },
  ]);

  useEffect(() => {
    fetch(`${API_BASE}/api/v1/demo/pools`)
      .then((res) => res.json())
      .then((res) => {
        if (res && res.pools) setPools(res.pools);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <PageHeader
        title="Active Industrial Demand Pools"
        description="Join an existing pool to combine purchasing power and authorize hold directly through PayPal."
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {pools.map((p) => (
          <Card key={p.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <div>
                <span style={{ fontSize: "11px", fontWeight: "700", color: "#0070ba", background: "#f0f7fd", padding: "2px 8px", borderRadius: "4px" }}>
                  {p.category}
                </span>
                <div style={{ fontSize: "16px", fontWeight: "700", color: "#111827", marginTop: "6px" }}>
                  {p.name}
                </div>
              </div>
              <span style={{
                fontSize: "11.5px",
                fontWeight: "600",
                padding: "3px 8px",
                borderRadius: "4px",
                background: p.completion_pct === 100 ? "#ecfdf5" : "#fffbeb",
                color: p.completion_pct === 100 ? "#059669" : "#d97706",
                border: `1px solid ${p.completion_pct === 100 ? "#a7f3d0" : "#fde68a"}`,
              }}>
                {p.status}
              </span>
            </div>

            <div style={{ fontSize: "12.5px", color: "#6b7280", marginBottom: "14px" }}>
              {p.specs}
            </div>

            {/* Progress Meter */}
            <div style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                <span style={{ color: "#6b7280" }}>{p.committed_quantity} of {p.target_quantity} units pooled</span>
                <strong style={{ color: "#0070ba" }}>{p.completion_pct}%</strong>
              </div>
              <div style={{ width: "100%", height: "6px", background: "#e2e8f0", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ width: `${p.completion_pct}%`, height: "100%", background: p.completion_pct === 100 ? "#059669" : "#0070ba", borderRadius: "3px" }} />
              </div>
            </div>

            {/* Financial Details */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              padding: "10px 14px",
              background: "#f8fafc",
              borderRadius: "6px",
              border: "1px solid #e2e8f0",
              fontSize: "12.5px",
              marginBottom: "16px",
            }}>
              <div>
                <span style={{ color: "#6b7280" }}>Negotiated Price:</span>{" "}
                <strong style={{ color: "#059669" }}>${p.negotiated_price.toFixed(2)}</strong>{" "}
                <span style={{ textDecoration: "line-through", color: "#9ca3af", fontSize: "11px" }}>${p.retail_price}</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ color: "#6b7280" }}>Collective Savings:</span>{" "}
                <strong style={{ color: "#059669" }}>${p.total_savings.toLocaleString()}</strong>
              </div>
            </div>

            <button
              onClick={() => onCheckoutPool({
                id: p.id,
                name: p.name,
                qty: 10,
                amount: p.negotiated_price * 10,
                savings: p.savings_per_unit * 10,
              })}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "9px 16px",
                background: "#0070ba",
                color: "#ffffff",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0, 112, 186, 0.2)",
              }}
            >
              <Icons.PayPal /> Join Pool & Authorize 10 units (${(p.negotiated_price * 10).toLocaleString()})
            </button>
          </Card>
        ))}
      </div>
    </>
  );
}

// --- View 4: Predictive Buying ---

function PredictiveBuying() {
  const [predictions, setPredictions] = useState([
    { id: 1, buyer: "AquaFlow Industries", product: "Industrial Centrifugal Water Pump 5HP", qty: 12, date: "2026-12-15", confidence: "High", reason: "Recurring 5–6 month municipal cycle verified from historical invoices", status: "Open" },
    { id: 2, buyer: "GreenPump Solutions", product: "Industrial Centrifugal Water Pump 5HP", qty: 15, date: "2026-12-20", confidence: "Medium", reason: "Seasonal agricultural flush + growth trend model", status: "Open" },
    { id: 3, buyer: "HydroTech Systems", product: "Industrial Centrifugal Water Pump 5HP", qty: 23, date: "2026-12-10", confidence: "High", reason: "Annual Q4 civil infrastructure procurement schedule", status: "Open" },
  ]);

  useEffect(() => {
    fetch(`${API_BASE}/api/v1/demo/predictions`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.predictions) {
          setPredictions(data.predictions.map((p, idx) => ({
            id: idx + 1,
            buyer: p.buyer || p.organization || `Buyer ${idx + 1}`,
            product: p.product,
            qty: p.predicted_quantity,
            date: p.predicted_date,
            confidence: p.confidence === "high" ? "High" : "Medium",
            reason: p.explanation,
            status: "Open"
          })));
        }
      })
      .catch(() => {});
  }, []);

  function handleAction(id, action) {
    setPredictions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: action === "join" ? "Joined Pool" : "Dismissed" } : item
      )
    );
  }

  return (
    <>
      <PageHeader
        title="Predictive Buying"
        description="Factual invoice pattern recognition separated from statistical forecasting models."
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {predictions.map((p) => (
          <Card key={p.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
              <div>
                <div style={{ fontSize: "15px", fontWeight: "700", color: "#111827" }}>{p.product}</div>
                <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "2px" }}>
                  Procurement forecast for <strong style={{ color: "#111827" }}>{p.buyer}</strong> · Target delivery: {p.date}
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  padding: "3px 8px",
                  borderRadius: "4px",
                  background: p.confidence === "High" ? "#ecfdf5" : "#fffbeb",
                  color: p.confidence === "High" ? "#059669" : "#d97706",
                  border: `1px solid ${p.confidence === "High" ? "#a7f3d0" : "#fde68a"}`,
                }}>
                  {p.confidence} confidence
                </span>
                {p.status !== "Open" && (
                  <span style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    padding: "3px 8px",
                    borderRadius: "4px",
                    background: p.status === "Joined Pool" ? "#eff6ff" : "#fef2f2",
                    color: p.status === "Joined Pool" ? "#0070ba" : "#dc2626",
                  }}>
                    {p.status}
                  </span>
                )}
              </div>
            </div>

            <div style={{ fontSize: "13px", color: "#4b5563", marginBottom: "14px", lineHeight: "1.5" }}>
              {p.reason}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid #f1f5f9" }}>
              <div style={{ fontSize: "13px", color: "#6b7280" }}>
                Forecasted volume: <strong style={{ color: "#111827" }}>{p.qty} units</strong>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  disabled={p.status !== "Open"}
                  onClick={() => handleAction(p.id, "dismiss")}
                  style={{
                    padding: "6px 12px",
                    background: "#ffffff",
                    color: "#6b7280",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "12.5px",
                    cursor: p.status === "Open" ? "pointer" : "default",
                    opacity: p.status === "Open" ? 1 : 0.5,
                  }}
                >
                  Dismiss
                </button>
                <button
                  disabled={p.status !== "Open"}
                  onClick={() => handleAction(p.id, "join")}
                  style={{
                    padding: "6px 14px",
                    background: "#0070ba",
                    color: "#ffffff",
                    borderRadius: "6px",
                    fontSize: "12.5px",
                    fontWeight: "600",
                    cursor: p.status === "Open" ? "pointer" : "default",
                    opacity: p.status === "Open" ? 1 : 0.5,
                  }}
                >
                  {p.status === "Joined Pool" ? "Joined" : "Accept & Join Pool"}
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

// --- View 5: Demand Mesh ---

function DemandMesh() {
  const members = [
    { name: "AquaFlow Industries", qty: 12, share: "24%", sector: "Municipal Utilities" },
    { name: "GreenPump Solutions", qty: 15, share: "30%", sector: "Agricultural Dynamics" },
    { name: "HydroTech Systems", qty: 23, share: "46%", sector: "Civil Engineering" },
  ];

  return (
    <>
      <PageHeader
        title="Demand Mesh"
        description="Physical engineering tolerance matching across independent enterprise buyers."
      />

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
          <div>
            <div style={{ fontSize: "16px", fontWeight: "700", color: "#111827" }}>Specification Match: Centrifugal 5HP</div>
            <div style={{ fontSize: "12.5px", color: "#6b7280", marginTop: "2px" }}>Cluster Reference: #MESH-5HP-IP55</div>
          </div>
          <span style={{ fontSize: "12px", fontWeight: "600", color: "#059669", background: "#ecfdf5", padding: "4px 10px", borderRadius: "6px", border: "1px solid #a7f3d0" }}>
            100% Technical Match
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "18px" }}>
          {members.map((m) => (
            <div key={m.name} style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              padding: "16px",
            }}>
              <div style={{ fontSize: "11px", color: "#6b7280", fontWeight: "500" }}>{m.sector}</div>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "#111827", margin: "4px 0 10px" }}>{m.name}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: "22px", fontWeight: "700", color: "#0070ba" }}>
                  {m.qty} <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: "400" }}>units</span>
                </span>
                <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: "500" }}>{m.share}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "14px",
          borderTop: "1px solid #e5e7eb",
          fontSize: "13px",
        }}>
          <div>
            <strong style={{ color: "#111827" }}>50 units combined</strong> · Unlocks Tier-1 Supplier Price Tier ($365/unit)
          </div>
          <div style={{ color: "#6b7280", fontFamily: "monospace", fontSize: "12px" }}>
            Flow 50 m³/h · Head 30m · IP55 · 400V
          </div>
        </div>
      </Card>
    </>
  );
}

// --- View 6: Negotiation Room ---

function NegotiationRoom() {
  const [messages, setMessages] = useState([
    { from: "AI Coordinator", text: "Opened collective RFP for 50-unit volume commitment across 3 verified organizations. Requested tier-1 rate: $350/unit.", type: "agent" },
    { from: "Industrial Supplier", text: "Counter-offered $365.00/unit (12.05% discount vs standard $415 retail) with 30-day price lock and warranty inclusion.", type: "simulated" },
    { from: "System Recommendation", text: "Lock in $365.00/unit. Delivers $2,250 net direct savings across the cluster. Accept counter-offer.", type: "recommendation" },
  ]);

  useEffect(() => {
    fetch(`${API_BASE}/api/v1/demo/negotiation`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.messages) {
          setMessages(data.messages);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <PageHeader
        title="Negotiation Room"
        description="Autonomous volume negotiation transcript and verified supplier counter-offers."
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "20px" }}>
        <Stat label="Retail Baseline" value="$415" sub="Standard single-buyer pricing" />
        <Stat label="Negotiated Offer" value="$365" sub="Locked for 50 units" delta />
        <Stat label="Target Price" value="$350" sub="Initial RFP threshold" />
      </div>

      <Card>
        <div style={{ fontSize: "14px", fontWeight: "700", color: "#111827", marginBottom: "14px" }}>
          Negotiation Transcript
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {messages.map((m, idx) => {
            const isAgent = m.type === "agent" || m.from?.includes("AI");
            const isRec = m.type === "recommendation" || m.from?.includes("Recommendation");
            const badgeBg = isAgent ? "#eff6ff" : isRec ? "#ecfdf5" : "#fffbeb";
            const badgeColor = isAgent ? "#0070ba" : isRec ? "#059669" : "#d97706";
            return (
              <div key={idx} style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "14px 16px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    background: badgeBg,
                    color: badgeColor,
                  }}>
                    {m.from}
                  </span>
                </div>
                <div style={{ fontSize: "13.5px", color: "#374151", lineHeight: "1.5" }}>
                  {m.text}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}

// --- View 7: Full PayPal Gateway Settlement & Checkout ---

function Approvals({ token, setToken, orgName, setOrgName, onLogout, preselectedPool }) {
  const [loginEmail, setLoginEmail] = useState("");
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [orderState, setOrderState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("paypal_wallet");

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

  // If a pool was passed from another view
  useEffect(() => {
    if (preselectedPool) {
      const customBuyer = {
        id: 1,
        name: orgName || "AquaFlow Industries",
        email: "aquaflow@example.com",
        qty: preselectedPool.qty,
        amount: preselectedPool.amount,
        status: "Pending",
        description: preselectedPool.name,
      };
      setSelectedBuyer(customBuyer);
      initializePayPalOrder(customBuyer);
    }
  }, [preselectedPool]);

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
          description: buyer.description || `MINT Industrial Collective Purchase - ${buyer.qty}x Centrifugal Pump 5HP`,
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
        title="PayPal Gateway Approvals & Settlement"
        description="Independent bilateral buyer authorization via PayPal Orders v2. Zero pooled funds."
      />

      {/* Enterprise Sign-In Card */}
      {!token ? (
        <Card style={{ maxWidth: "480px", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <span style={{ color: "#0070ba" }}><Icons.PayPal /></span>
            <span style={{ fontSize: "15px", fontWeight: "700", color: "#111827" }}>Enterprise Buyer Sign In</span>
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
                border: "1px solid #d1d5db",
                background: "#ffffff",
                color: "#111827",
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
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              {loading ? "Authenticating…" : "Sign In to Authorize"}
            </button>
          </form>

          <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: "11px", color: "#6b7280", marginBottom: "8px", fontWeight: "600", textTransform: "uppercase" }}>
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
                    background: "#f1f5f9",
                    color: "#374151",
                    border: "1px solid #cbd5e1",
                    borderRadius: "4px",
                    fontSize: "11px",
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
          padding: "12px 18px",
          background: "#ecfdf5",
          border: "1px solid #a7f3d0",
          borderRadius: "8px",
          marginBottom: "24px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: "#059669" }}><Icons.Check /></span>
            <span style={{ fontSize: "13.5px", color: "#065f46" }}>
              Authenticated Enterprise: <strong style={{ color: "#047857" }}>{orgName}</strong>
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
      <div style={{ marginBottom: "28px" }}>
        <div style={{ fontSize: "14px", fontWeight: "700", color: "#111827", marginBottom: "12px" }}>
          Pool Participants & Order Statuses
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {buyers.map((b) => (
            <div key={b.name} style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "14px 18px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <div>
                <div style={{ fontSize: "14.5px", fontWeight: "600", color: "#111827" }}>{b.name}</div>
                <div style={{ fontSize: "12.5px", color: "#6b7280", marginTop: "2px" }}>
                  {b.qty} units × $365.00 = <strong style={{ color: "#111827" }}>${b.amount.toLocaleString()} USD</strong>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  padding: "4px 10px",
                  borderRadius: "4px",
                  background: b.status === "Authorized" ? "#ecfdf5" : "#fffbeb",
                  color: b.status === "Authorized" ? "#059669" : "#d97706",
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
                      padding: "7px 16px",
                      background: "#0070ba",
                      color: "#ffffff",
                      borderRadius: "6px",
                      fontSize: "12.5px",
                      fontWeight: "600",
                      cursor: "pointer",
                      boxShadow: "0 1px 2px rgba(0, 112, 186, 0.2)",
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
        <div style={{
          background: "#ffffff",
          border: "2px solid #0070ba",
          borderRadius: "10px",
          padding: "24px",
          marginTop: "16px",
          boxShadow: "0 8px 24px rgba(0, 112, 186, 0.08)",
        }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", paddingBottom: "14px", borderBottom: "1px solid #e5e7eb" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Icons.PayPal />
              <div>
                <div style={{ fontSize: "16px", fontWeight: "700", color: "#003087" }}>
                  PayPal Checkout · Orders v2
                </div>
                <div style={{ fontSize: "11.5px", color: "#6b7280" }}>
                  Individual Bilateral Escrow Authorization
                </div>
              </div>
            </div>
            <div style={{ textAlign: "right", fontFamily: "monospace", fontSize: "12px", color: "#6b7280" }}>
              {orderState.mint_order_id}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "12px", color: "#6b7280", fontWeight: "600", marginBottom: "8px" }}>
              Select PayPal Commercial Service:
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
              {[
                { id: "paypal_wallet", label: "PayPal Wallet", note: "Instant Escrow Hold" },
                { id: "pay_later", label: "PayPal Net 30", note: "Commercial Financing" },
                { id: "debit_card", label: "Business Card", note: "Debit or Credit" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  style={{
                    padding: "10px",
                    borderRadius: "6px",
                    background: paymentMethod === m.id ? "#f0f7fd" : "#ffffff",
                    border: `1.5px solid ${paymentMethod === m.id ? "#0070ba" : "#e2e8f0"}`,
                    color: paymentMethod === m.id ? "#003087" : "#4b5563",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontSize: "12.5px", fontWeight: "600" }}>{m.label}</div>
                  <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px" }}>{m.note}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Line Item Invoice Breakdown */}
          <div style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "20px",
            fontSize: "13.5px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ color: "#4b5563" }}>Item: {selectedBuyer.description || "Industrial Centrifugal Pump 5HP"}</span>
              <span style={{ color: "#111827", fontWeight: "600" }}>{selectedBuyer.qty} units × $365.00</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", color: "#6b7280" }}>
              <span>Retail Baseline Price:</span>
              <span style={{ textDecoration: "line-through" }}>${(selectedBuyer.qty * 415).toLocaleString()} USD</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", color: "#059669", fontWeight: "500" }}>
              <span>MINT Volume Discount:</span>
              <span>-${(selectedBuyer.qty * (415 - 365)).toLocaleString()} USD</span>
            </div>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: "12px",
              borderTop: "1px solid #cbd5e1",
              fontSize: "16px",
              fontWeight: "700",
            }}>
              <span style={{ color: "#111827" }}>Total Escrow Commitment:</span>
              <span style={{ color: "#0070ba" }}>${orderState.amount?.toLocaleString()} USD</span>
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
                  fontWeight: "700",
                  textDecoration: "none",
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.08)",
                }}
              >
                <Icons.PayPal /> {paymentMethod === "pay_later" ? "Pay Later with PayPal" : "Pay with PayPal"}
              </a>
            ) : (
              <button
                disabled
                style={{
                  padding: "12px",
                  background: "#e2e8f0",
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
                background: "#2c2e2f",
                color: "#ffffff",
                borderRadius: "24px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Debit or Credit Card
            </button>
          </div>

          <div style={{ textAlign: "center", marginTop: "14px", fontSize: "11.5px", color: "#6b7280" }}>
            Secured by PayPal Sandbox Orders v2 · Funds captured only upon verified collective pool finalization
          </div>
        </div>
      )}
    </>
  );
}
