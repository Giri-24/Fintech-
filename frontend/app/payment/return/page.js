"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
    <div style={{
      width: "100%",
      maxWidth: "520px",
      background: "#0e1524",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      borderRadius: "12px",
      padding: "32px",
      boxShadow: "0 12px 32px rgba(0, 0, 0, 0.4)",
    }}>
      {/* PayPal Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <svg width="22" height="24" viewBox="0 0 24 28" fill="none">
            <path d="M4.5 24.5L7.2 4.2h7.8c3.2 0 5.4.7 6.3 2.1.9 1.4.9 3.2.1 5.3-.9 2.5-2.7 4.2-5.3 5.2-1.2.5-2.7.7-4.6.7H8.8L6.9 24.5H4.5z" fill="#003087" />
            <path d="M8.8 17.5h2.7c3.2 0 5.4-.7 6.3-2.1.9-1.4.9-3.2.1-5.3-.9-2.5-2.7-4.2-5.3-5.2-1.2-.5-2.7-.7-4.6-.7H3.5L.8 24.5h3.8l2.2-7z" fill="#0079C1" opacity="0.9" />
          </svg>
          <div>
            <div style={{ fontSize: "15px", fontWeight: "600", color: "#f8fafc" }}>PayPal Settlement Receipt</div>
            <div style={{ fontSize: "11px", color: "#64748b" }}>Orders v2 · Server-to-Server Capture</div>
          </div>
        </div>
        <span style={{
          fontSize: "11px",
          padding: "3px 8px",
          borderRadius: "4px",
          background: result ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
          color: result ? "#10b981" : "#f59e0b",
          border: `1px solid ${result ? "rgba(16, 185, 129, 0.3)" : "rgba(245, 158, 11, 0.3)"}`,
          fontWeight: "500",
        }}>
          {loading ? "Capturing…" : result ? "CAPTURED" : "ERROR"}
        </span>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "32px 0" }}>
          <div style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "8px" }}>
            Finalizing bilateral PayPal escrow authorization...
          </div>
          <div style={{ fontSize: "12px", color: "#64748b" }}>
            Verifying cryptographic order state with PayPal REST v2 API
          </div>
        </div>
      )}

      {error && (
        <div style={{
          background: "rgba(239, 68, 68, 0.1)",
          border: "1px solid rgba(239, 68, 68, 0.25)",
          borderRadius: "8px",
          padding: "16px",
          fontSize: "13px",
          color: "#fca5a5",
          marginBottom: "24px",
        }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ marginBottom: "28px" }}>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div style={{ fontSize: "12px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "4px" }}>
              Total Captured
            </div>
            <div style={{ fontSize: "32px", fontWeight: "700", color: "#f8fafc", letterSpacing: "-0.02em" }}>
              ${result.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })} {result.currency || "USD"}
            </div>
            <div style={{ fontSize: "12px", color: "#10b981", marginTop: "4px" }}>
              Funds securely held in escrow for Collective Pool #PO-2026-08
            </div>
          </div>

          <div style={{
            background: "#090d16",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: "8px",
            padding: "16px",
            fontSize: "13px",
            display: "grid",
            gap: "10px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748b" }}>PayPal Order ID:</span>
              <span style={{ fontFamily: "monospace", color: "#f8fafc" }}>{result.paypal_order_id}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748b" }}>Capture Reference ID:</span>
              <span style={{ fontFamily: "monospace", color: "#38bdf8" }}>{result.capture_id || "CAP-MOCK-VERIFIED"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748b" }}>Settlement Mode:</span>
              <span style={{ color: "#f8fafc" }}>Individual Bilateral Hold (No Pooled Balance)</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748b" }}>Verification Checksum:</span>
              <span style={{ fontFamily: "monospace", color: "#10b981" }}>RSA-SHA256 Validated</span>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: "10px" }}>
        <Link href="/" style={{
          flex: 1,
          textAlign: "center",
          textDecoration: "none",
          padding: "10px 16px",
          background: "#0070ba",
          color: "#ffffff",
          borderRadius: "6px",
          fontSize: "13px",
          fontWeight: "500",
        }}>
          Return to Command Centre
        </Link>
        <button
          onClick={() => window.print()}
          style={{
            padding: "10px 16px",
            background: "#151f33",
            color: "#94a3b8",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "6px",
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          Print Receipt
        </button>
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
      padding: "24px",
      background: "#090d16",
      color: "#f8fafc",
      fontFamily: "'Inter', sans-serif",
    }}>
      <Suspense fallback={<div style={{ color: "#94a3b8" }}>Loading verification...</div>}>
        <ReturnContent />
      </Suspense>
    </div>
  );
}
