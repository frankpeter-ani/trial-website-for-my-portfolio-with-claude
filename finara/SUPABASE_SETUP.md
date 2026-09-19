# Finara Supabase Integration & Setup Guide

This guide walks you through connecting your Finara Frontend application to your live **Supabase Postgres Database & Authentication system**.

---

## Step 1: Create a Free Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and click **Start your project**.
2. Sign in with GitHub or Email.
3. Click **New Project**, select your organization, name your project `finara-banking`, set a secure database password, and choose your preferred region.

---

## Step 2: Run the Postgres SQL Schema

1. Open your Supabase Dashboard: `https://supabase.com/dashboard/project/<your-project-id>`.
2. In the left menu, click **SQL Editor** (`</>`).
3. Click **New Query**.
4. Copy the entire contents of the file [`supabase/schema.sql`](file:///Users/henrycliq/Documents/swift/supabase/schema.sql) in this repository.
5. Paste it into the SQL Editor and click **Run** (or `Ctrl + Enter`).

> **What this does:**
> - Provisions the `profiles`, `wallets`, `portfolio`, `transactions`, and `audit_logs` tables.
> - Configures an automatic Postgres trigger `on_auth_user_created` that provisions a multi-currency wallet ($7,000.75 USD, €5,320.00 EUR, £3,150.00 GBP) whenever a user registers!
> - Enforces Row Level Security (RLS) policies ensuring users can only read and modify their own financial data.

---

## Step 3: Configure Environment Variables

1. In your Supabase Dashboard, click **Project Settings** (gear icon) -> **API**.
2. Copy your **Project URL** and **`anon` `public` key**.
3. In the root of your project directory (`/Users/henrycliq/Documents/swift`), create a `.env` file (or rename `.env.example` to `.env`):

```bash
VITE_SUPABASE_URL=https://your-supabase-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. Restart your Vite dev server:

```bash
npm run dev
```

---

## Architecture Features Included

- **Native Auth API**: Sign Up, Sign In, and Sign Out with persistent session handling.
- **Row Level Security (RLS)**: Enforced isolation per user ID.
- **Resilient Hybrid Fallback**: If Supabase environment variables are missing, the application automatically uses persistent demo state so you can present preview builds without breaking.
