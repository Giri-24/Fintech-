"use client";

import Link from "next/link";

export default function PaymentCancelPage() {
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
      <div style={{
        width: "100%",
        maxWidth: "480px",
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "32px",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "8px",
            background: "#fef3c7",
            color: "#b45309",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
            fontWeight: "700",
            border: "1px solid #fde68a",
          }}>
            !
          </div>
          <div>
            <h1 style={{ fontSize: "18px", fontWeight: "700", margin: 0, color: "#0f172a" }}>
              Payment Authorization Cancelled
            </h1>
            <p style={{ color: "#64748b", margin: "2px 0 0", fontSize: "12px" }}>
              PayPal Orders v2 · No escrow holds incurred
            </p>
          </div>
        </div>

        <p style={{ color: "#475569", fontSize: "13.5px", lineHeight: "1.6", marginBottom: "24px" }}>
          Your payment authorization was cancelled prior to escrow capture. No hold was placed on your enterprise account. You can re-authorize this purchase order at any time in the Settlement tab.
        </p>

        <Link href="/" style={{
          display: "inline-block",
          textDecoration: "none",
          padding: "10px 18px",
          background: "#0070ba",
          color: "#ffffff",
          borderRadius: "6px",
          fontSize: "13px",
          fontWeight: "600",
        }}>
          ← Return to Overview
        </Link>
      </div>
    </div>
  );
}
