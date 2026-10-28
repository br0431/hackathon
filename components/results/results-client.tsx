"use client";

import Link from "next/link";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { loadAssessment } from "@/lib/assessment/storage";
import { useIsClient } from "@/lib/hooks/use-is-client";

import { ResultsView } from "./results-view";

/** Carga el último diagnóstico guardado y elige el estado: carga, vacío, error o resultado. */
export function ResultsClient() {
  const isClient = useIsClient();
  const loaded = useMemo(() => (isClient ? loadAssessment() : null), [isClient]);

  if (!loaded) {
    return (
      <div aria-busy="true" aria-label="Cargando tu perfil" className="flex flex-col gap-8">
        <div className="h-14 w-2/3 animate-pulse rounded-2xl bg-white" />
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="h-96 animate-pulse rounded-[28px] border-[3px] border-ink/20 bg-white" />
          <div className="h-96 animate-pulse rounded-[28px] border-[3px] border-ink/20 bg-white" />
        </div>
      </div>
    );
  }

  if (loaded.status === "empty") {
    return (
      <StateCard
        title="Todavía no tienes perfil"
        text="Rellena el diagnóstico (unos tres minutos) y aquí verás tu radar, tus fortalezas y por dónde empezar."
        cta="Empezar el diagnóstico"
      />
    );
  }

  if (loaded.status === "invalid") {
    return (
      <StateCard
        title="No hemos podido leer tu diagnóstico"
        text="Los datos guardados están incompletos o son de una versión anterior. Vuelve a hacerlo: no tardarás nada."
        cta="Rehacer el diagnóstico"
      />
    );
  }

  return <ResultsView assessment={loaded.assessment} />;
}

function StateCard({ title, text, cta }: { title: string; text: string; cta: string }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-start gap-5 rounded-[28px] border-[3px] border-ink bg-white p-8 shadow-hard-lg">
      <h1 className="font-display text-4xl font-extrabold">{title}</h1>
      <p className="text-lg text-muted-foreground">{text}</p>
      <Button asChild size="lg">
        <Link href="/diagnostico">{cta}</Link>
      </Button>
    </div>
  );
}
