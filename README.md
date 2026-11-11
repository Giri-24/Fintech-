# MINT &middot; Mission Intelligence & Negotiation Technology
### Predictive Collective Procurement & PayPal REST v2 Settlement for Industrial Verticals

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-14+-000000.svg?style=flat&logo=next.js)](https://nextjs.org)
[![PayPal REST v2](https://img.shields.io/badge/PayPal-Orders_v2_Sandbox-003087.svg?style=flat&logo=paypal)](https://developer.paypal.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](LICENSE)

---

## 1. Executive Summary & Problem Space

Small and medium-sized industrial enterprises (SMEs)—such as municipal water contractors, agricultural fluid dynamics operators, and commercial civil engineering firms—suffer a **15% to 30% price penalty** on mission-critical equipment compared to enterprise conglomerates. Because individual orders are fragmented (e.g. 10–25 units at a time), suppliers price them at standard retail tiers ($415+ / unit).

**MINT (Mission Intelligence & Negotiation Technology)** solves this through:
1. **Predictive Buying**: Forecasting recurring procurement cycles from historical invoice patterns before emergency spot-purchases are made.
2. **Demand Mesh**: Specification-based clustering that aggregates technical demands (e.g. 5HP centrifugal pumps, 50 m³/h flow, 30m head, IP55) across independent organizations into high-volume purchasing pools (50+ units).
3. **Autonomous Negotiation**: Simulated AI volume counter-offering that locks in tier-1 bulk pricing ($365 / unit vs $415 / unit, yielding \$2,250–\$2,500 direct savings).
4. **Individual Buyer PayPal Escrow & Settlement**: Crucially, **no pooled funds or commingled wallets exist**. Each buyer independently authorizes and captures their exact share via PayPal Orders v2 with cryptographic webhook verification.

---

## 2. Architecture & Transaction Flow

```
[Historical Invoices] ──────> [Predictive Engine] ──> [Procurement Forecasts]
                                                             │
                                                             ▼
[AquaFlow: 12 units] ┐                                [Demand Mesh]
[GreenPump: 15 units] ┼──> [Spec-Matching Clustering] ──> [50 Units Combined]
[HydroTech: 23 units] ┘                                      │
                                                             ▼
                                                    [Negotiation Room]
                                              ($415 Base ──> $365 Negotiated)
                                                             │
                                                             ▼
                                                    [Approvals Screen]
                                                             │
                                           ┌─────────────────┴─────────────────┐
                                           ▼                                   ▼
                                [Buyer 1: $4,380]                   [Buyer 2: $5,475]
                             (PayPal Order v2 Hold)              (PayPal Order v2 Hold)
                                           │                                   │
                                           └─────────────────┬─────────────────┘
                                                             ▼
                                                 [PayPal Orders v2 API]
                                             (Capture / Cryptographic Webhook)
```

---

## 3. Core Modules

| Module | Description | Key Tech / Logic |
| :--- | :--- | :--- |
| **Command Centre** | Real-time overview of active pools, predicted purchases, savings metrics, and pending authorizations. | Live API polling + Glassmorphism KPIs |
| **Predictive Buying** | Separates verifiable factual invoices from statistical predictive models with confidence ratings. | Historical invoice pattern recognition |
| **Demand Mesh** | Clusters SME purchase orders by engineering specs (flow, head, IP55, voltage) rather than vague keywords. | Specification compatibility engine |
| **Negotiation Room** | Transparent record of AI volume discount demands, supplier counter-offers, and price recommendations. | Multi-turn negotiation transcript |
| **Approvals & Payments** | Independent buyer login, PayPal Orders v2 sandbox checkout, and automated settlement. | PayPal REST v2 + RSA-SHA256 Webhook Verification |

---

## 4. Financial & Regulatory Architecture

> [!IMPORTANT]
> **No Commingled Funds or Regulatory Custody Burden**
> MINT functions strictly as an intelligent commercial coordinator. Funds are never held in a shared corporate account or pooled balance:
> - Each buyer organization maintains complete autonomy over its purchase order.
> - Payments are processed via **individual server-to-server PayPal Orders v2** transactions.
> - Amounts and quantities are validated against the server-side database—client-side payloads are never trusted as proof of payment.
> - Webhooks are cryptographically validated using PayPal public certificates and RSA-SHA256 digital signatures with CRC32 payload checksums.

---

## 5. Technology Stack

### Frontend
- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router, React 18, React Server Components & Client Components)
- **Styling**: Tailored Glassmorphism Design System with backdrop blur, saturated dark slate palette, and vibrant teal accent (`#2dd4bf`)
- **State & Integration**: Native Fetch API with graceful fallback to seeded demo states

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) with [Pydantic v2](https://docs.pydantic.dev/)
- **Asynchronous HTTP**: [HTTPX](https://www.python-httpx.org/) for high-throughput PayPal REST v2 communication
- **Security & Cryptography**: [cryptography](https://cryptography.io/) for X.509 PEM certificate verification and RSA PKCS1v15 SHA-256 digital signatures
- **Server**: [Uvicorn](https://www.uvicorn.org/) ASGI

---

## 6. Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm
- (Optional) Docker & Docker Compose

---

### Method A: Running Locally

#### 1. Start Backend (FastAPI)
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# (Optional) Configure PayPal Sandbox credentials in .env
cp .env.example .env

# Run FastAPI server
python run.py
# Server runs at http://localhost:8000
# Interactive Swagger docs: http://localhost:8000/docs
```

> **Note on Mock Mode**: If `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` are left blank, MINT automatically activates built-in Sandbox Mock Mode so you can demo the full checkout and capture lifecycle immediately without waiting for API keys.

#### 2. Start Frontend (Next.js)
```bash
cd ../frontend

# Install dependencies
npm install

# Start Next.js development server
npm run dev
# Dashboard runs at http://localhost:3000
```

---

### Method B: One-Command Docker Setup

```bash
docker-compose up --build
```
- Dashboard: **http://localhost:3000**
- API Documentation: **http://localhost:8000/docs**

---

## 7. Interactive Demo Walkthrough

1. Open **http://localhost:3000**
2. **Command Centre**: View the active industrial water pump opportunity ($365/unit on 50 units, $2,250 savings).
3. **Predictive Buying**: Review forecasted purchases for AquaFlow, GreenPump, and HydroTech. Click **Accept & Join Pool**.
4. **Demand Mesh**: Inspect technical spec matching (Flow 50 m³/h, Head 30m, IP55 rating).
5. **Negotiation Room**: Review the multi-turn volume negotiation transcript between AI and the supplier.
6. **Approvals & Payment**:
   - Use the **Quick demo sign-in** buttons to log in as **AquaFlow Industries** (password: `demo`).
   - Click **Create Order** on the pending \$4,380 order.
   - Click **Open PayPal Checkout →** to verify the sandbox/mock authorization flow and view the auto-capture receipt at `/payment/return`.

---

## 8. API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | API status and route index |
| `GET` | `/health` | Service health verification |
| `POST` | `/api/v1/auth/login` | Demo organization authentication |
| `GET` | `/api/v1/auth/me` | Fetch authenticated organization profile |
| `GET` | `/api/v1/demo/command-centre` | Overview metrics and active pool summary |
| `GET` | `/api/v1/demo/predictions` | Statistical purchase demand forecasts |
| `GET` | `/api/v1/demo/demand-mesh` | Spec-matched demand aggregation group |
| `GET` | `/api/v1/demo/negotiation` | Supplier negotiation transcript and counter-offers |
| `GET` | `/api/v1/demo/approvals` | Buyer authorization statuses |
| `GET` | `/api/v1/demo/history` | Factual historical invoices dataset |
| `POST` | `/api/v1/payments/paypal/create-order` | Create server-side PayPal order |
| `POST` | `/api/v1/payments/paypal/capture` | Capture authorized PayPal funds |
| `GET` | `/api/v1/payments/paypal/order/{id}` | Check status of an order |
| `POST` | `/api/v1/payments/paypal/webhook` | Cryptographically verify PayPal webhook |

---

## 9. Testing & Code Quality

Run backend test suite:
```bash
cd backend
python -m pytest tests/
```

All endpoints, authentication checks, and mock PayPal order creations are covered.

---

## 10. License

Released under the [MIT License](LICENSE).
