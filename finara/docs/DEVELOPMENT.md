# Finara Platform — Developer Guide

## Quick Start Guide

### Prerequisites
- Node.js >= 20.x
- npm >= 10.x
- Supabase CLI (optional for local database migrations)

### 1. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are defined.

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Run TypeScript & Quality Checks
```bash
npx tsc --noEmit
npm run build
```

---

## Directory Structure Strategy
- `/src/components/`: Reusable UI components (Button, Input, Modal, MoneyDisplay, StatusBadge).
- `/src/services/`: Pure business logic (Ledger, Transfers, Risk, Cards, KYC, Providers).
- `/src/lib/`: Core utilities (`money.ts`, `supabase.ts`).
- `/supabase/migrations/`: Sequential PostgreSQL migration scripts.
- `/docs/`: Architectural, security, and API documentation.
- `/tests/`: Automated unit, integration, and security test suites.
