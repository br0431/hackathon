import { parseClientEnv } from "./schema";

/**
 * Variables públicas, seguras en el navegador. Cada una se nombra de forma explícita
 * para que Next.js las sustituya en la compilación.
 */
export const clientEnv = parseClientEnv({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});
