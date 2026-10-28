import { z } from "zod";

import { GOALS, POSITIONS } from "@/lib/scoring/types";

/** Validación compartida entre cliente y servidor (docs/PRD.md, campos del formulario). */

const intInRange = (min: number, max: number, unit = "") => {
  const message = `Escribe un número entero entre ${min} y ${max}${unit}.`;
  return z.number({ error: message }).int({ error: message }).min(min, { error: message }).max(max, { error: message });
};

const rating = z.literal([1, 2, 3, 4, 5], { error: "Elige una nota del 1 al 5." });

export const assessmentSchema = z.object({
  age: intInRange(14, 60, " años"),
  heightCm: intInRange(130, 230, " cm"),
  weightKg: intInRange(35, 150, " kg"),
  verticalJumpCm: intInRange(10, 110, " cm").nullable(),
  position: z.enum(POSITIONS, { error: "Elige tu posición o «Aún no lo sé»." }),
  skills: z.object({
    saque: rating,
    recepcion: rating,
    colocacion: rating,
    remate: rating,
    bloqueo: rating,
    defensa: rating,
  }),
  goal: z.enum(GOALS, { error: "Elige un rumbo." }),
  weeklyDays: intInRange(1, 6, " días"),
});

export type AssessmentFormValues = z.infer<typeof assessmentSchema>;

export const DEFAULT_ASSESSMENT: AssessmentFormValues = {
  age: 18,
  heightCm: 175,
  weightKg: 68,
  verticalJumpCm: 45,
  position: "nose",
  skills: { saque: 3, recepcion: 3, colocacion: 3, remate: 3, bloqueo: 3, defensa: 3 },
  goal: "debil",
  weeklyDays: 3,
};

/** Campos que se validan antes de pasar de cada paso. */
export const STEP_FIELDS = [
  ["age", "heightCm", "weightKg"],
  ["verticalJumpCm", "position"],
  ["skills"],
  ["goal", "weeklyDays"],
] as const;
