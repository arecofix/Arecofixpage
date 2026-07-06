const { createClient } = require('@supabase/supabase-js');
const localStorage = new Map();
const storage = {
  getItem: (k) => localStorage.has(k) ? localStorage.get(k) : null,
  setItem: (k, v) => localStorage.set(k, String(v)),
  removeItem: (k) => localStorage.delete(k),
  key: (i) => Array.from(localStorage.keys())[i] || null,
  get length() { return localStorage.size; }
};
(async () => {
  const client = createClient('https://xyz.supabase.co', 'anon', {
    auth: {
      storage,
      persistSession: true,
      detectSessionInUrl: false,
      autoRefreshToken: false
    }
  });
  const session = {
    provider_token: null,
    access_token: 'token',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    refresh_token: 'refresh',
    token_type: 'bearer',
    user: {
      id: 'uid',
      aud: 'authenticated',
      role: 'authenticated',
      email: 'a@b.com',
      app_metadata: { provider: 'email', providers: ['email'] },
      user_metadata: { role: 'super_admin' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  };
  const res = await client.auth.setSession(session);
  console.log('error', res.error);
  console.log('keys', Array.from(localStorage.keys()));
  for (const [k, v] of localStorage) {
    console.log('key', k, 'value', v);
  }
})();
