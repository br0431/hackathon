import type { Axis } from "@/lib/scoring/types";

/** Nombres en minúscula, con y sin artículo, para construir frases. */
export const AXIS_NOUN: Record<Axis, { bare: string; withArticle: string }> = {
  saque: { bare: "saque", withArticle: "el saque" },
  recepcion: { bare: "recepción", withArticle: "la recepción" },
  colocacion: { bare: "colocación", withArticle: "la colocación" },
  remate: { bare: "remate", withArticle: "el remate" },
  bloqueo: { bare: "bloqueo", withArticle: "el bloqueo" },
  defensa: { bare: "defensa", withArticle: "la defensa" },
  salto: { bare: "salto", withArticle: "el salto" },
};
