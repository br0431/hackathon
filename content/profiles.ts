import type { ArchetypeId } from "@/lib/scoring/types";

/** Catálogo de perfiles de jugador. La regla de asignación está en lib/scoring (pickArchetype). */
export const ARCHETYPES: Record<ArchetypeId, { name: string; description: string }> = {
  "rematador-explosivo": {
    name: "Rematador explosivo",
    description: "Pegas fuerte y atacas con decisión. Tu margen está en lo que pasa antes del remate.",
  },
  "cerebro-de-la-red": {
    name: "Cerebro de la red",
    description: "Lees el juego y repartes buenos balones. Tu equipo juega mejor cuando tocas tú.",
  },
  "muro-en-la-red": {
    name: "Muro en la red",
    description: "Cierras la red y obligas al rival a pensar dos veces cada ataque.",
  },
  "muro-defensivo": {
    name: "Muro defensivo",
    description: "Llegas a balones que parecían perdidos. Contigo, nada cae fácil.",
  },
  "iman-de-la-recepcion": {
    name: "Imán de la recepción",
    description: "El primer toque es tu terreno: tu recepción hace que tu equipo pueda construir.",
  },
  "canon-del-saque": {
    name: "Cañón del saque",
    description: "Tu saque abre el punto. Cada vez que sacas, el rival tiene un problema.",
  },
  resorte: {
    name: "Resorte",
    description: "Tu salto es tu seña de identidad. Ahora toca convertirlo en puntos.",
  },
  todoterreno: {
    name: "Todoterreno",
    description: "Te defiendes en todo. Eres la pieza que encaja en cualquier rotación.",
  },
  "diamante-en-bruto": {
    name: "Diamante en bruto",
    description: "Estás empezando y tienes todo por delante. Cada sesión se va a notar.",
  },
};
