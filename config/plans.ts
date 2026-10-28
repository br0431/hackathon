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

/**
 * Payment Links de Stripe en modo test (enlaces públicos, no son secretos).
 * El pago todavía no activa el plan dentro de la app: falta el webhook.
 */
export const STRIPE_TEST_PAYMENT_LINKS: Partial<Record<PlanId, string>> = {
  remate: "https://buy.stripe.com/test_28E28jbBM0jae8N3jsbV600",
  ace: "https://buy.stripe.com/test_28EeV58pAaXOfcRcU2bV601",
};

export const DEMO_PAYMENTS_NOTICE =
  "Versión de demostración: Stripe en modo de prueba, no se realiza ningún cobro. Tarjeta de prueba: 4242 4242 4242 4242.";
