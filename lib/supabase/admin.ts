import "server-only";

import { createClient } from "@supabase/supabase-js";

import { clientEnv } from "@/lib/env/client";
import { serverEnv } from "@/lib/env/server";

/**
 * Cliente con la clave de servicio: se salta RLS. Solo para tareas de servidor
 * muy concretas (seed, borrado de cuenta). Nunca para leer datos en nombre de un usuario.
 */
export function createAdminClient() {
  const key = serverEnv.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error("Falta SUPABASE_SERVICE_ROLE_KEY en el servidor (obligatoria desde el hito 2).");
  }
  return createClient(clientEnv.NEXT_PUBLIC_SUPABASE_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
