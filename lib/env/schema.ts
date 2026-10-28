import { z } from "zod";

/**
 * Esquemas de las variables de entorno. Este módulo es puro (no lee process.env)
 * para poder usarlo desde next.config.ts, desde el servidor y desde los tests.
 */

/** Un valor vacío en .env (`CLAVE=`) cuenta como ausente. */
const emptyToUndefined = (value: unknown) => (value === "" ? undefined : value);

const optionalSecret = z.preprocess(emptyToUndefined, z.string().min(1).optional());

/** Clave pública de Supabase: la "anon" antigua (JWT) o la nueva "sb_publishable_…". */
const supabasePublicKey = z
  .string({ error: "Falta la clave pública de Supabase." })
  .min(1, { error: "Falta la clave pública de Supabase." })
  .refine((value) => value.startsWith("sb_publishable_") || value.split(".").length === 3, {
    error: "No parece una clave pública de Supabase (anon o sb_publishable_…).",
  })
  .refine((value) => !value.startsWith("sb_secret_"), {
    error: "Has puesto una clave secreta: aquí va la clave pública.",
  });

export const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url({ error: "Debe ser la URL del proyecto de Supabase (https://….supabase.co)." }),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: supabasePublicKey,
  NEXT_PUBLIC_SITE_URL: z.url({ error: "Debe ser la URL pública de la app (por ejemplo, http://localhost:3000)." }),
});

export const serverSchema = z.object({
  /** Solo servidor. Opcional en el hito 0; obligatoria a partir del hito 2. */
  SUPABASE_SERVICE_ROLE_KEY: optionalSecret,
  /** En la v1 solo existe el proveedor simulado (docs/PRD.md, pagos). */
  BILLING_PROVIDER: z.preprocess(
    emptyToUndefined,
    z.enum(["mock"], { error: 'Debe ser "mock": en la v1 los pagos son simulados.' }).default("mock"),
  ),
  // Previstas para la fase 2 (Stripe en modo test). Sin uso en la v1.
  STRIPE_SECRET_KEY: optionalSecret,
  STRIPE_WEBHOOK_SECRET: optionalSecret,
  STRIPE_PRICE_ID_REMATE: optionalSecret,
  STRIPE_PRICE_ID_ACE: optionalSecret,
});

export type ClientEnv = z.infer<typeof clientSchema>;
export type ServerEnv = z.infer<typeof serverSchema>;

type RawEnv = Record<string, string | undefined>;

export class EnvError extends Error {
  constructor(issues: string[]) {
    super(
      [
        "Variables de entorno no válidas:",
        ...issues.map((issue) => `  - ${issue}`),
        "Revisa .env.local (plantilla en .env.example).",
      ].join("\n"),
    );
    this.name = "EnvError";
  }
}

function formatIssues(error: z.ZodError): string[] {
  return error.issues.map((issue) => `${issue.path.join(".") || "(entorno)"}: ${issue.message}`);
}

/** Ningún secreto puede llevar el prefijo NEXT_PUBLIC_, porque acabaría en el navegador. */
function leakedSecrets(env: RawEnv): string[] {
  return Object.keys(env)
    .filter((key) => key.startsWith("NEXT_PUBLIC_") && /SERVICE_ROLE|SECRET/.test(key))
    .map((key) => `${key}: un secreto no puede llevar el prefijo NEXT_PUBLIC_.`);
}

export function parseClientEnv(env: RawEnv): ClientEnv {
  const result = clientSchema.safeParse(env);
  if (!result.success) throw new EnvError(formatIssues(result.error));
  return result.data;
}

export function parseServerEnv(env: RawEnv): ServerEnv {
  const result = serverSchema.safeParse(env);
  if (!result.success) throw new EnvError(formatIssues(result.error));
  return result.data;
}

/** Valida todo el entorno de una vez y junta todos los errores en un único mensaje. */
export function validateEnv(env: RawEnv): { client: ClientEnv; server: ServerEnv } {
  const client = clientSchema.safeParse(env);
  const server = serverSchema.safeParse(env);
  const issues = [
    ...(client.success ? [] : formatIssues(client.error)),
    ...(server.success ? [] : formatIssues(server.error)),
    ...leakedSecrets(env),
  ];
  if (issues.length > 0 || !client.success || !server.success) throw new EnvError(issues);
  return { client: client.data, server: server.data };
}
