import { createBrowserClient } from "@supabase/ssr";

import { clientEnv } from "@/lib/env/client";

/** Cliente de Supabase para componentes de cliente. Solo usa la clave pública. */
export function createClient() {
  return createBrowserClient(clientEnv.NEXT_PUBLIC_SUPABASE_URL, clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
