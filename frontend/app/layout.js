import "./globals.css";

export const metadata = {
  title: "MINT · Mission Intelligence & Negotiation Technology",
  description: "Predictive Collective Procurement and Escrow Protocol for Industrial SMEs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
