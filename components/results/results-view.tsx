"use client";

import { Clock, RotateCcw } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Confetti } from "@/components/motion/confetti";
import { CountUp } from "@/components/motion/count-up";
import { StampBadge } from "@/components/motion/stamp-badge";
import { PlanGate } from "@/components/plan-gate/plan-gate";
import { Radar } from "@/components/radar/radar";
import { Button } from "@/components/ui/button";
import { POSITION_LABELS } from "@/config/positions";
import { AXIS_META } from "@/config/skills";
import { EXERCISE_PREVIEWS } from "@/content/exercises";
import { ARCHETYPES } from "@/content/profiles";
import { recommendationText } from "@/content/recommendation-text";
import { GOAL_COPY, HEALTH_NOTICE, MINOR_NOTICE } from "@/content/recommendations";
import type { StoredAssessment } from "@/lib/assessment/storage";
import { easeOutCubic, useProgress, usePrefersReducedMotion } from "@/lib/hooks/motion";
import { assess, highlightedAxes } from "@/lib/scoring";
import { GOALS, RADAR_AXES, type Axis, type Goal } from "@/lib/scoring/types";

const TAG_STYLES = {
  "Arma principal": "bg-coral",
  Fortaleza: "bg-turquoise",
  "A reforzar": "bg-[#EFE9FF]",
} as const;

export function ResultsView({ assessment }: { assessment: StoredAssessment }) {
  const { input } = assessment;
  const result = useMemo(() => assess(input), [input]);
  const [goal, setGoal] = useState<Goal>(input.goal);
  const [replay, setReplay] = useState(0);
  const reduce = usePrefersReducedMotion();
  const archetype = ARCHETYPES[result.archetype];
  const text = recommendationText(result, goal);
  const pulse = highlightedAxes(result, goal);
  const barsProgress = useProgress(1700, replay);

  const tagFor = (axis: Axis): keyof typeof TAG_STYLES | null => {
    if (axis === result.mainWeapon) return "Arma principal";
    if (result.strengths.includes(axis)) return "Fortaleza";
    if (result.toReinforce.includes(axis)) return "A reforzar";
    return null;
  };

  const sorted = [...RADAR_AXES].sort((a, b) => result.scores[b] - result.scores[a]);
  const focusAxes = goal === "fuerte" ? [result.mainWeapon] : [...result.toReinforce, result.mainWeapon];
  const exercises = focusAxes
    .flatMap((axis) => EXERCISE_PREVIEWS.filter((exercise) => exercise.axis === axis).slice(0, 1))
    .slice(0, 3);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-bold text-violet">Tu diagnóstico</p>
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl">Este es tu perfil de jugador</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="secondary" onClick={() => setReplay((n) => n + 1)}>
            <RotateCcw aria-hidden="true" /> Ver otra vez
          </Button>
          <Button asChild variant="secondary">
            <Link href="/diagnostico">Rehacer diagnóstico</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <section
          aria-label="Radar"
          className="rounded-[28px] border-[3px] border-ink bg-white p-4 shadow-hard-lg sm:p-6"
        >
          <Radar
            values={result.scores}
            replayKey={replay}
            pulse={pulse}
            showValues
            label="Tu radar de habilidades"
            className="w-full"
          />
          <p className="px-2 text-sm text-muted-foreground">
            Los círculos que laten marcan lo que destaca tu rumbo actual. Cámbialo más abajo.
            {result.jumpEstimated && " Como no sabes tu salto, usamos un valor neutro de 50."}
          </p>
        </section>

        <section
          aria-labelledby="perfil"
          className="relative flex flex-col gap-6 rounded-[28px] border-[3px] border-ink bg-bg p-6"
        >
          <Confetti replayKey={replay} />
          <div className="flex flex-col items-start gap-3">
            <p className="font-bold">Tu perfil</p>
            <StampBadge key={replay}>
              <h2 id="perfil" className="font-display text-3xl font-extrabold sm:text-4xl">
                {archetype.name}
              </h2>
            </StampBadge>
            <p className="text-lg">{archetype.description}</p>
          </div>

          <dl className="grid grid-cols-3 gap-3">
            {[
              { label: "Altura", value: input.heightCm, unit: "cm" },
              { label: "Peso", value: input.weightKg, unit: "kg" },
              { label: "Salto", value: input.verticalJumpCm, unit: "cm" },
            ].map((item, i) => (
              <div key={item.label} className="rounded-2xl border-2 border-ink bg-white p-3">
                <dt className="text-sm font-bold text-muted-foreground">{item.label}</dt>
                <dd className="font-display text-2xl font-extrabold">
                  {item.value === null ? "—" : <CountUp value={item.value} replayKey={replay} delay={300 + i * 90} />}
                  <span className="ml-1 font-sans text-sm font-medium">
                    {item.value === null ? "sin medir" : item.unit}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
          <p className="text-sm text-muted-foreground">
            {POSITION_LABELS[input.position].name} · {input.age} años · {input.weeklyDays}{" "}
            {input.weeklyDays === 1 ? "día" : "días"} por semana
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <AxisList title="Fortalezas" axes={result.strengths} />
            <AxisList title="A reforzar" axes={result.toReinforce} />
          </div>
        </section>
      </div>

      <section aria-labelledby="ejes-title" className="rounded-[28px] border-[3px] border-ink bg-white p-6">
        <h2 id="ejes-title" className="mb-5 font-display text-2xl font-extrabold">
          Tus siete ejes, de mayor a menor
        </h2>
        <ul className="flex flex-col gap-3">
          {sorted.map((axis, index) => {
            const fill = Math.min(1, Math.max(0, barsProgress * 1.45 - index * 0.08));
            const score = result.scores[axis];
            const tag = tagFor(axis);
            return (
              <li
                key={axis}
                className="grid grid-cols-[7.5rem_1fr_2.5rem] items-center gap-3 sm:grid-cols-[9rem_1fr_3rem_9rem]"
              >
                <span className="inline-flex items-center gap-2 font-bold">
                  <span
                    aria-hidden="true"
                    className={`size-3.5 shrink-0 rounded-full border-2 border-ink ${AXIS_META[axis].bg}`}
                  />
                  {AXIS_META[axis].label}
                </span>
                <span className="h-5 overflow-hidden rounded-full border-2 border-ink bg-bg" aria-hidden="true">
                  <span
                    className={`block h-full ${AXIS_META[axis].bg} ${fill > 0.02 ? "border-r-2 border-ink" : ""}`}
                    style={{ width: `${score * easeOutCubic(fill)}%` }}
                  />
                </span>
                <span className="text-right font-display text-lg font-extrabold">
                  {Math.round(score * easeOutCubic(fill))}
                  <span className="sr-only"> de 100</span>
                </span>
                <span className="col-span-3 sm:col-span-1">
                  {tag && (
                    <span
                      className={`inline-block rounded-full border-2 border-ink px-2.5 py-0.5 text-xs font-bold ${TAG_STYLES[tag]}`}
                    >
                      {tag}
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section
        aria-labelledby="recomendacion"
        className="flex flex-col gap-6 rounded-[28px] border-[3px] border-ink bg-ink p-6 text-white sm:p-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 id="recomendacion" className="font-display text-3xl font-extrabold">
            Tu recomendación
          </h2>
          <div role="group" aria-label="Rumbo" className="flex flex-wrap gap-2 rounded-full border-2 border-white p-1">
            {GOALS.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={goal === option}
                onClick={() => setGoal(option)}
                className={`min-h-11 cursor-pointer rounded-full px-4 font-bold transition-colors ${
                  goal === option ? "bg-violet text-white" : "text-white hover:bg-white/10"
                }`}
              >
                {GOAL_COPY[option].name}
              </button>
            ))}
          </div>
        </div>
        <motion.div
          key={goal}
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          aria-live="polite"
          className="flex flex-col gap-4 rounded-3xl border-[3px] border-ink bg-white p-6 text-ink"
        >
          <h3 className="font-display text-2xl font-extrabold">{text.title}</h3>
          <p className="text-lg">{text.body}</p>
          {text.items.length > 0 && (
            <ol className="grid gap-3 sm:grid-cols-3">
              {text.items.map((item, i) => (
                <li key={item} className="flex items-start gap-3 rounded-2xl border-2 border-ink bg-bg p-4 font-bold">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-sun">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          )}
        </motion.div>
        <p className="text-sm text-white/85">{HEALTH_NOTICE}</p>
        {input.age < 18 && <p className="rounded-2xl border-2 border-sun p-3 text-sm font-bold">{MINOR_NOTICE}</p>}
      </section>

      <section aria-labelledby="ejercicios" className="flex flex-col gap-5">
        <div>
          <h2 id="ejercicios" className="font-display text-3xl font-extrabold">
            Ejercicios para ti
          </h2>
          <p className="text-muted-foreground">
            Con tu perfil, estos serían tus primeros ejercicios. Con el plan Remate los ves animados paso a paso.
          </p>
        </div>
        <PlanGate
          title="Desbloquea los ejercicios animados"
          description="Biblioteca completa, plan semanal e historial para ver cómo mejoras."
          cta="Mejorar a Remate · 10 € al mes"
          secondary={
            <Link href="/" className="inline-flex min-h-11 items-center font-bold underline underline-offset-4">
              Seguir con Saque
            </Link>
          }
        >
          <ul className="grid min-h-[22rem] gap-4 p-6 sm:grid-cols-3">
            {exercises.map((exercise) => (
              <li key={exercise.slug} className="flex flex-col gap-3 rounded-2xl border-2 border-ink bg-bg p-4">
                <span className={`h-28 rounded-xl border-2 border-ink ${AXIS_META[exercise.axis].bg}`} />
                <span className="text-sm font-bold">{AXIS_META[exercise.axis].label}</span>
                <span className="font-display text-lg font-bold">{exercise.title}</span>
                <span className="inline-flex items-center gap-1 text-sm">
                  <Clock className="size-4" /> {exercise.durationMin} min
                </span>
              </li>
            ))}
          </ul>
        </PlanGate>
      </section>
    </div>
  );
}

function AxisList({ title, axes }: { title: string; axes: Axis[] }) {
  return (
    <div>
      <h3 className="mb-2 font-bold">{title}</h3>
      <ul className="flex flex-wrap gap-2">
        {axes.map((axis) => (
          <li
            key={axis}
            className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-3 py-1 font-bold"
          >
            <span aria-hidden="true" className={`size-3 rounded-full border-2 border-ink ${AXIS_META[axis].bg}`} />
            {AXIS_META[axis].label}
          </li>
        ))}
      </ul>
    </div>
  );
}
