const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string) ?? '';
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ?? '';

function baseHeaders(extra: Record<string, string> = {}): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    ...extra,
  };
}

function endpoint(table: string, query = ''): string {
  return `${SUPABASE_URL}/rest/v1/${table}${query ? `?${query}` : ''}`;
}

export const supabase = {
  from(table: string) {
    return {
      async select(columns = '*', filters: Record<string, string> = {}) {
        const params = new URLSearchParams({ select: columns, ...filters });
        const res = await fetch(endpoint(table, params.toString()), {
          headers: baseHeaders(),
        });
        const data = res.ok ? await res.json() : null;
        const error = res.ok ? null : { message: await res.text(), status: res.status };
        return { data, error };
      },

      async insert(body: Record<string, unknown> | Record<string, unknown>[]) {
        const res = await fetch(endpoint(table), {
          method: 'POST',
          headers: baseHeaders({ Prefer: 'return=representation' }),
          body: JSON.stringify(body),
        });
        const data = res.ok ? await res.json() : null;
        const error = res.ok ? null : { message: await res.text(), status: res.status };
        return { data, error };
      },

      async update(body: Record<string, unknown>, filters: Record<string, string> = {}) {
        const params = new URLSearchParams(filters);
        const res = await fetch(endpoint(table, params.toString()), {
          method: 'PATCH',
          headers: baseHeaders({ Prefer: 'return=representation' }),
          body: JSON.stringify(body),
        });
        const data = res.ok ? await res.json() : null;
        const error = res.ok ? null : { message: await res.text(), status: res.status };
        return { data, error };
      },

      async delete(filters: Record<string, string> = {}) {
        const params = new URLSearchParams(filters);
        const res = await fetch(endpoint(table, params.toString()), {
          method: 'DELETE',
          headers: baseHeaders(),
        });
        const error = res.ok ? null : { message: await res.text(), status: res.status };
        return { data: null, error };
      },
    };
  },

  auth: {
    async signUp({ email, password }: { email: string; password: string }) {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: baseHeaders(),
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      return res.ok
        ? { data: json, error: null }
        : { data: null, error: { message: json?.error_description ?? json?.msg ?? 'Sign up failed' } };
    },

    async signInWithPassword({ email, password }: { email: string; password: string }) {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: baseHeaders(),
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      return res.ok
        ? { data: json, error: null }
        : { data: null, error: { message: json?.error_description ?? json?.msg ?? 'Sign in failed' } };
    },

    async signOut() {
      const token = sessionStorage.getItem('sb_access_token');
      await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
        method: 'POST',
        headers: baseHeaders(token ? { Authorization: `Bearer ${token}` } : {}),
      });
      sessionStorage.removeItem('sb_access_token');
      return { error: null };
    },

    getSession() {
      const token = sessionStorage.getItem('sb_access_token');
      return { data: { session: token ? { access_token: token } : null }, error: null };
    },

    onAuthStateChange(_cb: (event: string, session: unknown) => void) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
  },
};
