import type { Position } from "@/lib/scoring/types";

// TODO validar con entrenador: tablas de salto vertical provisionales.
// El salto se puntúa de 0 a 100 entre `floorCm` (0 puntos) y `topCm` (100 puntos).
// La base (20–90 cm) sale de docs/DESIGN.md: (salto - 20) / 70 * 100.
export const JUMP_BASE = { floorCm: 20, topCm: 90 } as const;

/** Ajuste del techo por posición: un central necesita más salto que un líbero para el mismo 100. */
export const JUMP_TOP_BY_POSITION: Record<Position, number> = {
  colocador: 80,
  opuesto: 90,
  receptor: 88,
  central: 92,
  libero: 70,
  nose: 85,
};

/** Factor por edad aplicado a la escala: con 14 o con 50 años, el mismo salto puntúa más. */
export const JUMP_AGE_FACTORS: { maxAge: number; factor: number }[] = [
  { maxAge: 15, factor: 0.8 },
  { maxAge: 17, factor: 0.9 },
  { maxAge: 34, factor: 1 },
  { maxAge: 44, factor: 0.9 },
  { maxAge: 60, factor: 0.8 },
];

/** Puntuación neutra cuando el jugador no sabe su salto. */
export const JUMP_UNKNOWN_SCORE = 50;
