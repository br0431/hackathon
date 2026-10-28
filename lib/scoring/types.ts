export const SKILLS = ["saque", "recepcion", "colocacion", "remate", "bloqueo", "defensa"] as const;
export type Skill = (typeof SKILLS)[number];

/** Los siete ejes del radar: las seis habilidades y el salto. */
export type Axis = Skill | "salto";

/** Orden de los ejes en el radar, en sentido horario desde arriba (docs/DESIGN.md §5). */
export const RADAR_AXES = [
  "remate",
  "bloqueo",
  "saque",
  "defensa",
  "recepcion",
  "colocacion",
  "salto",
] as const satisfies readonly Axis[];

export const POSITIONS = ["colocador", "opuesto", "receptor", "central", "libero", "nose"] as const;
export type Position = (typeof POSITIONS)[number];

export const GOALS = ["debil", "fuerte", "equilibrado"] as const;
export type Goal = (typeof GOALS)[number];

export type Rating = 1 | 2 | 3 | 4 | 5;

export type AssessmentInput = {
  age: number;
  heightCm: number;
  weightKg: number;
  /** null cuando el jugador marca "no lo sé". */
  verticalJumpCm: number | null;
  position: Position;
  skills: Record<Skill, Rating>;
  goal: Goal;
  weeklyDays: number;
};

export type Level = "bajo" | "medio" | "alto";

export type ArchetypeId =
  | "rematador-explosivo"
  | "cerebro-de-la-red"
  | "muro-en-la-red"
  | "muro-defensivo"
  | "iman-de-la-recepcion"
  | "canon-del-saque"
  | "resorte"
  | "todoterreno"
  | "diamante-en-bruto";

export type AssessmentResult = {
  /** Puntuación 0–100 de cada eje. */
  scores: Record<Axis, number>;
  /** true si el salto no se ha medido y se muestra un valor neutro. */
  jumpEstimated: boolean;
  /** Eje con mayor puntuación × peso de la posición. */
  mainWeapon: Axis;
  /** Las dos mayores puntuaciones × peso (la primera es el arma principal). */
  strengths: Axis[];
  /** Las 2 o 3 mayores prioridades de refuerzo, de mayor a menor. */
  toReinforce: Axis[];
  archetype: ArchetypeId;
  levels: Record<Axis, Level>;
};
