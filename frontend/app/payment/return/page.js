"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const glass = {
  background: "rgba(15, 23, 42, 0.4)",
  backdropFilter: "blur(20px) saturate(180%)",
  WebkitBackdropFilter: "blur(20px) saturate(180%)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.35)",
  borderRadius: "18px",
  padding: "32px",
  maxWidth: "540px",
  width: "100%",
};

function ReturnContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const mode = searchParams.get("mode");

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("No payment token received in URL parameters.");
      return;
    }

    // Auto-capture the order on the backend
    async function captureOrder() {
      try {
        const res = await fetch(`${API_BASE}/api/v1/payments/paypal/capture`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paypal_order_id: token }),
        });
        const data = await res.json();
        if (res.ok) {
          setResult(data);
        } else {
          setError(data.detail || "Capture failed");
        }
      } catch (err) {
        setError("Could not communicate with MINT API to finalize capture.");
      } finally {
        setLoading(false);
      }
    }

    captureOrder();
  }, [token]);

  return (
    <div style={glass}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
        <div style={{
          width: "40px",
          height: "40px",
          borderRadius: "12px",
          background: result ? "rgba(45, 212, 191, 0.2)" : error ? "rgba(248, 113, 113, 0.2)" : "rgba(251, 191, 36, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          color: result ? "#2dd4bf" : error ? "#f87171" : "#fbbf24",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}>
          {loading ? "…" : result ? "✓" : "!"}
        </div>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: "600", margin: 0, letterSpacing: "-0.01em" }}>
            {loading ? "Capturing Authorization…" : result ? "Order Authorized & Captured" : "Payment Verification Error"}
          </h1>
          <p style={{ color: "#94a3b8", margin: "4px 0 0", fontSize: "13px" }}>
            MINT Individual Buyer Escrow Protocol
          </p>
        </div>
      </div>

      {loading && (
        <div style={{ color: "#94a3b8", fontSize: "14px", margin: "24px 0" }}>
          Verifying cryptographic transaction state with PayPal Orders v2 API...
        </div>
      )}

      {error && (
        <div style={{
          background: "rgba(248, 113, 113, 0.1)",
          border: "1px solid rgba(248, 113, 113, 0.25)",
          borderRadius: "12px",
          padding: "16px",
          fontSize: "13.5px",
          color: "#fca5a5",
          marginBottom: "20px",
        }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ marginBottom: "24px" }}>
          <div style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.07)",
            borderRadius: "12px",
            padding: "18px",
            fontSize: "13px",
            display: "grid",
            gap: "10px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748b" }}>Order ID:</span>
              <span style={{ fontFamily: "monospace", color: "#f1f5f9" }}>{result.paypal_order_id}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748b" }}>Capture ID:</span>
              <span style={{ fontFamily: "monospace", color: "#2dd4bf" }}>{result.capture_id || "N/A"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748b" }}>Amount:</span>
              <span style={{ fontWeight: "600", color: "#f1f5f9" }}>${result.amount?.toLocaleString()} {result.currency || "USD"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748b" }}>Status:</span>
              <span style={{
                color: "#2dd4bf",
                background: "rgba(45, 212, 191, 0.12)",
                padding: "2px 8px",
                borderRadius: "999px",
                fontSize: "12px",
              }}>{result.status?.toUpperCase()}</span>
            </div>
          </div>
          <div style={{ fontSize: "12px", color: "#64748b", marginTop: "12px" }}>
            {result.note}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: "10px" }}>
        <Link href="/" style={{
          display: "inline-block",
          textAlign: "center",
          textDecoration: "none",
          padding: "10px 18px",
          background: "linear-gradient(180deg, rgba(45, 212, 191, 0.28) 0%, rgba(13, 148, 136, 0.45) 100%)",
          color: "#f0fdfa",
          border: "1px solid rgba(45, 212, 191, 0.4)",
          borderRadius: "10px",
          fontSize: "13.5px",
          fontWeight: "500",
        }}>
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default function PaymentReturnPage() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: "20px",
      background: `
        radial-gradient(ellipse at 15% 0%, rgba(45, 212, 191, 0.14) 0%, transparent 50%),
        linear-gradient(160deg, #020617 0%, #0c1222 50%, #0f172a 100%)
      `,
      color: "#f1f5f9",
      fontFamily: "'Inter', sans-serif",
    }}>
      <Suspense fallback={<div style={{ color: "#94a3b8" }}>Loading verification...</div>}>
        <ReturnContent />
      </Suspense>
    </div>
  );
}
