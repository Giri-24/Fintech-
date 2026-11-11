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
      background: "#090d16",
      color: "#f8fafc",
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "480px",
        background: "#0e1524",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "12px",
        padding: "32px",
        boxShadow: "0 12px 32px rgba(0, 0, 0, 0.4)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "8px",
            background: "rgba(245, 158, 11, 0.15)",
            color: "#f59e0b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
            fontWeight: "600",
            border: "1px solid rgba(245, 158, 11, 0.3)",
          }}>
            !
          </div>
          <div>
            <h1 style={{ fontSize: "17px", fontWeight: "600", margin: 0 }}>
              Payment Authorization Cancelled
            </h1>
            <p style={{ color: "#64748b", margin: "2px 0 0", fontSize: "12px" }}>
              PayPal Orders v2 · No charges incurred
            </p>
          </div>
        </div>

        <p style={{ color: "#94a3b8", fontSize: "13.5px", lineHeight: "1.6", marginBottom: "24px" }}>
          Your payment authorization was cancelled prior to capture. No escrow hold was placed on your account. You can re-authorize this purchase order at any time in the Approvals & Settlement tab.
        </p>

        <Link href="/" style={{
          display: "inline-block",
          textDecoration: "none",
          padding: "9px 16px",
          background: "#151f33",
          color: "#f8fafc",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "6px",
          fontSize: "13px",
          fontWeight: "500",
        }}>
          ← Return to Command Centre
        </Link>
      </div>
    </div>
  );
}
