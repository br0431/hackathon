import { checkSupabaseHealth } from "@/lib/supabase/health";

/** GET /api/health: estado de la app y de la conexión con Supabase. */
export async function GET() {
  const supabase = await checkSupabaseHealth();
  const ok = supabase === "ok";
  return Response.json({ ok, supabase }, { status: ok ? 200 : 503, headers: { "Cache-Control": "no-store" } });
}
