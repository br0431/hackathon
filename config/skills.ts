import type { Axis } from "@/lib/scoring/types";

/**
 * Un color por eje, siempre el mismo en radar, etiquetas y filtros (docs/DESIGN.md §1).
 * El color nunca va solo: siempre acompaña al nombre del eje.
 * Las clases están escritas completas para que Tailwind las detecte.
 */
export const AXIS_META: Record<Axis, { label: string; color: string; bg: string; border: string }> = {
  saque: { label: "Saque", color: "#FFC933", bg: "bg-sun", border: "border-sun" },
  recepcion: { label: "Recepción", color: "#18D4C0", bg: "bg-turquoise", border: "border-turquoise" },
  colocacion: { label: "Colocación", color: "#6C3BFF", bg: "bg-violet", border: "border-violet" },
  remate: { label: "Remate", color: "#FF5A36", bg: "bg-coral", border: "border-coral" },
  bloqueo: { label: "Bloqueo", color: "#2F7BFF", bg: "bg-blue", border: "border-blue" },
  defensa: { label: "Defensa", color: "#35C76B", bg: "bg-green", border: "border-green" },
  salto: { label: "Salto", color: "#E83E8C", bg: "bg-magenta", border: "border-magenta" },
};
