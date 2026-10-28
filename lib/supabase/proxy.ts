import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { clientEnv } from "@/lib/env/client";

/**
 * Refresca la sesión de Supabase en cada petición y reescribe sus cookies.
 * La protección de rutas por sesión (hito 2) y por plan (hito 4) se añade aquí,
 * pero el permiso real siempre se vuelve a comprobar en servidor y en RLS.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(clientEnv.NEXT_PUBLIC_SUPABASE_URL, clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) response.cookies.set(name, value, options);
        for (const [key, value] of Object.entries(headers)) response.headers.set(key, value);
      },
    },
  });

  // No pongas código entre createServerClient y getClaims: getClaims valida y refresca el token.
  await supabase.auth.getClaims();

  return response;
}
