import { assessmentSchema, type AssessmentFormValues } from "./schema";

/**
 * Guardado en el navegador para la demo: borrador del asistente y último diagnóstico.
 * Cuando Supabase esté conectado (hito 2–3), el diagnóstico se guardará en `assessments`.
 */
const DRAFT_KEY = "alza:diagnostico:borrador:v1";
const ASSESSMENT_KEY = "alza:diagnostico:ultimo:v1";

export type StoredAssessment = { input: AssessmentFormValues; createdAt: string };

function read(key: string): unknown {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Almacenamiento bloqueado (modo privado): la app sigue funcionando sin guardar.
  }
}

export function loadDraft(): { values: Partial<AssessmentFormValues>; step: number } | null {
  const data = read(DRAFT_KEY) as { values?: unknown; step?: unknown } | null;
  if (!data || typeof data !== "object") return null;
  const parsed = assessmentSchema.partial().safeParse(data.values);
  if (!parsed.success) return null;
  const step = typeof data.step === "number" && data.step >= 0 && data.step <= 3 ? data.step : 0;
  return { values: parsed.data, step };
}

export function saveDraft(values: unknown, step: number) {
  write(DRAFT_KEY, { values, step });
}

export function clearDraft() {
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    // nada que limpiar
  }
}

export function saveAssessment(input: AssessmentFormValues) {
  write(ASSESSMENT_KEY, { input, createdAt: new Date().toISOString() } satisfies StoredAssessment);
}

export type LoadResult = { status: "empty" } | { status: "invalid" } | { status: "ok"; assessment: StoredAssessment };

export function loadAssessment(): LoadResult {
  const data = read(ASSESSMENT_KEY) as { input?: unknown; createdAt?: unknown } | null;
  if (!data) return { status: "empty" };
  const parsed = assessmentSchema.safeParse(data.input);
  if (!parsed.success) return { status: "invalid" };
  return {
    status: "ok",
    assessment: { input: parsed.data, createdAt: typeof data.createdAt === "string" ? data.createdAt : "" },
  };
}
