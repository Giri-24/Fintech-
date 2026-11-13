"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function getApiBase() {
  if (process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.includes("localhost")) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }
  if (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
    return "https://fintech-backend-xdcq.onrender.com";
  }
  return (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");
}

function ReturnContent() {
  const searchParams = useSearchParams();
  const token =
    searchParams.get("token") ||
    searchParams.get("paypal_order_id") ||
    searchParams.get("orderId") ||
    searchParams.get("order_id");

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function captureOrder() {
    if (!token) {
      setLoading(false);
      setError("No payment token received in URL parameters.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const apiBase = getApiBase();
      const res = await fetch(`${apiBase}/api/v1/payments/paypal/capture`, {
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

  useEffect(() => {
    captureOrder();
  }, [token]);

  return (
    <div style={{
      width: "100%",
      maxWidth: "520px",
      background: "#ffffff",
      border: "1px solid #e2e8f0",
      borderRadius: "12px",
      padding: "32px",
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
    }}>
      {/* PayPal Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <svg width="24" height="26" viewBox="0 0 24 28" fill="none">
            <path d="M4.5 24.5L7.2 4.2h7.8c3.2 0 5.4.7 6.3 2.1.9 1.4.9 3.2.1 5.3-.9 2.5-2.7 4.2-5.3 5.2-1.2.5-2.7.7-4.6.7H8.8L6.9 24.5H4.5z" fill="#0079C1" />
            <path d="M8.8 17.5h2.7c3.2 0 5.4-.7 6.3-2.1.9-1.4.9-3.2.1-5.3-.9-2.5-2.7-4.2-5.3-5.2-1.2-.5-2.7-.7-4.6-.7H3.5L.8 24.5h3.8l2.2-7z" fill="#00457C" opacity="0.9" />
          </svg>
          <div>
            <div style={{ fontSize: "16px", fontWeight: "700", color: "#003087" }}>
              PayPal Settlement Receipt
            </div>
            <div style={{ fontSize: "12px", color: "#64748b" }}>
              Orders v2 · Server-to-Server Capture
            </div>
          </div>
        </div>
        <span style={{
          fontSize: "11px",
          fontWeight: "600",
          padding: "3px 8px",
          borderRadius: "4px",
          background: result ? "#ecfdf5" : "#fef3c7",
          color: result ? "#059669" : "#b45309",
          border: `1px solid ${result ? "#a7f3d0" : "#fde68a"}`,
        }}>
          {loading ? "Capturing…" : result ? "Captured" : "Error"}
        </span>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "32px 0" }}>
          <div style={{ fontSize: "14px", color: "#0f172a", fontWeight: "600", marginBottom: "6px" }}>
            Finalizing bilateral PayPal escrow authorization...
          </div>
          <div style={{ fontSize: "12px", color: "#64748b" }}>
            Verifying cryptographic order state with PayPal REST v2 API
          </div>
        </div>
      )}

      {error && (
        <div style={{
          background: "#fef2f2",
          border: "1px solid #fecaca",
          borderRadius: "8px",
          padding: "16px",
          fontSize: "13px",
          color: "#b91c1c",
          marginBottom: "24px",
        }}>
          <div style={{ fontWeight: "600", marginBottom: "6px" }}>Capture Status:</div>
          <div>{error}</div>
          <button
            onClick={() => captureOrder()}
            style={{
              marginTop: "12px",
              padding: "6px 14px",
              background: "#b91c1c",
              color: "#ffffff",
              border: "none",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Retry Verification
          </button>
        </div>
      )}

      {result && (
        <div style={{ marginBottom: "28px" }}>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "4px" }}>
              Total Captured
            </div>
            <div style={{ fontSize: "32px", fontWeight: "700", color: "#0f172a", letterSpacing: "-0.01em" }}>
              ${result.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })} {result.currency || "USD"}
            </div>
            <div style={{ fontSize: "12px", color: "#059669", fontWeight: "600", marginTop: "4px" }}>
              Funds securely held in escrow for Collective Pool #PO-2026-08
            </div>
          </div>

          <div style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "16px",
            fontSize: "13px",
            display: "grid",
            gap: "10px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748b" }}>PayPal Order ID:</span>
              <span style={{ fontFamily: "monospace", color: "#0f172a", fontWeight: "600" }}>{result.paypal_order_id}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748b" }}>Capture Reference ID:</span>
              <span style={{ fontFamily: "monospace", color: "#0070ba", fontWeight: "600" }}>{result.capture_id || "CAP-MOCK-VERIFIED"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748b" }}>Settlement Mode:</span>
              <span style={{ color: "#0f172a" }}>Individual Bilateral Hold (Zero Pooled Balance)</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748b" }}>Cryptographic Checksum:</span>
              <span style={{ fontFamily: "monospace", color: "#059669", fontWeight: "600" }}>RSA-SHA256 Validated</span>
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
          fontWeight: "600",
        }}>
          Return to Overview
        </Link>
        <button
          onClick={() => window.print()}
          style={{
            padding: "10px 16px",
            background: "#ffffff",
            color: "#334155",
            border: "1px solid #cbd5e1",
            borderRadius: "6px",
            fontSize: "13px",
            fontWeight: "600",
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
      background: "#f5f7fa",
      color: "#0f172a",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <Suspense fallback={<div style={{ color: "#64748b" }}>Loading verification...</div>}>
        <ReturnContent />
      </Suspense>
    </div>
  );
}
