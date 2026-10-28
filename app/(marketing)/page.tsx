import { CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";
import { connection } from "next/server";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import { BRAND } from "@/config/brand";
import { checkSupabaseHealth } from "@/lib/supabase/health";

// Portada provisional del hito 0: comprueba fuentes, tokens y conexión.
// La landing completa llega en el hito 1.

const SKILL_SWATCHES = [
  { label: "Saque", className: "bg-sun" },
  { label: "Recepción", className: "bg-turquoise" },
  { label: "Colocación", className: "bg-violet" },
  { label: "Remate", className: "bg-coral" },
  { label: "Bloqueo", className: "bg-blue" },
  { label: "Defensa", className: "bg-green" },
  { label: "Salto", className: "bg-magenta" },
] as const;

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-8 px-4 py-16 sm:px-8">
      <p className="inline-flex w-fit items-center gap-2 rounded-full border-2 border-ink bg-white px-4 py-2 text-sm font-bold">
        <span aria-hidden="true" className="size-2.5 rounded-full border-[1.5px] border-ink bg-turquoise" />
        Hito 0 · base del proyecto
      </p>

      <div className="flex flex-col gap-4">
        <h1 className="font-display text-6xl leading-none font-extrabold tracking-tight sm:text-7xl">{BRAND.name}</h1>
        <p className="max-w-xl text-lg text-muted-foreground sm:text-xl">{BRAND.tagline}</p>
      </div>

      <ul aria-label="Colores por habilidad" className="flex flex-wrap gap-2">
        {SKILL_SWATCHES.map((skill) => (
          <li
            key={skill.label}
            className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white py-1 pr-3 pl-1.5 text-sm font-medium"
          >
            <span aria-hidden="true" className={`size-4 rounded-full border-[1.5px] border-ink ${skill.className}`} />
            {skill.label}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center gap-4">
        <Button
          asChild
          size="lg"
          className="min-h-11 rounded-full border-2 border-ink px-6 text-base font-bold shadow-hard"
        >
          <a href="/api/health">Comprobar conexión</a>
        </Button>
        <Suspense fallback={<SupabaseStatusChip status="loading" />}>
          <SupabaseStatus />
        </Suspense>
      </div>
    </main>
  );
}

async function SupabaseStatus() {
  await connection();
  const status = await checkSupabaseHealth();
  return <SupabaseStatusChip status={status} />;
}

const STATUS_COPY = {
  loading: { text: "Comprobando Supabase…", Icon: LoaderCircle, className: "bg-white", iconClassName: "animate-spin" },
  ok: { text: "Supabase conectado", Icon: CircleCheck, className: "bg-turquoise", iconClassName: "" },
  error: { text: "Supabase no responde", Icon: CircleAlert, className: "bg-sun", iconClassName: "" },
} as const;

function SupabaseStatusChip({ status }: { status: keyof typeof STATUS_COPY }) {
  const { text, Icon, className, iconClassName } = STATUS_COPY[status];
  return (
    <p
      role="status"
      data-testid="supabase-status"
      data-status={status}
      className={`inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-ink px-4 text-sm font-bold ${className}`}
    >
      <Icon aria-hidden="true" className={`size-4 ${iconClassName}`} />
      {text}
    </p>
  );
}
