"use client";

import { useState, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// --- Icons (16x16, 1.5 stroke, text-role colored) ---
const Icons = {
  Command: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  Predictive: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="m7 15 4-4 4 4 6-7" />
    </svg>
  ),
  Mesh: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  Negotiation: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="m16 3 4 4-4 4" />
      <path d="M20 7H4" />
      <path d="m8 21-4-4 4-4" />
      <path d="M4 17h16" />
    </svg>
  ),
  Approvals: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  ),
  PayPal: () => (
    <svg width="18" height="20" viewBox="0 0 24 28" fill="none">
      <path d="M4.5 24.5L7.2 4.2h7.8c3.2 0 5.4.7 6.3 2.1.9 1.4.9 3.2.1 5.3-.9 2.5-2.7 4.2-5.3 5.2-1.2.5-2.7.7-4.6.7H8.8L6.9 24.5H4.5z" fill="#003087" />
      <path d="M8.8 17.5h2.7c3.2 0 5.4-.7 6.3-2.1.9-1.4.9-3.2.1-5.3-.9-2.5-2.7-4.2-5.3-5.2-1.2-.5-2.7-.7-4.6-.7H3.5L.8 24.5h3.8l2.2-7z" fill="#0079C1" opacity="0.9" />
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Lock: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  Shield: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
};

const navItems = [
  { key: "command", label: "Command Centre", icon: Icons.Command },
  { key: "predictive", label: "Predictive Buying", icon: Icons.Predictive },
  { key: "mesh", label: "Demand Mesh", icon: Icons.Mesh },
  { key: "negotiation", label: "Negotiation", icon: Icons.Negotiation },
  { key: "approvals", label: "Approvals & Settlement", icon: Icons.Approvals },
];

export default function Home() {
  const [active, setActive] = useState("command");
  const [token, setToken] = useState(null);
  const [orgName, setOrgName] = useState("");
  const [backendOnline, setBackendOnline] = useState(false);

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

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#090d16", color: "#f8fafc" }}>
      {/* Sidebar */}
      <aside style={{
        width: "256px",
        background: "#060910",
        borderRight: "1px solid rgba(255, 255, 255, 0.08)",
        padding: "24px 16px",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px", padding: "0 6px" }}>
          <div style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            background: "#151f33",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            fontWeight: "600",
            color: "#f8fafc",
          }}>
            M
          </div>
          <div>
            <div style={{ fontSize: "15px", fontWeight: "600", letterSpacing: "-0.01em" }}>MINT</div>
            <div style={{ fontSize: "12px", color: "#64748b" }}>Industrial Procurement</div>
          </div>
        </div>

        {/* Connectivity Status */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 12px",
          borderRadius: "6px",
          background: "#0c111c",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          marginBottom: "24px",
          fontSize: "12px",
        }}>
          <span style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: backendOnline ? "#10b981" : "#f59e0b",
          }} />
          <span style={{ color: "#94a3b8" }}>
            {backendOnline ? "API connected" : "Mock demo mode"}
          </span>
        </div>

        {/* Navigation */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
          <div style={{ fontSize: "11px", color: "#475569", padding: "4px 8px", letterSpacing: "0.02em" }}>
            Navigation
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
                  padding: "8px 12px",
                  borderRadius: "6px",
                  background: isActive ? "#151f33" : "transparent",
                  color: isActive ? "#f8fafc" : "#94a3b8",
                  border: isActive ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid transparent",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: isActive ? "500" : "400",
                  transition: "background 0.12s ease, color 0.12s ease",
                }}
              >
                <span style={{ color: isActive ? "#38bdf8" : "#64748b", display: "flex", alignItems: "center" }}>
                  <IconComponent />
                </span>
                {label}
              </button>
            );
          })}
        </nav>

        {/* User / Org Session info in sidebar */}
        <div style={{
          padding: "12px",
          borderRadius: "6px",
          background: "#0e1524",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          fontSize: "12px",
        }}>
          {token ? (
            <div>
              <div style={{ color: "#64748b", fontSize: "11px" }}>Organization</div>
              <div style={{ color: "#f8fafc", fontWeight: "500", marginTop: "2px" }}>{orgName}</div>
              <button
                onClick={handleLogout}
                style={{
                  marginTop: "8px",
                  fontSize: "11.5px",
                  color: "#ef4444",
                  background: "transparent",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Sign out
              </button>
            </div>
          ) : (
            <div style={{ color: "#64748b" }}>
              Demo scenario · Water pumps
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "36px 44px", overflowY: "auto", maxWidth: "1120px" }}>
        {active === "command" && <CommandCentre onNavigate={setActive} />}
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
          />
        )}

        {/* Regulatory footer */}
        <footer style={{
          marginTop: "48px",
          padding: "16px 20px",
          borderRadius: "8px",
          background: "#0e1524",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          fontSize: "12px",
          color: "#64748b",
          lineHeight: "1.6",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}>
          <span style={{ color: "#0070ba", display: "flex", alignItems: "center" }}><Icons.Shield /></span>
          <div>
            Regulatory Architecture: MINT operates as an automated procurement coordinator. Individual buyers authorize independent server-to-server holds via PayPal Orders v2 with cryptographic webhook signatures. No commingled balances or custodial holding.
          </div>
        </footer>
      </main>
    </div>
  );
}

// --- Standard UI Components ---

function PageHeader({ title, description }) {
  return (
    <div style={{ marginBottom: "28px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "600", letterSpacing: "-0.02em", margin: "0 0 4px" }}>
        {title}
      </h1>
      <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>
        {description}
      </p>
    </div>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "#0e1524",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      borderRadius: "10px",
      padding: "20px 24px",
      ...style,
    }}>
      {children}
    </div>
  );
}

function Stat({ label, value, sub, delta }) {
  return (
    <div style={{
      background: "#0e1524",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      borderRadius: "10px",
      padding: "18px 20px",
    }}>
      <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "8px" }}>{label}</div>
      <div style={{ fontSize: "26px", fontWeight: "600", color: "#f8fafc", letterSpacing: "-0.02em" }} className="tabular-nums">
        {value}
      </div>
      <div style={{ fontSize: "12px", color: delta ? "#10b981" : "#64748b", marginTop: "4px" }}>
        {sub}
      </div>
    </div>
  );
}

// --- View 1: Command Centre ---

function CommandCentre({ onNavigate }) {
  const [data, setData] = useState({
    predicted_purchases: 3,
    active_pools: 1,
    estimated_savings: 2250,
    pending_approvals: 2,
    combined_qty: 50,
    price: "$365 / unit",
    status: "Awaiting buyer authorizations",
  });

  useEffect(() => {
    fetch(`${API_BASE}/api/v1/demo/command-centre`)
      .then((res) => res.json())
      .then((res) => {
        if (res && res.pool) {
          setData({
            predicted_purchases: res.predicted_purchases,
            active_pools: res.active_pools,
            estimated_savings: res.estimated_savings,
            pending_approvals: res.pending_approvals,
            combined_qty: res.pool.pool_metrics?.combined_quantity || 50,
            price: `$${res.pool.pool_metrics?.negotiated_unit_price || 365} / unit`,
            status: "Awaiting buyer authorizations",
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <PageHeader
        title="Command Centre"
        description="Active demand aggregation across 3 regional municipal and agricultural contractors."
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
        <Stat label="Predicted Purchases" value={data.predicted_purchases} sub="Next 60 days" />
        <Stat label="Active Demand Pools" value={data.active_pools} sub={`${data.combined_qty} total units`} />
        <Stat label="Direct Savings" value={`$${data.estimated_savings.toLocaleString()}`} sub="vs $415 retail baseline" delta />
        <Stat label="Pending Approvals" value={data.pending_approvals} sub="Awaiting buyer action" />
      </div>

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
          <div>
            <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "4px" }}>
              Active Specification Pool #PO-2026-08
            </div>
            <div style={{ fontSize: "17px", fontWeight: "600" }}>Industrial Centrifugal Water Pump 5HP</div>
            <div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "2px" }}>
              Specifications: Flow 50 m³/h · Head 30 m · IP55 Weatherproof · 3-Phase 400V
            </div>
          </div>
          <span style={{
            fontSize: "12px",
            padding: "4px 10px",
            borderRadius: "6px",
            background: "#151f33",
            color: "#38bdf8",
            border: "1px solid rgba(56, 189, 248, 0.2)",
          }}>
            {data.status}
          </span>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
          padding: "16px",
          background: "#090d16",
          borderRadius: "8px",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          marginBottom: "18px",
        }}>
          <div>
            <div style={{ color: "#64748b", fontSize: "12px" }}>Aggregated Volume</div>
            <div style={{ fontSize: "18px", fontWeight: "600", marginTop: "4px" }}>{data.combined_qty} units</div>
          </div>
          <div>
            <div style={{ color: "#64748b", fontSize: "12px" }}>Negotiated Unit Price</div>
            <div style={{ fontSize: "18px", fontWeight: "600", color: "#10b981", marginTop: "4px" }}>{data.price}</div>
          </div>
          <div>
            <div style={{ color: "#64748b", fontSize: "12px" }}>Direct Collective Savings</div>
            <div style={{ fontSize: "18px", fontWeight: "600", color: "#10b981", marginTop: "4px" }}>$2,250 USD</div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={() => onNavigate("approvals")}
            style={{
              padding: "8px 16px",
              background: "#0070ba",
              color: "#ffffff",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            Review Approvals & Settlement →
          </button>
        </div>
      </Card>
    </>
  );
}

// --- View 2: Predictive Buying ---

function PredictiveBuying() {
  const [predictions, setPredictions] = useState([
    { id: 1, buyer: "AquaFlow Industries", product: "Industrial Centrifugal Water Pump 5HP", qty: 12, date: "2026-12-15", confidence: "High", reason: "Recurring 5–6 month municipal cycle detected from invoices", status: "Open" },
    { id: 2, buyer: "GreenPump Solutions", product: "Industrial Centrifugal Water Pump 5HP", qty: 15, date: "2026-12-20", confidence: "Medium", reason: "Seasonal agricultural flush + growth trend extrapolation", status: "Open" },
    { id: 3, buyer: "HydroTech Systems", product: "Industrial Centrifugal Water Pump 5HP", qty: 23, date: "2026-12-10", confidence: "High", reason: "Annual Q4 civil infrastructure procurement schedule", status: "Open" },
  ]);

  useEffect(() => {
    fetch(`${API_BASE}/api/v1/demo/predictions`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.predictions) {
          setPredictions(data.predictions.map((p, idx) => ({
            id: idx + 1,
            buyer: p.buyer || `Buyer ${idx + 1}`,
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
        description="Historical invoice pattern forecasts. Real verified transactions separated from statistical predictions."
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {predictions.map((p) => (
          <Card key={p.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <div>
                <div style={{ fontSize: "15px", fontWeight: "500" }}>{p.product}</div>
                <div style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>
                  Forecast for <strong style={{ color: "#94a3b8" }}>{p.buyer}</strong> · Delivery window: {p.date}
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span style={{
                  fontSize: "11px",
                  padding: "3px 8px",
                  borderRadius: "4px",
                  background: p.confidence === "High" ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
                  color: p.confidence === "High" ? "#10b981" : "#f59e0b",
                  border: `1px solid ${p.confidence === "High" ? "rgba(16, 185, 129, 0.3)" : "rgba(245, 158, 11, 0.3)"}`,
                }}>
                  {p.confidence} confidence
                </span>
                {p.status !== "Open" && (
                  <span style={{
                    fontSize: "11px",
                    padding: "3px 8px",
                    borderRadius: "4px",
                    background: p.status === "Joined Pool" ? "rgba(56, 189, 248, 0.15)" : "rgba(239, 68, 68, 0.15)",
                    color: p.status === "Joined Pool" ? "#38bdf8" : "#ef4444",
                  }}>
                    {p.status}
                  </span>
                )}
              </div>
            </div>

            <div style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "16px", lineHeight: "1.5" }}>
              {p.reason}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
              <div style={{ fontSize: "13px" }}>
                Predicted requirement: <strong style={{ color: "#f8fafc" }}>{p.qty} units</strong>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  disabled={p.status !== "Open"}
                  onClick={() => handleAction(p.id, "dismiss")}
                  style={{
                    padding: "6px 12px",
                    background: "#151f33",
                    color: "#94a3b8",
                    borderRadius: "6px",
                    fontSize: "12px",
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
                    fontSize: "12px",
                    fontWeight: "500",
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

// --- View 3: Demand Mesh ---

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
        description="Clustered SME requirements matched strictly on physical engineering tolerances."
      />

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <div style={{ fontSize: "16px", fontWeight: "600" }}>Specification Match: Centrifugal 5HP</div>
            <div style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>Cluster ID: #MESH-5HP-IP55</div>
          </div>
          <span style={{ fontSize: "12px", color: "#10b981", background: "rgba(16, 185, 129, 0.12)", padding: "4px 10px", borderRadius: "6px" }}>
            100% Specification Compatibility
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "20px" }}>
          {members.map((m) => (
            <div key={m.name} style={{
              background: "#090d16",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: "8px",
              padding: "16px",
            }}>
              <div style={{ fontSize: "11px", color: "#64748b" }}>{m.sector}</div>
              <div style={{ fontSize: "14px", fontWeight: "500", color: "#f8fafc", margin: "4px 0 12px" }}>{m.name}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: "22px", fontWeight: "600", color: "#38bdf8" }}>{m.qty} <span style={{ fontSize: "12px", color: "#64748b" }}>units</span></span>
                <span style={{ fontSize: "12px", color: "#64748b" }}>{m.share}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "16px",
          borderTop: "1px solid rgba(255, 255, 255, 0.06)",
          fontSize: "13px",
        }}>
          <div>
            <strong>50 units combined</strong> · Unlocks Tier-1 Supplier Price Tier ($365/unit)
          </div>
          <div style={{ color: "#94a3b8", fontFamily: "monospace", fontSize: "12px" }}>
            Flow 50 m³/h · Head 30m · IP55 · 400V
          </div>
        </div>
      </Card>
    </>
  );
}

// --- View 4: Negotiation Room ---

function NegotiationRoom() {
  const [messages, setMessages] = useState([
    { from: "AI Coordinator", text: "Opened collective RFP for 50-unit bulk commitment across 3 verified organizations. Requested tier-1 rate: $350/unit.", type: "agent" },
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
        description="Autonomous volume negotiation transcript and supplier counter-offers."
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "20px" }}>
        <Stat label="Retail Baseline" value="$415" sub="Standard single-buyer pricing" />
        <Stat label="Negotiated Offer" value="$365" sub="Locked for 50 units" delta />
        <Stat label="Target Price" value="$350" sub="Initial aggressive RFP tier" />
      </div>

      <Card>
        <div style={{ fontSize: "14px", fontWeight: "600", marginBottom: "16px" }}>Negotiation Transcript</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {messages.map((m, idx) => {
            const isAgent = m.type === "agent" || m.from?.includes("AI");
            const isRec = m.type === "recommendation" || m.from?.includes("Recommendation");
            const badgeColor = isAgent ? "#38bdf8" : isRec ? "#10b981" : "#f59e0b";
            return (
              <div key={idx} style={{
                background: "#090d16",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                borderRadius: "8px",
                padding: "14px 16px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: badgeColor }}>{m.from}</span>
                </div>
                <div style={{ fontSize: "13.5px", color: "#f8fafc", lineHeight: "1.5" }}>
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

// --- View 5: Approvals & Authentic PayPal Orders v2 Settlement Interface ---

function Approvals({ token, setToken, orgName, setOrgName, onLogout }) {
  const [loginEmail, setLoginEmail] = useState("");
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [orderState, setOrderState] = useState(null);
  const [loading, setLoading] = useState(false);

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
          description: `MINT Industrial Collective Purchase - ${buyer.qty}x Centrifugal Pump 5HP`,
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
        title="Approvals & Settlement"
        description="Independent buyer authorization. Zero commingled funds — each enterprise authorizes directly with PayPal."
      />

      {/* Account Verification */}
      {!token ? (
        <Card style={{ maxWidth: "480px", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <span style={{ color: "#0070ba" }}><Icons.Lock /></span>
            <span style={{ fontSize: "14px", fontWeight: "600" }}>Enterprise Buyer Sign In</span>
          </div>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="enterprise@domain.com"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "6px",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                background: "#090d16",
                color: "#f8fafc",
                fontSize: "13px",
                marginBottom: "12px",
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "9px 16px",
                background: "#0070ba",
                color: "#ffffff",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              {loading ? "Authenticating…" : "Sign In to Authorize"}
            </button>
          </form>

          <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
            <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "8px" }}>
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
                    background: "#151f33",
                    color: "#94a3b8",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "4px",
                    fontSize: "11px",
                    cursor: "pointer",
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
          background: "#0e1524",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "8px",
          marginBottom: "24px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: "#10b981" }}><Icons.Check /></span>
            <span style={{ fontSize: "13px" }}>
              Authenticated Organization: <strong style={{ color: "#f8fafc" }}>{orgName}</strong>
            </span>
          </div>
          <button
            onClick={onLogout}
            style={{
              fontSize: "12px",
              color: "#ef4444",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            Switch Account
          </button>
        </div>
      )}

      {/* Buyer Order Commitment Table */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>
          Pool Participants & Order Statuses
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {buyers.map((b) => (
            <div key={b.name} style={{
              background: "#0e1524",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "8px",
              padding: "14px 18px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "500" }}>{b.name}</div>
                <div style={{ fontSize: "12.5px", color: "#64748b", marginTop: "2px" }}>
                  {b.qty} units × $365.00 = <strong style={{ color: "#f8fafc" }}>${b.amount.toLocaleString()} USD</strong>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{
                  fontSize: "12px",
                  padding: "4px 10px",
                  borderRadius: "4px",
                  background: b.status === "Authorized" ? "rgba(16, 185, 129, 0.12)" : "rgba(245, 158, 11, 0.12)",
                  color: b.status === "Authorized" ? "#10b981" : "#f59e0b",
                  border: `1px solid ${b.status === "Authorized" ? "rgba(16, 185, 129, 0.25)" : "rgba(245, 158, 11, 0.25)"}`,
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
                      fontWeight: "500",
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

      {/* --- REAL PAYPAL CHECKOUT INTERFACE --- */}
      {selectedBuyer && orderState && (
        <div style={{
          background: "#0e1524",
          border: "1px solid #0070ba",
          borderRadius: "10px",
          padding: "24px",
          marginTop: "16px",
        }}>
          {/* PayPal Top Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Icons.PayPal />
              <div>
                <div style={{ fontSize: "15px", fontWeight: "600", color: "#f8fafc" }}>PayPal Checkout · Orders v2</div>
                <div style={{ fontSize: "11px", color: "#64748b" }}>Individual Buyer Escrow Hold</div>
              </div>
            </div>
            <div style={{ textAlign: "right", fontFamily: "monospace", fontSize: "12px", color: "#94a3b8" }}>
              {orderState.mint_order_id}
            </div>
          </div>

          {/* Invoice Breakdown */}
          <div style={{
            background: "#090d16",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "20px",
            fontSize: "13px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ color: "#94a3b8" }}>Item: Industrial Centrifugal Pump 5HP</span>
              <span style={{ color: "#f8fafc" }}>{selectedBuyer.qty} units × $365.00</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", color: "#64748b" }}>
              <span>Retail Baseline:</span>
              <span style={{ textDecoration: "line-through" }}>${(selectedBuyer.qty * 415).toLocaleString()} USD</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", color: "#10b981" }}>
              <span>MINT Negotiation Discount:</span>
              <span>-${(selectedBuyer.qty * (415 - 365)).toLocaleString()} USD</span>
            </div>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: "10px",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              fontSize: "15px",
              fontWeight: "600",
            }}>
              <span>Total Authorization Amount:</span>
              <span style={{ color: "#38bdf8" }}>${orderState.amount?.toLocaleString()} USD</span>
            </div>
          </div>

          {/* PayPal Action Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "420px", margin: "0 auto" }}>
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
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "600",
                  textDecoration: "none",
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                }}
              >
                <Icons.PayPal /> Pay with PayPal
              </a>
            ) : (
              <button
                disabled
                style={{
                  padding: "12px",
                  background: "#151f33",
                  color: "#64748b",
                  borderRadius: "6px",
                  fontSize: "13px",
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
                borderRadius: "6px",
                fontSize: "13.5px",
                fontWeight: "500",
                cursor: "pointer",
                border: "1px solid rgba(255, 255, 255, 0.12)",
              }}
            >
              Debit or Credit Card
            </button>
          </div>

          <div style={{ textAlign: "center", marginTop: "14px", fontSize: "11px", color: "#64748b" }}>
            Secured by PayPal Sandbox Orders v2 · Funds captured only upon verified collective pool finalization
          </div>
        </div>
      )}
    </>
  );
}
