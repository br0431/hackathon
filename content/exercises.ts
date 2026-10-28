import type { Axis } from "@/lib/scoring/types";

/**
 * Vista previa de ejercicios (solo título, eje y duración): lo que ve el plan gratuito.
 * Los pasos y la animación llegan en el hito 5 y solo para Remate y Ace.
 */
export const EXERCISE_PREVIEWS: { slug: string; title: string; axis: Axis; durationMin: number }[] = [
  { slug: "plataforma-estable", title: "Plataforma estable en la recepción", axis: "recepcion", durationMin: 10 },
  { slug: "lectura-saque", title: "Lectura del saque rival", axis: "recepcion", durationMin: 12 },
  { slug: "desplazamiento-lateral", title: "Desplazamiento lateral en defensa", axis: "defensa", durationMin: 12 },
  { slug: "posicion-espera", title: "Posición baja de espera", axis: "defensa", durationMin: 8 },
  { slug: "aproximacion-explosiva", title: "Aproximación explosiva en tres pasos", axis: "remate", durationMin: 15 },
  { slug: "remate-angulos", title: "Remate con distintos ángulos", axis: "remate", durationMin: 15 },
  { slug: "saque-zonas", title: "Saque a zonas por series", axis: "saque", durationMin: 10 },
  { slug: "saque-flotante", title: "Saque flotante con muñeca firme", axis: "saque", durationMin: 10 },
  { slug: "dedos-pared", title: "Dedos contra la pared", axis: "colocacion", durationMin: 8 },
  { slug: "colocacion-bandas", title: "Colocación alterna a las bandas", axis: "colocacion", durationMin: 12 },
  { slug: "pasar-manos", title: "Pasar las manos en el bloqueo", axis: "bloqueo", durationMin: 10 },
  { slug: "desplazamiento-red", title: "Desplazamiento lateral junto a la red", axis: "bloqueo", durationMin: 10 },
  { slug: "batida-brazos", title: "Técnica de batida con brazos", axis: "salto", durationMin: 10 },
  { slug: "saltos-cajon", title: "Saltos al cajón bajo", axis: "salto", durationMin: 12 },
];
