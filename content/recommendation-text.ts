import type { AssessmentResult, Axis, Goal } from "@/lib/scoring/types";
import { recommendationPlan } from "@/lib/scoring";

import { ADVICE } from "./recommendations";
import { AXIS_NOUN } from "./skills-nouns";

export type RecommendationText = { title: string; body: string; items: string[] };

const join = (axes: Axis[]) => {
  const nouns = axes.map((axis) => AXIS_NOUN[axis].bare);
  if (nouns.length <= 1) return nouns[0] ?? "";
  return `${nouns.slice(0, -1).join(", ")} y ${nouns.at(-1)}`;
};

/** Texto de la recomendación según el rumbo. Plantillas por eje y nivel, sin IA. */
export function recommendationText(result: AssessmentResult, goal: Goal): RecommendationText {
  const plan = recommendationPlan(result, goal);
  const advice = (axis: Axis) => ADVICE[axis][result.levels[axis]];

  if (plan.kind === "debil") {
    const [first, second, third] = plan.focus;
    if (!first) {
      return {
        title: "No vemos un punto débil claro",
        body: "Tu perfil está muy alto en todo. Prueba el rumbo «Potenciar lo fuerte» para seguir afinando.",
        items: [],
      };
    }
    const items = [
      advice(first).tips[0],
      second ? advice(second).tips[0] : advice(first).tips[1],
      third ? advice(third).tips[0] : advice(first).tips[2],
    ];
    return {
      title: `Prioridad: ${join(plan.focus)}`,
      body: `Con tu posición, son las áreas donde más margen tienes. ${advice(first).why}`,
      items,
    };
  }

  if (plan.kind === "fuerte") {
    const [weapon] = plan.focus;
    return {
      title: `Tu arma principal: ${AXIS_NOUN[weapon].withArticle}`,
      body: advice(weapon).why,
      items: [...advice(weapon).tips],
    };
  }

  const [focus] = plan.focus;
  if (!focus) return recommendationText(result, "fuerte");
  return {
    title: `Mejora ${AXIS_NOUN[focus].withArticle} sin soltar ${AXIS_NOUN[plan.keep].withArticle}`,
    body: "Combinamos tu área de mejora con sesiones cortas que mantienen tu arma afilada.",
    items: [advice(focus).tips[0], advice(focus).tips[1], advice(plan.keep).tips[0]],
  };
}
