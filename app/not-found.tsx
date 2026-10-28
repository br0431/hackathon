import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-start justify-center gap-6 px-4 py-16">
      <p className="font-display text-7xl font-extrabold">404</p>
      <h1 className="font-display text-3xl font-bold">Esta página se ha ido fuera</h1>
      <p className="text-lg text-muted-foreground">
        La dirección no existe o ha cambiado. Vuelve al inicio y sigue jugando.
      </p>
      <Button asChild size="lg" className="min-h-11 rounded-full border-2 border-ink px-6 text-base font-bold">
        <Link href="/">Volver al inicio</Link>
      </Button>
    </main>
  );
}
