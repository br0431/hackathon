import type { Metadata } from "next";

import { DiagnosticClient } from "@/components/diagnostic/diagnostic-client";
import { SiteHeader } from "@/components/site/site-header";
import { HEALTH_NOTICE } from "@/content/recommendations";

export const metadata: Metadata = { title: "Diagnóstico" };

export default function DiagnosticPage() {
  return (
    <>
      <SiteHeader />
      <main id="contenido" className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 sm:px-8">
        <h1 className="sr-only">Diagnóstico de jugador</h1>
        <DiagnosticClient />
        <p className="mt-8 text-center text-sm text-muted-foreground">{HEALTH_NOTICE}</p>
      </main>
    </>
  );
}
