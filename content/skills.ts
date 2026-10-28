import type { Skill } from "@/lib/scoring/types";

/**
 * Descripción concreta de cada nota (1–5) por habilidad, para que la autoevaluación
 * sea más honesta (docs/PRD.md, campos del formulario).
 */
export const SKILL_COPY: Record<Skill, { hint: string; levels: [string, string, string, string, string] }> = {
  saque: {
    hint: "Potencia y precisión al servir",
    levels: [
      "Todavía me cuesta pasar la red de forma regular.",
      "Paso la red casi siempre, pero sin elegir zona.",
      "Saco seguro y a veces elijo la zona.",
      "Pongo en apuros a la recepción en partido.",
      "Mi saque gana puntos directos con frecuencia.",
    ],
  },
  recepcion: {
    hint: "Controlar el primer toque",
    levels: [
      "Me cuesta que el balón vaya hacia arriba.",
      "Recibo saques fáciles, los fuertes se me escapan.",
      "Dejo el balón jugable en la mayoría de saques.",
      "Pongo el balón en la colocadora bajo presión.",
      "Mi equipo me busca para recibir los saques difíciles.",
    ],
  },
  colocacion: {
    hint: "Dar buenos balones al atacante",
    levels: [
      "Hago dedos con dificultad y el balón sale girando.",
      "Coloco balones altos si me llega bien la recepción.",
      "Coloco con altura y dirección a las bandas.",
      "Varío el tempo y engaño al bloqueo a veces.",
      "Dirijo el ataque y leo el bloqueo rival.",
    ],
  },
  remate: {
    hint: "Golpear con fuerza y dirección",
    levels: [
      "Me cuesta coordinar la carrera con el golpeo.",
      "Remato balones fáciles, sin mucha potencia.",
      "Remato con potencia cuando la colocación es buena.",
      "Elijo dirección y remato contra bloqueo en partido.",
      "Soy la primera opción de ataque de mi equipo.",
    ],
  },
  bloqueo: {
    hint: "Cerrar la red al rival",
    levels: [
      "Salto tarde o lejos de la red.",
      "Llego a tiempo a veces, sin pasar las manos.",
      "Cierro bien la línea cuando el ataque es lento.",
      "Leo al colocador y llego a bloqueos dobles.",
      "Mi bloqueo cambia cómo ataca el rival.",
    ],
  },
  defensa: {
    hint: "Levantar balones difíciles",
    levels: [
      "Me cuesta reaccionar a los ataques.",
      "Defiendo balones que vienen hacia mí.",
      "Me coloco bien y levanto ataques medios.",
      "Leo el remate y llego a balones difíciles.",
      "Saco balones imposibles con frecuencia.",
    ],
  },
};
