import { describe, expect, it } from "vitest";

import { EnvError, validateEnv } from "./schema";

const valid = {
  NEXT_PUBLIC_SUPABASE_URL: "https://abcdefgh.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "sb_publishable_123",
  NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
};

describe("validateEnv", () => {
  it("acepta un entorno mínimo válido y usa el proveedor simulado por defecto", () => {
    const env = validateEnv(valid);
    expect(env.client.NEXT_PUBLIC_SUPABASE_URL).toBe(valid.NEXT_PUBLIC_SUPABASE_URL);
    expect(env.server.BILLING_PROVIDER).toBe("mock");
    expect(env.server.SUPABASE_SERVICE_ROLE_KEY).toBeUndefined();
  });

  it("acepta la clave anon antigua en formato JWT", () => {
    expect(() => validateEnv({ ...valid, NEXT_PUBLIC_SUPABASE_ANON_KEY: "aaa.bbb.ccc" })).not.toThrow();
  });

  it("trata los valores vacíos como ausentes", () => {
    const env = validateEnv({ ...valid, BILLING_PROVIDER: "", SUPABASE_SERVICE_ROLE_KEY: "" });
    expect(env.server.BILLING_PROVIDER).toBe("mock");
    expect(env.server.SUPABASE_SERVICE_ROLE_KEY).toBeUndefined();
  });

  it("rechaza una URL de Supabase vacía con un mensaje en español", () => {
    expect(() => validateEnv({ ...valid, NEXT_PUBLIC_SUPABASE_URL: "" })).toThrow(
      /NEXT_PUBLIC_SUPABASE_URL: Debe ser la URL/,
    );
  });

  it("rechaza la URL de la API REST en lugar de la del proyecto", () => {
    expect(() => validateEnv({ ...valid, NEXT_PUBLIC_SUPABASE_URL: "https://abcdefgh.supabase.co/rest/v1/" })).toThrow(
      /Quita «\/rest\/v1\/»/,
    );
  });

  it("rechaza BILLING_PROVIDER=stripe en la v1", () => {
    expect(() => validateEnv({ ...valid, BILLING_PROVIDER: "stripe" })).toThrow(/pagos son simulados/);
  });

  it("rechaza una clave secreta puesta como clave pública", () => {
    expect(() => validateEnv({ ...valid, NEXT_PUBLIC_SUPABASE_ANON_KEY: "sb_secret_123" })).toThrow(EnvError);
  });

  it("rechaza secretos con prefijo NEXT_PUBLIC_", () => {
    expect(() => validateEnv({ ...valid, NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY: "x" })).toThrow(
      /no puede llevar el prefijo/,
    );
  });

  it("junta todos los errores en un único mensaje", () => {
    try {
      validateEnv({});
      expect.unreachable();
    } catch (error) {
      const message = (error as Error).message;
      expect(message).toContain("NEXT_PUBLIC_SUPABASE_URL");
      expect(message).toContain("NEXT_PUBLIC_SUPABASE_ANON_KEY");
      expect(message).toContain("NEXT_PUBLIC_SITE_URL");
    }
  });
});
