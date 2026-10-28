"use client";

import { useIsClient } from "@/lib/hooks/use-is-client";

import { DiagnosticWizard } from "./diagnostic-wizard";

/** El asistente lee el borrador guardado, así que solo se pinta en el navegador. */
export function DiagnosticClient() {
  const isClient = useIsClient();
  if (!isClient) {
    return (
      <div aria-busy="true" aria-label="Cargando el diagnóstico" className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="order-2 h-[560px] animate-pulse rounded-[28px] border-[3px] border-ink/20 bg-white lg:order-1" />
        <div className="order-1 h-80 animate-pulse rounded-[28px] border-[3px] border-ink/20 bg-white lg:order-2" />
      </div>
    );
  }
  return <DiagnosticWizard />;
}
