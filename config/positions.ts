import type { Axis, Position } from "@/lib/scoring/types";

// TODO validar con entrenador: pesos provisionales por posición.
// 1 = peso neutro; más de 1 = la habilidad cuenta más en esa posición.
export const POSITION_WEIGHTS: Record<Position, Record<Axis, number>> = {
  colocador: { colocacion: 1.5, saque: 1.2, defensa: 1.0, recepcion: 0.9, bloqueo: 0.8, remate: 0.7, salto: 0.8 },
  opuesto: { remate: 1.5, bloqueo: 1.3, salto: 1.2, saque: 1.1, defensa: 0.9, colocacion: 0.7, recepcion: 0.6 },
  receptor: { recepcion: 1.3, remate: 1.3, defensa: 1.1, saque: 1.0, salto: 1.0, bloqueo: 0.9, colocacion: 0.7 },
  central: { bloqueo: 1.5, remate: 1.3, salto: 1.3, saque: 0.9, defensa: 0.6, colocacion: 0.6, recepcion: 0.5 },
  // El líbero no saca, no remata por encima de la red ni bloquea: esos ejes casi no cuentan.
  libero: { recepcion: 1.5, defensa: 1.5, colocacion: 0.9, salto: 0.4, saque: 0.1, remate: 0.1, bloqueo: 0.1 },
  nose: { saque: 1, recepcion: 1, colocacion: 1, remate: 1, bloqueo: 1, defensa: 1, salto: 1 },
};

// TODO validar con entrenador: altura de referencia (cm) a partir de la cual la altura
// ya no se compensa con salto. Solo ajusta prioridades; nunca se juzga ni se muestra.
export const POSITION_REFERENCE_HEIGHT_CM: Record<Position, number | null> = {
  colocador: null,
  opuesto: 188,
  receptor: 185,
  central: 192,
  libero: null,
  nose: null,
};

/** Cuánto sube el peso del salto si el jugador está por debajo de la altura de referencia. */
export const JUMP_WEIGHT_BOOST_BELOW_REFERENCE = 0.2;

export const POSITION_LABELS: Record<Position, { name: string; description: string }> = {
  colocador: { name: "Colocador", description: "Dirige el ataque del equipo" },
  opuesto: { name: "Opuesto", description: "Remata desde la zona 2" },
  receptor: { name: "Receptor-atacante", description: "Recibe y remata" },
  central: { name: "Central", description: "Bloquea y remata rápido" },
  libero: { name: "Líbero", description: "Especialista en recepción y defensa" },
  nose: { name: "Aún no lo sé", description: "Sin posición fija todavía" },
};
