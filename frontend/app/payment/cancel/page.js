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
      background: "#070b14",
      color: "#f8fafc",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "480px",
        background: "#0c1322",
        border: "1px solid rgba(245, 158, 11, 0.35)",
        borderRadius: "12px",
        padding: "32px",
        boxShadow: "0 0 24px rgba(245, 158, 11, 0.15)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: "rgba(245, 158, 11, 0.15)",
            color: "#f59e0b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            fontWeight: "800",
            border: "1px solid rgba(245, 158, 11, 0.4)",
          }}>
            !
          </div>
          <div>
            <h1 style={{ fontSize: "18px", fontWeight: "800", margin: 0, color: "#f8fafc" }}>
              Payment Authorization Cancelled
            </h1>
            <p style={{ color: "#94a3b8", margin: "2px 0 0", fontSize: "12px" }}>
              PayPal Orders v2 · No escrow charges incurred
            </p>
          </div>
        </div>

        <p style={{ color: "#94a3b8", fontSize: "13.5px", lineHeight: "1.6", marginBottom: "24px" }}>
          Your payment authorization was cancelled prior to capture. Zero escrow hold was placed on your enterprise account. You can re-authorize this purchase order at any time in the Settlement tab.
        </p>

        <Link href="/" style={{
          display: "inline-block",
          textDecoration: "none",
          padding: "10px 18px",
          background: "#142036",
          color: "#f8fafc",
          borderRadius: "6px",
          fontSize: "13px",
          fontWeight: "700",
          border: "1px solid rgba(255, 255, 255, 0.12)",
        }}>
          ← Return to Command Centre
        </Link>
      </div>
    </div>
  );
}
