// Safe lazy Supabase client for Cloudflare Workers
// - NO top-level initialization
// - Returns null when env missing (fail-safe)
// - Only callable from .server.ts files

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

let _client: SupabaseClient<Database> | null | undefined = undefined;

function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith('sb_publishable_') || value.startsWith('sb_secret_');
}

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== 'undefined' && input instanceof Request ? input.headers : undefined,
    );

    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }

    if (isNewSupabaseApiKey(supabaseKey) && headers.get('Authorization') === `Bearer ${supabaseKey}`) {
      headers.delete('Authorization');
    }

    headers.set('apikey', supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

/**
 * Get Supabase admin client (lazy, null-safe)
 * Returns null when SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing
 * SECURITY: Only use from .server.ts files - bypasses RLS
 */
export function getSupabaseAdmin(): SupabaseClient<Database> | null {
  if (_client === undefined) {
    const url = process.env['SUPABASE_URL'];
    const key = process.env['SUPABASE_SERVICE_ROLE_KEY'];

    if (!url || !key) {
      console.warn('[Supabase] Missing env vars - admin features disabled');
      _client = null;
      return null;
    }

    _client = createClient<Database>(url, key, {
      global: {
        fetch: createSupabaseFetch(key),
      },
      auth: {
        storage: undefined,
        persistSession: false,
        autoRefreshToken: false,
      }
    });
  }

  return _client;
}
