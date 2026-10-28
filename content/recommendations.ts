import type { Axis, Level } from "@/lib/scoring/types";

type Advice = { why: string; tips: [string, string, string] };

/**
 * Plantillas de consejo por eje y nivel (docs/PRD.md: sin IA en tiempo real).
 * Tono: cercano, directo, de entrenador amable. Nunca se juzga el cuerpo.
 */
export const ADVICE: Record<Axis, Record<Level, Advice>> = {
  saque: {
    bajo: {
      why: "Un saque seguro te da puntos gratis y quita presión al equipo.",
      tips: [
        "Saque de abajo a una zona fija, 20 seguidos",
        "Lanzamiento del balón siempre a la misma altura",
        "Pasa la red 8 de cada 10 antes de meter fuerza",
      ],
    },
    medio: {
      why: "Ya sacas seguro: el siguiente paso es elegir dónde.",
      tips: [
        "Saque a zonas 1, 6 y 5 por series",
        "Saque flotante con la muñeca firme",
        "Rutina previa al saque igual en cada punto",
      ],
    },
    alto: {
      why: "Tu saque es un arma: hazlo más difícil de leer.",
      tips: [
        "Alterna flotante y potente con el mismo gesto",
        "Saque a la línea de los receptores débiles",
        "Series bajo fatiga para mantenerlo en el quinto set",
      ],
    },
  },
  recepcion: {
    bajo: {
      why: "Un primer toque fiable es lo que más ayuda a todo tu equipo.",
      tips: [
        "Plataforma de recepción estable",
        "Pies quietos antes del contacto",
        "Recepción de balones lanzados a mano",
      ],
    },
    medio: {
      why: "Recibes bien lo fácil; ahora toca el saque que aprieta.",
      tips: ["Lectura del saque rival", "Recepción en movimiento lateral", "Recibir saques flotantes por series"],
    },
    alto: {
      why: "Tu recepción es fiable: conviértete en la referencia.",
      tips: [
        "Recepción de saque potente en salto",
        "Cubrir más zona del campo",
        "Comunicar quién recibe antes del saque",
      ],
    },
  },
  colocacion: {
    bajo: {
      why: "Unos dedos limpios te abren muchas opciones en el juego.",
      tips: [
        "Dedos contra la pared, 50 seguidos",
        "Colocación alta a la banda",
        "Posición de manos en forma de triángulo",
      ],
    },
    medio: {
      why: "Colocas con altura: ahora gana precisión y ritmo.",
      tips: ["Colocación a zona 4 y zona 2 alternas", "Colocar después de desplazarse", "Balón más rápido al central"],
    },
    alto: {
      why: "Diriges el juego: es momento de engañar al bloqueo.",
      tips: ["Colocación en salto", "Segunda intención por sorpresa", "Lectura del bloqueo antes de colocar"],
    },
  },
  remate: {
    bajo: {
      why: "Coordinar carrera y golpeo es la base de todo ataque.",
      tips: ["Aproximación en tres pasos sin balón", "Golpeo contra la pared", "Remate de balón lanzado alto"],
    },
    medio: {
      why: "Ya rematas con potencia: añade dirección.",
      tips: ["Remate a la diagonal y a la línea", "Aproximación explosiva", "Golpeo con la muñeca para dirigir"],
    },
    alto: {
      why: "Tienes la base para llevar tu remate a otro nivel.",
      tips: ["Remate con distintos ángulos", "Golpeo contra bloqueo", "Ataque desde zaguero"],
    },
  },
  bloqueo: {
    bajo: {
      why: "Un buen bloqueo empieza por los pies, no por las manos.",
      tips: [
        "Desplazamiento lateral junto a la red",
        "Salto con manos arriba sin tocar la red",
        "Saltar después del atacante, no a la vez",
      ],
    },
    medio: {
      why: "Llegas a tiempo: ahora pasa las manos y cierra.",
      tips: ["Pasar las manos al campo rival", "Bloqueo doble coordinado", "Mirar al colocador antes de moverse"],
    },
    alto: {
      why: "Tu bloqueo condiciona al rival: afina la lectura.",
      tips: ["Lectura del colocador", "Bloqueo de opción contra el central", "Transición rápida del bloqueo al ataque"],
    },
  },
  defensa: {
    bajo: {
      why: "Defender es posición y actitud antes que técnica.",
      tips: ["Posición baja de espera", "Desplazamientos laterales en defensa", "Defensa de balones lanzados a mano"],
    },
    medio: {
      why: "Levantas lo que viene a ti; ahora amplía tu radio.",
      tips: ["Lectura del brazo del atacante", "Caída y recuperación segura", "Defensa con una mano"],
    },
    alto: {
      why: "Eres un seguro atrás: convierte cada defensa en contraataque.",
      tips: ["Defensa dirigida a la colocadora", "Cobertura del propio ataque", "Defensa de remates desde zaguero"],
    },
  },
  salto: {
    bajo: {
      why: "El salto mejora mucho con técnica y fuerza básica, a cualquier edad.",
      tips: ["Técnica de batida con brazos", "Sentadilla con tu propio peso", "Saltos suaves a la comba"],
    },
    medio: {
      why: "Tu salto ya es útil: hazlo más rápido y repetible.",
      tips: ["Saltos al cajón bajo", "Aproximación con la última zancada larga", "Saltos repetidos con buena caída"],
    },
    alto: {
      why: "Saltas mucho: aprovéchalo en ataque y bloqueo.",
      tips: ["Aproximación explosiva", "Mantener el salto con fatiga", "Trabajo de caída para cuidar rodillas"],
    },
  },
};

export const GOAL_COPY = {
  debil: {
    name: "Reforzar lo débil",
    description: "Prioriza las dos o tres áreas donde más margen tienes.",
    mark: "+",
  },
  fuerte: {
    name: "Potenciar lo fuerte",
    description: "Convierte tu mejor habilidad en tu arma principal.",
    mark: "★",
  },
  equilibrado: {
    name: "Equilibrado",
    description: "Mejora lo que te frena sin descuidar lo que te distingue.",
    mark: "=",
  },
} as const;

export const HEALTH_NOTICE = "Las recomendaciones no sustituyen a un entrenador ni a un profesional sanitario.";

export const MINOR_NOTICE =
  "Tienes menos de 18 años: entrena con cargas moderadas y consulta los ejercicios con tu entrenador.";
