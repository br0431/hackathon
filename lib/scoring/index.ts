import { JUMP_AGE_FACTORS, JUMP_BASE, JUMP_TOP_BY_POSITION, JUMP_UNKNOWN_SCORE } from "@/config/benchmarks";
import { JUMP_WEIGHT_BOOST_BELOW_REFERENCE, POSITION_REFERENCE_HEIGHT_CM, POSITION_WEIGHTS } from "@/config/positions";

import {
  RADAR_AXES,
  SKILLS,
  type ArchetypeId,
  type AssessmentInput,
  type AssessmentResult,
  type Axis,
  type Goal,
  type Level,
  type Position,
  type Rating,
} from "./types";

export * from "./types";

/** Motor de puntuación: funciones puras, sin React ni Supabase (CLAUDE.md, regla 3). */

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));

/** Nota de 1 a 5 → 0 a 100. */
export function ratingToScore(rating: Rating): number {
  return ((rating - 1) / 4) * 100;
}

function ageFactor(age: number): number {
  return JUMP_AGE_FACTORS.find((band) => age <= band.maxAge)?.factor ?? 1;
}

/** Salto vertical (cm) → 0 a 100 según la tabla de referencia por edad y posición. */
export function jumpToScore(jumpCm: number, age: number, position: Position): number {
  const factor = ageFactor(age);
  const floor = JUMP_BASE.floorCm * factor;
  const top = JUMP_TOP_BY_POSITION[position] * factor;
  return Math.round(clamp(((jumpCm - floor) / (top - floor)) * 100));
}

export function scoreLevel(score: number): Level {
  if (score < 40) return "bajo";
  if (score <= 70) return "medio";
  return "alto";
}

/** Pesos por eje para la posición, con el ajuste de altura (solo reordena prioridades). */
export function axisWeights(input: Pick<AssessmentInput, "position" | "heightCm">): Record<Axis, number> {
  const weights = { ...POSITION_WEIGHTS[input.position] };
  const reference = POSITION_REFERENCE_HEIGHT_CM[input.position];
  if (reference !== null && input.heightCm < reference) {
    weights.salto += JUMP_WEIGHT_BOOST_BELOW_REFERENCE;
  }
  return weights;
}

export function computeScores(input: AssessmentInput): { scores: Record<Axis, number>; jumpEstimated: boolean } {
  const scores = {} as Record<Axis, number>;
  for (const skill of SKILLS) scores[skill] = ratingToScore(input.skills[skill]);
  const jumpEstimated = input.verticalJumpCm === null;
  scores.salto =
    input.verticalJumpCm === null ? JUMP_UNKNOWN_SCORE : jumpToScore(input.verticalJumpCm, input.age, input.position);
  return { scores, jumpEstimated };
}

/** Ordena de mayor a menor; en caso de empate manda el orden del radar, para que sea estable. */
function rank(axes: readonly Axis[], value: (axis: Axis) => number): Axis[] {
  return [...axes].sort((a, b) => value(b) - value(a) || RADAR_AXES.indexOf(a) - RADAR_AXES.indexOf(b));
}

function pickArchetype(scores: Record<Axis, number>, mainWeapon: Axis, axes: readonly Axis[]): ArchetypeId {
  const values = axes.map((axis) => scores[axis]);
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  const spread = Math.max(...values) - Math.min(...values);

  if (average < 35) return "diamante-en-bruto";
  if (spread <= 25) return "todoterreno";

  const byWeapon: Record<Axis, ArchetypeId> = {
    remate: "rematador-explosivo",
    colocacion: "cerebro-de-la-red",
    bloqueo: "muro-en-la-red",
    defensa: "muro-defensivo",
    recepcion: "iman-de-la-recepcion",
    saque: "canon-del-saque",
    salto: "resorte",
  };
  return byWeapon[mainWeapon];
}

export function assess(input: AssessmentInput): AssessmentResult {
  const { scores, jumpEstimated } = computeScores(input);
  const weights = axisWeights(input);
  // Un salto sin medir no puede ser fortaleza ni área a reforzar.
  const axes = jumpEstimated ? RADAR_AXES.filter((axis) => axis !== "salto") : [...RADAR_AXES];

  const strengths = rank(axes, (axis) => scores[axis] * weights[axis]).slice(0, 2);
  const mainWeapon = strengths[0] ?? "remate";

  const priority = (axis: Axis) => (100 - scores[axis]) * weights[axis];
  const candidates = rank(
    axes.filter((axis) => !strengths.includes(axis) && priority(axis) > 0),
    priority,
  );
  const toReinforce = candidates.slice(0, 2);
  const third = candidates[2];
  const second = candidates[1];
  // Tercera área solo si su prioridad está cerca de la segunda (80 % o más).
  if (third && second && priority(third) >= priority(second) * 0.8) toReinforce.push(third);

  const levels = {} as Record<Axis, Level>;
  for (const axis of RADAR_AXES) levels[axis] = scoreLevel(scores[axis]);

  return {
    scores,
    jumpEstimated,
    mainWeapon,
    strengths,
    toReinforce,
    archetype: pickArchetype(scores, mainWeapon, axes),
    levels,
  };
}

export type RecommendationPlan =
  | { kind: "debil"; focus: Axis[] }
  | { kind: "fuerte"; focus: [Axis] }
  | { kind: "equilibrado"; focus: Axis[]; keep: Axis };

/** Qué ejes destaca la recomendación según el rumbo. Cambiar el rumbo cambia el orden. */
export function recommendationPlan(result: AssessmentResult, goal: Goal): RecommendationPlan {
  switch (goal) {
    case "debil":
      return { kind: "debil", focus: result.toReinforce };
    case "fuerte":
      return { kind: "fuerte", focus: [result.mainWeapon] };
    case "equilibrado":
      return { kind: "equilibrado", focus: result.toReinforce.slice(0, 1), keep: result.mainWeapon };
  }
}

/** Ejes que laten en el radar para el rumbo elegido. */
export function highlightedAxes(result: AssessmentResult, goal: Goal): Axis[] {
  const plan = recommendationPlan(result, goal);
  return plan.kind === "equilibrado" ? [plan.keep, ...plan.focus] : plan.focus;
}
