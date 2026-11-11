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
      color: "#111827",
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "480px",
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "32px",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <div style={{
            width: "38px",
            height: "38px",
            borderRadius: "8px",
            background: "#fffbeb",
            color: "#d97706",
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
            <h1 style={{ fontSize: "17px", fontWeight: "700", margin: 0, color: "#111827" }}>
              Payment Authorization Cancelled
            </h1>
            <p style={{ color: "#6b7280", margin: "2px 0 0", fontSize: "12px" }}>
              PayPal Orders v2 · No charges incurred
            </p>
          </div>
        </div>

        <p style={{ color: "#4b5563", fontSize: "13.5px", lineHeight: "1.6", marginBottom: "24px" }}>
          Your payment authorization was cancelled prior to capture. No escrow hold was placed on your account. You can re-authorize this purchase order at any time in the Approvals & Settlement tab.
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
          boxShadow: "0 1px 2px rgba(0, 112, 186, 0.2)",
        }}>
          ← Return to Command Centre
        </Link>
      </div>
    </div>
  );
}
