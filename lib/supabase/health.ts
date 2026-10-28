import "server-only";

import { clientEnv } from "@/lib/env/client";

export type SupabaseHealth = "ok" | "error";

/** Comprueba que el proyecto de Supabase responde, sin depender de ninguna tabla. */
export async function checkSupabaseHealth(): Promise<SupabaseHealth> {
  try {
    const response = await fetch(new URL("/auth/v1/health", clientEnv.NEXT_PUBLIC_SUPABASE_URL), {
      headers: { apikey: clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    return response.ok ? "ok" : "error";
  } catch {
    return "error";
  }
}
