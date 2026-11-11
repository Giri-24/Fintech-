"use client";

import { useState, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const views = [
  { key: "command", label: "Command Centre", icon: "◈" },
  { key: "predictive", label: "Predictive Buying", icon: "◎" },
  { key: "mesh", label: "Demand Mesh", icon: "⬡" },
  { key: "negotiation", label: "Negotiation", icon: "⇄" },
  { key: "approvals", label: "Approvals", icon: "✓" },
];

const glass = {
  background: "rgba(15, 23, 42, 0.28)",
  backdropFilter: "blur(20px) saturate(180%)",
  WebkitBackdropFilter: "blur(20px) saturate(180%)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
};

export default function Home() {
  const [active, setActive] = useState("command");
  const [token, setToken] = useState(null);
  const [orgName, setOrgName] = useState("");
  const [backendOnline, setBackendOnline] = useState(false);

  useEffect(() => {
    // Check backend health
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
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: `
        radial-gradient(ellipse at 15% 0%, rgba(45, 212, 191, 0.14) 0%, transparent 50%),
        radial-gradient(ellipse at 85% 90%, rgba(14, 165, 233, 0.1) 0%, transparent 50%),
        linear-gradient(160deg, #020617 0%, #0c1222 50%, #0f172a 100%)
      `,
      color: "#f1f5f9",
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      position: "relative",
    }}>
      <div style={{
        position: "fixed", top: "-15%", left: "8%", width: "480px", height: "480px",
        background: "radial-gradient(circle, rgba(45, 212, 191, 0.08) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "fixed", bottom: "-10%", right: "5%", width: "420px", height: "420px",
        background: "radial-gradient(circle, rgba(56, 189, 248, 0.07) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* Sidebar */}
      <aside style={{
        width: "240px",
        ...glass,
        background: "rgba(15, 23, 42, 0.22)",
        backdropFilter: "blur(28px) saturate(200%)",
        WebkitBackdropFilter: "blur(28px) saturate(200%)",
        borderRight: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: 0,
        boxShadow: "4px 0 32px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.07)",
        padding: "24px 16px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        zIndex: 1,
      }}>
        <div style={{ marginBottom: "28px", padding: "0 8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "34px", height: "34px", borderRadius: "10px",
              background: "linear-gradient(135deg, rgba(45, 212, 191, 0.9), rgba(13, 148, 136, 0.9))",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: "700", fontSize: "14px", color: "#020617",
              boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.3)",
            }}>M</div>
            <div>
              <div style={{ fontSize: "18px", fontWeight: "600", letterSpacing: "-0.02em" }}>MINT</div>
              <div style={{ fontSize: "11px", color: "#64748b", letterSpacing: "0.04em", textTransform: "uppercase" }}>Intelligence</div>
            </div>
          </div>
        </div>

        {/* Backend Connectivity Status */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 12px",
          borderRadius: "8px",
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          marginBottom: "20px",
          fontSize: "11.5px",
        }}>
          <span style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: backendOnline ? "#2dd4bf" : "#fbbf24",
            boxShadow: backendOnline ? "0 0 8px #2dd4bf" : "none",
          }} />
          <span style={{ color: "#94a3b8" }}>
            {backendOnline ? "API Live (8000)" : "Demo Mode"}
          </span>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
          {views.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                width: "100%",
                textAlign: "left",
                padding: "10px 12px",
                borderRadius: "10px",
                background: active === key
                  ? "rgba(45, 212, 191, 0.18)"
                  : "rgba(255, 255, 255, 0.04)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                color: active === key ? "#2dd4bf" : "#94a3b8",
                border: active === key
                  ? "1px solid rgba(45, 212, 191, 0.3)"
                  : "1px solid rgba(255, 255, 255, 0.05)",
                boxShadow: active === key
                  ? "inset 0 1px 0 rgba(255, 255, 255, 0.12)"
                  : "none",
                cursor: "pointer",
                fontSize: "13.5px",
                fontWeight: active === key ? "500" : "400",
                transition: "all 0.15s ease",
              }}
            >
              <span style={{ fontSize: "15px", opacity: 0.85 }}>{icon}</span>
              {label}
            </button>
          ))}
        </nav>

        <div style={{
          padding: "12px 10px",
          fontSize: "11px",
          color: "#64748b",
          background: "rgba(255, 255, 255, 0.03)",
          borderRadius: "8px",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          marginBottom: token ? "12px" : 0,
        }}>
          Demo · Water Pump Vertical
        </div>

        {token && (
          <button
            onClick={handleLogout}
            style={{
              ...btnGhost,
              width: "100%",
              marginTop: "8px",
              fontSize: "13px",
              color: "#f87171",
              borderColor: "rgba(248, 113, 113, 0.3)",
              background: "rgba(248, 113, 113, 0.08)",
            }}
          >
            Log out
          </button>
        )}
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: "40px 48px", overflow: "auto", maxWidth: "1100px", position: "relative", zIndex: 1 }}>
        {active === "command" && <CommandCentre />}
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

        <div style={{
          ...glass,
          marginTop: "48px",
          padding: "16px 20px",
          borderRadius: "14px",
          fontSize: "12px",
          color: "#64748b",
          lineHeight: "1.6",
        }}>
          Demo mode · Seeded industrial water-pump scenario. Supplier responses and forecasts are simulated and labelled. Individual buyer-controlled PayPal Sandbox payments only.
        </div>
      </main>
    </div>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <header style={{
      ...glass,
      marginBottom: "28px",
      padding: "18px 22px",
      borderRadius: "16px",
    }}>
      <h1 style={{ fontSize: "28px", fontWeight: "600", margin: "0 0 6px", letterSpacing: "-0.02em" }}>{title}</h1>
      <p style={{ color: "#94a3b8", margin: 0, fontSize: "14px" }}>{subtitle}</p>
    </header>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      ...glass,
      borderRadius: "18px",
      padding: "22px 26px",
      ...style,
    }}>
      {children}
    </div>
  );
}

function KPI({ label, value, sub, accent = false }) {
  return (
    <Card>
      <div style={{ fontSize: "12px", color: "#64748b", letterSpacing: "0.03em", textTransform: "uppercase", marginBottom: "8px" }}>{label}</div>
      <div style={{ fontSize: "32px", fontWeight: "600", color: accent ? "#2dd4bf" : "#f1f5f9", letterSpacing: "-0.02em", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: "12px", color: "#475569", marginTop: "6px" }}>{sub}</div>
    </Card>
  );
}

function CommandCentre() {
  const [data, setData] = useState({
    predicted_purchases: 3,
    active_pools: 1,
    estimated_savings: 2250,
    pending_approvals: 2,
    combined_qty: 50,
    price: "$365 / unit",
    status: "Awaiting approvals",
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
            status: "Awaiting approvals",
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <SectionHeader title="Command Centre" subtitle="Three businesses · Industrial Water Pumps · Active Demand Pool" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        <KPI label="Predicted Purchases" value={data.predicted_purchases} sub="Next 60 days" accent />
        <KPI label="Active Demand Pools" value={data.active_pools} sub={`${data.combined_qty} units combined`} />
        <KPI label="Estimated Savings" value={`$${data.estimated_savings.toLocaleString()}`} sub="vs individual pricing" accent />
        <KPI label="Pending Approvals" value={data.pending_approvals} sub="Awaiting buyer action" />
      </div>
      <Card>
        <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "10px", letterSpacing: "0.03em", textTransform: "uppercase" }}>Upcoming Collective Opportunity</div>
        <div style={{ fontSize: "18px", fontWeight: "500", marginBottom: "16px" }}>Industrial Centrifugal Water Pump 5HP</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", fontSize: "14px" }}>
          <div>
            <div style={{ color: "#64748b", fontSize: "12px", marginBottom: "4px" }}>Combined Quantity</div>
            <div style={{ fontWeight: "500" }}>{data.combined_qty} units</div>
          </div>
          <div>
            <div style={{ color: "#64748b", fontSize: "12px", marginBottom: "4px" }}>Negotiated Price</div>
            <div style={{ fontWeight: "500", color: "#2dd4bf" }}>{data.price}</div>
          </div>
          <div>
            <div style={{ color: "#64748b", fontSize: "12px", marginBottom: "4px" }}>Status</div>
            <div style={{ fontWeight: "500", color: "#fbbf24" }}>{data.status}</div>
          </div>
        </div>
      </Card>
    </>
  );
}

function PredictiveBuying() {
  const [predictions, setPredictions] = useState([
    { id: 1, product: "Industrial Centrifugal Water Pump 5HP", qty: 12, date: "2026-12-15", confidence: "High", reason: "Recurring every 5–6 months from history", status: "Open" },
    { id: 2, product: "Industrial Centrifugal Water Pump 5HP", qty: 15, date: "2026-12-20", confidence: "Medium", reason: "Seasonal pattern + growth trend", status: "Open" },
    { id: 3, product: "Industrial Centrifugal Water Pump 5HP", qty: 23, date: "2026-12-10", confidence: "High", reason: "Consistent annual municipal cycle", status: "Open" },
  ]);

  useEffect(() => {
    fetch(`${API_BASE}/api/v1/demo/predictions`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.predictions) {
          setPredictions(data.predictions.map((p, idx) => ({
            id: idx + 1,
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
        item.id === id ? { ...item, status: action === "join" ? "Joined Pool ✓" : "Dismissed" } : item
      )
    );
  }

  return (
    <>
      <SectionHeader title="Predictive Buying" subtitle="Forecasts based on historical purchase data. Facts separated from estimates." />
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {predictions.map((p) => (
          <Card key={p.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <div style={{ fontWeight: "500" }}>{p.product}</div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                {p.status !== "Open" && (
                  <span style={{
                    fontSize: "11px",
                    padding: "3px 8px",
                    borderRadius: "999px",
                    background: p.status.includes("Joined") ? "rgba(45, 212, 191, 0.2)" : "rgba(248, 113, 113, 0.2)",
                    color: p.status.includes("Joined") ? "#2dd4bf" : "#f87171",
                    fontWeight: "500",
                  }}>{p.status}</span>
                )}
                <span style={{
                  fontSize: "11px",
                  padding: "3px 8px",
                  borderRadius: "999px",
                  background: p.confidence === "High" ? "rgba(45, 212, 191, 0.15)" : "rgba(251, 191, 36, 0.15)",
                  color: p.confidence === "High" ? "#2dd4bf" : "#fbbf24",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  fontWeight: "500",
                }}>{p.confidence}</span>
              </div>
            </div>
            <div style={{ fontSize: "14px", marginBottom: "4px" }}>{p.qty} units · {p.date}</div>
            <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>{p.reason}</div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                style={{
                  ...btnPrimary,
                  opacity: p.status === "Open" ? 1 : 0.5,
                  cursor: p.status === "Open" ? "pointer" : "default",
                }}
                disabled={p.status !== "Open"}
                onClick={() => handleAction(p.id, "join")}
              >
                {p.status === "Joined Pool ✓" ? "Joined" : "Accept & Join Pool"}
              </button>
              <button
                style={{
                  ...btnGhost,
                  opacity: p.status === "Open" ? 1 : 0.5,
                }}
                disabled={p.status !== "Open"}
                onClick={() => handleAction(p.id, "dismiss")}
              >
                Dismiss
              </button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

function DemandMesh() {
  const members = [
    { name: "AquaFlow Industries", qty: 12 },
    { name: "GreenPump Solutions", qty: 15 },
    { name: "HydroTech Systems", qty: 23 },
  ];
  return (
    <>
      <SectionHeader title="Demand Mesh" subtitle="Compatible buyers matched on product specifications, not just names." />
      <Card>
        <div style={{ fontSize: "16px", fontWeight: "500", marginBottom: "20px" }}>Industrial Centrifugal Water Pump 5HP</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "20px" }}>
          {members.map((m) => (
            <div key={m.name} style={{
              ...glass,
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "14px",
              padding: "16px",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "6px" }}>{m.name}</div>
              <div style={{ fontSize: "24px", fontWeight: "600", color: "#2dd4bf" }}>{m.qty}</div>
              <div style={{ fontSize: "11px", color: "#475569" }}>units</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "16px", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
          <div>
            <div style={{ fontWeight: "500" }}>50 units combined</div>
            <div style={{ fontSize: "13px", color: "#64748b" }}>Estimated savings $2,250</div>
          </div>
          <div style={{ fontSize: "12px", color: "#475569", textAlign: "right" }}>
            Specs matched<br />Flow 50 m³/h · Head 30 m · IP55
          </div>
        </div>
      </Card>
    </>
  );
}

function NegotiationRoom() {
  const [messages, setMessages] = useState([
    { from: "AI Agent", text: "Requested 12% volume discount on 50-unit commitment.", type: "agent" },
    { from: "Supplier (simulated)", text: "Counter-offered $365 with 30-day validity.", type: "simulated" },
    { from: "Recommendation", text: "Accept $365. Clear savings vs historical individual pricing.", type: "recommendation" },
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
      <SectionHeader title="Negotiation Room" subtitle="Simulated negotiation based on aggregated volume." />
      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px", marginBottom: "24px" }}>
          <div>
            <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "6px" }}>Original Average</div>
            <div style={{ fontSize: "28px", fontWeight: "600" }}>$415</div>
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "6px" }}>Negotiated Offer</div>
            <div style={{ fontSize: "28px", fontWeight: "600", color: "#2dd4bf" }}>$365</div>
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "6px" }}>Target</div>
            <div style={{ fontSize: "28px", fontWeight: "600" }}>$350</div>
          </div>
        </div>
        <div style={{ borderLeft: "2px solid #2dd4bf", paddingLeft: "16px", fontSize: "14px", lineHeight: "1.7" }}>
          {messages.map((m, idx) => {
            const isAgent = m.type === "agent" || m.from?.includes("AI Agent");
            const isRec = m.type === "recommendation" || m.from?.includes("Recommendation");
            const color = isAgent ? "#2dd4bf" : isRec ? "#fbbf24" : "#94a3b8";
            return (
              <div key={idx} style={{ marginTop: idx > 0 ? "8px" : 0 }}>
                <span style={{ color, fontWeight: "500" }}>{m.from}</span> · {m.text}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: "16px", fontSize: "12px", color: "#fbbf24" }}>Simulated supplier responses — not live communications.</div>
      </Card>
    </>
  );
}

function Approvals({ token, setToken, orgName, setOrgName, onLogout }) {
  const [loginEmail, setLoginEmail] = useState("");
  const [paymentResult, setPaymentResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const demoAccounts = [
    { email: "aquaflow@example.com", name: "AquaFlow Industries" },
    { email: "greenpump@example.com", name: "GreenPump Solutions" },
    { email: "hydrotech@example.com", name: "HydroTech Systems" },
  ];

  const buyers = [
    { id: 1, name: "AquaFlow Industries", qty: 12, amount: 4380, status: "Pending" },
    { id: 2, name: "GreenPump Solutions", qty: 15, amount: 5475, status: "Pending" },
    { id: 3, name: "HydroTech Systems", qty: 23, amount: 8395, status: "Approved" },
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
      } else {
        alert(data.detail || "Login failed");
      }
    } catch (err) {
      alert("Backend not reachable. Start the FastAPI server on port 8000.");
    }
    setLoading(false);
  }

  async function createOrder(buyer) {
    setLoading(true);
    setPaymentResult(null);
    try {
      const res = await fetch(`${API_BASE}/api/v1/payments/paypal/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organization_id: buyer.id,
          pool_id: 1,
          amount: buyer.amount,
          buyer_name: buyer.name,
        }),
      });
      const data = await res.json();
      setPaymentResult(data);
    } catch (err) {
      setPaymentResult({ error: "Could not reach backend at " + API_BASE });
    }
    setLoading(false);
  }

  return (
    <>
      <SectionHeader title="Approvals & Payment" subtitle="Each buyer independently authorizes their own quantity and amount." />

      {!token ? (
        <Card style={{ maxWidth: "420px", marginBottom: "24px" }}>
          <div style={{ fontSize: "14px", fontWeight: "500", marginBottom: "14px" }}>Demo Login</div>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="aquaflow@example.com"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(8px)",
                color: "#f1f5f9",
                fontSize: "14px",
                marginBottom: "10px",
                outline: "none",
                boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.2)",
              }}
            />
            <button type="submit" disabled={loading} style={btnPrimary}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          {/* Quick Account Switcher */}
          <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
            <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "8px" }}>Quick demo sign-in:</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {demoAccounts.map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => {
                    setLoginEmail(acc.email);
                    handleLogin(null, acc.email);
                  }}
                  style={{
                    ...btnGhost,
                    fontSize: "11px",
                    padding: "4px 8px",
                  }}
                >
                  {acc.name.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
          <div style={{ fontSize: "12px", color: "#475569", marginTop: "10px" }}>
            Password is <code style={{ color: "#94a3b8" }}>demo</code>
          </div>
        </Card>
      ) : (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <div style={{ fontSize: "14px", color: "#2dd4bf" }}>Signed in as {orgName}</div>
          <button onClick={onLogout} style={{ ...btnGhost, fontSize: "13px", color: "#f87171", borderColor: "rgba(248, 113, 113, 0.3)" }}>
            Log out
          </button>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {buyers.map((b) => (
          <Card key={b.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px" }}>
            <div>
              <div style={{ fontWeight: "500" }}>{b.name}</div>
              <div style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>
                {b.qty} units × $365 = ${b.amount.toLocaleString()}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{
                fontSize: "12px",
                padding: "4px 10px",
                borderRadius: "999px",
                background: b.status === "Approved" ? "rgba(45, 212, 191, 0.12)" : "rgba(251, 191, 36, 0.12)",
                color: b.status === "Approved" ? "#2dd4bf" : "#fbbf24",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}>{b.status}</span>
              {b.status === "Pending" && token && (
                <button style={btnPrimary} onClick={() => createOrder(b)} disabled={loading}>
                  Create Order
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {paymentResult && (
        <Card style={{ marginTop: "20px", borderColor: "rgba(45, 212, 191, 0.35)" }}>
          <div style={{ fontWeight: "500", marginBottom: "8px" }}>Order Result</div>
          {paymentResult.approval_url && (
            <a href={paymentResult.approval_url} target="_blank" rel="noopener noreferrer" style={{ color: "#2dd4bf", fontSize: "14px" }}>
              Open PayPal Checkout →
            </a>
          )}
          <pre style={{
            whiteSpace: "pre-wrap",
            margin: "12px 0 0",
            color: "#94a3b8",
            fontSize: "12px",
            background: "rgba(255, 255, 255, 0.04)",
            backdropFilter: "blur(8px)",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}>
            {JSON.stringify(paymentResult, null, 2)}
          </pre>
        </Card>
      )}

      <div style={{ marginTop: "16px", fontSize: "12px", color: "#475569" }}>
        Individual PayPal Sandbox Orders v2 · Server-side creation · No pooled funds
      </div>
    </>
  );
}

const btnPrimary = {
  padding: "9px 16px",
  background: "linear-gradient(180deg, rgba(45, 212, 191, 0.28) 0%, rgba(13, 148, 136, 0.45) 100%)",
  backdropFilter: "blur(12px) saturate(150%)",
  WebkitBackdropFilter: "blur(12px) saturate(150%)",
  color: "#f0fdfa",
  border: "1px solid rgba(45, 212, 191, 0.4)",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "500",
  boxShadow: "0 4px 16px rgba(13, 148, 136, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
};

const btnGhost = {
  padding: "9px 16px",
  background: "rgba(255, 255, 255, 0.06)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  color: "#cbd5e1",
  border: "1px solid rgba(255, 255, 255, 0.12)",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "13px",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.08)",
};
