/** Única fuente de verdad de precios y permisos de cada plan (docs/PRD.md, planes y precios). */
export const PLANS = [
  {
    id: "saque",
    name: "Saque",
    tagline: "Para descubrir tu perfil.",
    priceEur: 0,
    features: [
      "Diagnóstico y radar de habilidades",
      "Fortalezas, áreas a reforzar y perfil de jugador",
      "Consejos básicos por habilidad",
      "Vista previa de ejercicios",
    ],
    highlighted: false,
  },
  {
    id: "remate",
    name: "Remate",
    tagline: "Para entrenar con ejercicios y plan.",
    priceEur: 10,
    features: [
      "Todo lo de Saque",
      "Biblioteca de ejercicios con animaciones",
      "Plan semanal personalizado",
      "Historial y comparativa de tus evaluaciones",
    ],
    highlighted: true,
  },
  {
    id: "ace",
    name: "Ace",
    tagline: "Para competir con profesionales.",
    priceEur: 30,
    features: [
      "Todo lo de Remate",
      "Plan avanzado de 4 a 8 semanas con ajuste semanal",
      "2 sesiones online de 45 minutos al mes con profesionales",
    ],
    highlighted: false,
  },
] as const;

export type PlanId = (typeof PLANS)[number]["id"];

export const DEMO_PAYMENTS_NOTICE = "Versión de demostración: los pagos son simulados y no se realiza ningún cobro.";
