import Link from "next/link";

import { PlanCards } from "@/components/plans/plan-cards";
import { Radar } from "@/components/radar/radar";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/config/brand";
import { AXIS_META } from "@/config/skills";
import { GOAL_COPY } from "@/content/recommendations";
import { GOALS, RADAR_AXES } from "@/lib/scoring/types";

// Mismos valores que el perfil de ejemplo de resultados (docs/DESIGN.md §3).
const EXAMPLE = { remate: 100, bloqueo: 75, saque: 75, defensa: 25, recepcion: 25, colocacion: 50, salto: 80 };

const STEPS = [
  {
    title: "Cuéntanos cómo eres",
    text: "Altura, peso, salto vertical y tu posición. Después, una nota del 1 al 5 para cada una de tus seis habilidades.",
  },
  {
    title: "Mira tu perfil",
    text: "Un radar con tus puntos fuertes, tus áreas a reforzar y un perfil de jugador que te pone nombre.",
  },
  {
    title: "Entrena lo que importa",
    text: "Elige tu rumbo y recibe la recomendación. Con un plan de pago, ejercicios animados y un plan semanal.",
  },
];

const FAQ = [
  {
    q: "¿Tengo que tener mucho nivel?",
    a: `No. ${BRAND.name} es para todos los niveles, desde quien está empezando hasta quien compite en liga. La recomendación se adapta a tus datos y a tu posición.`,
  },
  {
    q: "¿Qué datos me pedís?",
    a: "Tu edad, tu altura, tu peso, tu salto vertical, tu posición y una nota del 1 al 5 en saque, recepción, colocación, remate, bloqueo y defensa. Rellenarlo lleva unos tres minutos.",
  },
  {
    q: "¿Puedo cambiar de plan o cancelar?",
    a: "Sí, desde tu cuenta. Si cancelas, conservas tu plan hasta el final del periodo y después vuelves a Saque sin perder tus datos.",
  },
  {
    q: "¿Sustituye a mi entrenador?",
    a: "No. Las recomendaciones te orientan, pero no sustituyen a un entrenador ni a un profesional sanitario.",
  },
];

const GOAL_COLORS = { debil: "bg-coral", fuerte: "bg-sun", equilibrado: "bg-turquoise" } as const;

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="contenido" className="flex flex-col">
        {/* HÉROE */}
        <section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 pt-6 pb-20 sm:px-8 lg:grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col items-start gap-7">
            <span className="inline-flex items-center gap-2.5 rounded-full border-2 border-ink bg-white px-4 py-2 text-sm font-bold">
              <span aria-hidden="true" className="size-2.5 rounded-full border-[1.5px] border-ink bg-turquoise" />
              Voleibol · todos los niveles
            </span>
            <h1 className="font-display text-[clamp(2.6rem,6.4vw,4.9rem)] leading-[1.04] font-extrabold tracking-tight">
              Descubre tu perfil de jugador. <span className="text-violet">Entrena lo que te falta.</span>
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground sm:text-xl">
              Cuéntanos tu altura, tu peso, tu salto vertical, tu posición y cómo juegas cada habilidad. Te devolvemos
              un radar con tus puntos fuertes, tus puntos débiles y por dónde empezar.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button asChild size="lg">
                <Link href="/diagnostico">Descubre tu perfil en 3 minutos</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/planes">Ver los planes</Link>
              </Button>
            </div>
            <p className="text-sm font-medium text-muted-foreground">Empieza gratis, sin tarjeta.</p>
          </div>

          <div className="relative rounded-[28px] border-[3px] border-ink bg-white p-5 shadow-hard-lg sm:p-7">
            <span
              aria-hidden="true"
              className="alza-ball absolute -top-6 right-8 size-12 rounded-full border-[3px] border-ink bg-sun"
            />
            <p className="text-sm font-bold tracking-wide text-muted-foreground uppercase">Perfil de ejemplo</p>
            <p className="font-display text-3xl font-extrabold">Rematador explosivo</p>
            <Radar values={EXAMPLE} label="Radar de ejemplo" className="mt-2 w-full" />
            <div className="flex flex-wrap gap-2 text-sm font-bold">
              <span className="rounded-full border-2 border-ink bg-coral px-3 py-1">Arma principal: remate</span>
              <span className="rounded-full border-2 border-ink bg-bg px-3 py-1">A reforzar: recepción y defensa</span>
            </div>
          </div>
        </section>

        {/* BANDA DE EJES */}
        <section aria-labelledby="ejes" className="border-y-[3px] border-ink bg-ink py-8 text-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:px-8">
            <h2 id="ejes" className="font-display text-2xl font-bold">
              Siete ejes, un solo perfil
            </h2>
            <ul className="flex flex-wrap gap-3">
              {RADAR_AXES.map((axis) => (
                <li
                  key={axis}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-white bg-white px-4 py-2 font-bold text-ink"
                >
                  <span
                    aria-hidden="true"
                    className={`size-4 rounded-full border-2 border-ink ${AXIS_META[axis].bg}`}
                  />
                  {AXIS_META[axis].label}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CÓMO FUNCIONA */}
        <section id="como-funciona" className="mx-auto w-full max-w-6xl scroll-mt-8 px-4 py-20 sm:px-8">
          <p className="font-bold text-violet">Cómo funciona</p>
          <h2 className="font-display text-4xl font-extrabold sm:text-5xl">
            Tres minutos para saber por dónde empezar
          </h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                className="flex flex-col gap-3 rounded-3xl border-[3px] border-ink bg-white p-6 shadow-hard"
              >
                <span className="inline-flex size-12 items-center justify-center rounded-full border-2 border-ink bg-sun font-display text-2xl font-extrabold">
                  {i + 1}
                </span>
                <h3 className="font-display text-2xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* RUMBO */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-8">
            <p className="font-bold text-violet">Tu objetivo</p>
            <h2 className="font-display text-4xl font-extrabold sm:text-5xl">Tú eliges el rumbo</h2>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
              Con los mismos datos, la recomendación cambia según lo que quieras conseguir.
            </p>
            <ul className="mt-10 grid gap-6 md:grid-cols-3">
              {GOALS.map((goal) => (
                <li key={goal} className="flex flex-col gap-3 rounded-3xl border-[3px] border-ink bg-bg p-6">
                  <span
                    aria-hidden="true"
                    className={`inline-flex size-12 items-center justify-center rounded-full border-2 border-ink text-2xl font-extrabold ${GOAL_COLORS[goal]}`}
                  >
                    {GOAL_COPY[goal].mark}
                  </span>
                  <h3 className="font-display text-2xl font-bold">{GOAL_COPY[goal].name}</h3>
                  <p className="text-muted-foreground">{GOAL_COPY[goal].description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* PLANES */}
        <section id="planes" className="mx-auto w-full max-w-6xl scroll-mt-8 px-4 py-20 sm:px-8">
          <p className="font-bold text-violet">Planes</p>
          <h2 className="mb-12 font-display text-4xl font-extrabold sm:text-5xl">Tres planes. Empieza gratis.</h2>
          <PlanCards />
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto w-full max-w-3xl scroll-mt-8 px-4 pb-20 sm:px-8">
          <h2 className="mb-8 font-display text-4xl font-extrabold">Preguntas frecuentes</h2>
          <div className="flex flex-col gap-4">
            {FAQ.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border-[3px] border-ink bg-white px-5 open:shadow-hard"
              >
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span aria-hidden="true" className="text-2xl transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="pb-5 text-muted-foreground">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="border-t-[3px] border-ink bg-violet py-20 text-white">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 text-center">
            <h2 className="font-display text-4xl font-extrabold sm:text-5xl">
              Tu perfil de jugador está a tres minutos
            </h2>
            <p className="text-lg">Rellena el diagnóstico y descubre en qué eres fuerte y qué te falta.</p>
            <Button asChild size="lg" variant="sun">
              <Link href="/diagnostico">Empezar el diagnóstico</Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
