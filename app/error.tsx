"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function ErrorPage({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-start justify-center gap-6 px-4 py-16">
      <h1 className="font-display text-3xl font-bold">Algo ha fallado</h1>
      <p className="text-lg text-muted-foreground">
        No es culpa tuya. Prueba otra vez y, si sigue pasando, vuelve en un rato.
      </p>
      <Button
        type="button"
        size="lg"
        onClick={retry}
        className="min-h-11 rounded-full border-2 border-ink px-6 text-base font-bold"
      >
        Reintentar
      </Button>
    </main>
  );
}
