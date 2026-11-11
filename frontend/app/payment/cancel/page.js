"use client";

import Link from "next/link";

const glass = {
  background: "rgba(15, 23, 42, 0.4)",
  backdropFilter: "blur(20px) saturate(180%)",
  WebkitBackdropFilter: "blur(20px) saturate(180%)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.35)",
  borderRadius: "18px",
  padding: "32px",
  maxWidth: "500px",
  width: "100%",
};

export default function PaymentCancelPage() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: "20px",
      background: `
        radial-gradient(ellipse at 85% 90%, rgba(14, 165, 233, 0.1) 0%, transparent 50%),
        linear-gradient(160deg, #020617 0%, #0c1222 50%, #0f172a 100%)
      `,
      color: "#f1f5f9",
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={glass}>
        <div style={{
          width: "40px",
          height: "40px",
          borderRadius: "12px",
          background: "rgba(251, 191, 36, 0.15)",
          color: "#fbbf24",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          marginBottom: "16px",
          border: "1px solid rgba(251, 191, 36, 0.3)",
        }}>
          !
        </div>
        <h1 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>
          Payment Cancelled
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.6", marginBottom: "24px" }}>
          Your payment authorization was cancelled. No funds were debited or captured from your account. You can re-authorize this order at any time in the Approvals tab.
        </p>

        <Link href="/" style={{
          display: "inline-block",
          textDecoration: "none",
          padding: "10px 18px",
          background: "rgba(255, 255, 255, 0.08)",
          color: "#f1f5f9",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: "10px",
          fontSize: "13.5px",
        }}>
          ← Return to Command Centre
        </Link>
      </div>
    </div>
  );
}
