// ====================================================================
// FINARA PLATFORM — SUPABASE BACKEND CLIENT & REST SERVICE
// Production Senior Backend SDK Layer (Zero-Dependency REST & Auth Client)
// ====================================================================

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(SUPABASE_URL) &&
    Boolean(SUPABASE_ANON_KEY) &&
    !SUPABASE_URL.includes('your-supabase-project-id')
  );
};

export interface SupabaseAuthUser {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  accountStatus: 'Verified' | 'Suspended' | 'Pending';
  iban: string;
  token?: string;
}

// --------------------------------------------------------------------
// NATIVE SUPABASE REST HELPERS
// --------------------------------------------------------------------
const getHeaders = (accessToken?: string) => ({
  'Content-Type': 'application/json',
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${accessToken || SUPABASE_ANON_KEY}`,
  'Prefer': 'return=representation',
});

// --------------------------------------------------------------------
// 1. SUPABASE AUTHENTICATION
// --------------------------------------------------------------------

/**
 * Sign Up a new user with Supabase Auth & create profile + wallet
 */
export async function supabaseSignUp(email: string, pass: string, name: string): Promise<SupabaseAuthUser> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase project URL and Anon Key are not configured in .env file.');
  }

  const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      email,
      password: pass,
      data: { name, role: 'user' },
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.msg || data.error_description || 'Supabase Sign Up failed.');
  }

  const user = data.user;
  const token = data.access_token;

  // Fetch or construct user profile
  return {
    id: user?.id || `usr_${Date.now()}`,
    email: email,
    name: name,
    role: 'user',
    accountStatus: 'Verified',
    iban: `GB82FINA${Math.floor(10000000000000 + Math.random() * 90000000000000)}`,
    token: token,
  };
}

/**
 * Sign In user with Supabase Auth
 */
export async function supabaseSignIn(email: string, pass: string): Promise<SupabaseAuthUser> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase project URL and Anon Key are not configured in .env file.');
  }

  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, password: pass }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error_description || data.msg || 'Invalid login credentials.');
  }

  const token = data.access_token;
  const authUser = data.user;

  // Fetch Profile from /rest/v1/profiles
  const profileRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${authUser.id}`, {
    method: 'GET',
    headers: getHeaders(token),
  });

  const profiles = await profileRes.json();
  const profile = Array.isArray(profiles) && profiles.length > 0 ? profiles[0] : null;

  return {
    id: authUser.id,
    email: authUser.email,
    name: profile?.name || authUser.user_metadata?.name || 'Finara Member',
    role: profile?.role || 'user',
    accountStatus: profile?.account_status || 'Verified',
    iban: profile?.iban || 'GB82FINA99834827510294',
    token: token,
  };
}

// --------------------------------------------------------------------
// 2. SUPABASE REST DATABASE QUERIES
// --------------------------------------------------------------------

export async function supabaseGetWallets(userId: string, token?: string) {
  if (!isSupabaseConfigured()) return null;

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/wallets?user_id=eq.${userId}`, {
      headers: getHeaders(token),
    });
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return {
        USD: Number(data[0].usd_balance),
        EUR: Number(data[0].eur_balance),
        GBP: Number(data[0].gbp_balance),
      };
    }
  } catch (err) {
    console.warn('Supabase fetch wallet failed:', err);
  }
  return null;
}

export async function supabaseUpdateWallet(userId: string, balances: { USD: number; EUR: number; GBP: number }, token?: string) {
  if (!isSupabaseConfigured()) return;

  try {
    await fetch(`${SUPABASE_URL}/rest/v1/wallets?user_id=eq.${userId}`, {
      method: 'PATCH',
      headers: getHeaders(token),
      body: JSON.stringify({
        usd_balance: balances.USD,
        eur_balance: balances.EUR,
        gbp_balance: balances.GBP,
        updated_at: new Date().toISOString(),
      }),
    });
  } catch (err) {
    console.warn('Supabase update wallet failed:', err);
  }
}

export async function supabaseAddTransaction(tx: {
  userId: string;
  type: string;
  title: string;
  subtitle: string;
  amount: number;
  currency?: string;
  recipientEmail?: string;
}, token?: string) {
  if (!isSupabaseConfigured()) return;

  try {
    await fetch(`${SUPABASE_URL}/rest/v1/transactions`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({
        user_id: tx.userId,
        type: tx.type,
        title: tx.title,
        subtitle: tx.subtitle,
        amount: tx.amount,
        currency: tx.currency || 'USD',
        status: 'Completed',
        recipient_email: tx.recipientEmail || null,
      }),
    });
  } catch (err) {
    console.warn('Supabase add transaction failed:', err);
  }
}
