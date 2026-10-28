"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Check, Ruler } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch, type FieldErrors } from "react-hook-form";

import { Radar } from "@/components/radar/radar";
import { Button } from "@/components/ui/button";
import { POSITION_LABELS } from "@/config/positions";
import { AXIS_META } from "@/config/skills";
import { GOAL_COPY } from "@/content/recommendations";
import { SKILL_COPY } from "@/content/skills";
import { assessmentSchema, DEFAULT_ASSESSMENT, STEP_FIELDS, type AssessmentFormValues } from "@/lib/assessment/schema";
import { clearDraft, loadDraft, saveAssessment, saveDraft } from "@/lib/assessment/storage";
import { usePrefersReducedMotion } from "@/lib/hooks/motion";
import { computeScores } from "@/lib/scoring";
import { GOALS, POSITIONS, SKILLS, type Rating } from "@/lib/scoring/types";

import { ChoiceGroup } from "./choice-group";
import { JumpRuler } from "./jump-ruler";
import { RangeField } from "./range-field";

const STEP_NAMES = ["Tú", "Tu salto", "Habilidades", "Objetivo"] as const;
const STEP_TITLES = [
  "Empecemos por ti",
  "¿Cuánto saltas y dónde juegas?",
  "¿Cómo juegas cada habilidad?",
  "¿Qué quieres conseguir?",
] as const;

const finite = (value: unknown, fallback: number) =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

/** Puntuaciones en vivo a partir de valores posiblemente incompletos del formulario. */
function liveScores(values: Partial<AssessmentFormValues>) {
  const skills = { ...DEFAULT_ASSESSMENT.skills, ...values.skills };
  return computeScores({
    ...DEFAULT_ASSESSMENT,
    age: Math.min(60, Math.max(14, finite(values.age, DEFAULT_ASSESSMENT.age))),
    position: values.position ?? DEFAULT_ASSESSMENT.position,
    verticalJumpCm: values.verticalJumpCm === null ? null : finite(values.verticalJumpCm, 45),
    skills: Object.fromEntries(
      SKILLS.map((skill) => [skill, Math.min(5, Math.max(1, finite(skills[skill], 3))) as Rating]),
    ) as AssessmentFormValues["skills"],
  }).scores;
}

function firstStepWithError(errors: FieldErrors<AssessmentFormValues>): number {
  const index = STEP_FIELDS.findIndex((fields) => fields.some((field) => field in errors));
  return index === -1 ? 0 : index;
}

export function DiagnosticWizard() {
  const router = useRouter();
  const reduce = usePrefersReducedMotion();
  // Este componente solo se monta en el navegador, así que puede leer el borrador al iniciar.
  const [draft] = useState(() => loadDraft());
  const [step, setStep] = useState(draft?.step ?? 0);
  const [lastJump, setLastJump] = useState<number>(finite(draft?.values.verticalJumpCm, 45));
  const [submitting, setSubmitting] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  const { control, handleSubmit, trigger, watch, getValues, formState } = useForm<AssessmentFormValues>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      ...DEFAULT_ASSESSMENT,
      ...draft?.values,
      skills: { ...DEFAULT_ASSESSMENT.skills, ...draft?.values.skills },
    },
    mode: "onTouched",
  });
  const { errors } = formState;
  const values = useWatch({ control }) as Partial<AssessmentFormValues>;

  // Guardado automático del borrador.
  const stepRef = useRef(step);
  useEffect(() => {
    stepRef.current = step;
    saveDraft(getValues(), step);
  }, [step, getValues]);
  useEffect(() => {
    const subscription = watch((all) => saveDraft(all, stepRef.current));
    return () => subscription.unsubscribe();
  }, [watch]);

  // Al cambiar de paso, el foco va al título del paso (teclado y lectores de pantalla).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  const next = async () => {
    const fields = STEP_FIELDS[step] ?? [];
    if (await trigger([...fields])) setStep((s) => Math.min(3, s + 1));
  };

  const onValid = (data: AssessmentFormValues) => {
    setSubmitting(true);
    saveAssessment(data);
    clearDraft();
    router.push("/resultados");
  };

  const onInvalid = (invalid: FieldErrors<AssessmentFormValues>) => setStep(firstStepWithError(invalid));

  const scores = liveScores(values);
  const progress = ((step + 1) / 4) * 100;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-start">
      <form
        noValidate
        onSubmit={handleSubmit(onValid, onInvalid)}
        className="order-2 flex flex-col gap-8 rounded-[28px] border-[3px] border-ink bg-white p-5 shadow-hard-lg sm:p-8 lg:order-1"
      >
        {/* Indicador de pasos */}
        <div className="flex flex-col gap-3">
          <ol className="grid grid-cols-4 gap-2">
            {STEP_NAMES.map((name, i) => {
              const done = i < step;
              const current = i === step;
              return (
                <li key={name} className="flex flex-col items-center gap-1.5 text-center">
                  <span
                    className={`inline-flex size-9 items-center justify-center rounded-full border-2 border-ink font-bold ${
                      done ? "bg-turquoise" : current ? "bg-violet text-white" : "bg-white"
                    }`}
                  >
                    {done ? <Check aria-hidden="true" className="size-5" /> : i + 1}
                  </span>
                  <span className={`text-xs font-bold sm:text-sm ${current ? "" : "text-muted-foreground"}`}>
                    {name}
                    <span className="sr-only">{done ? " (hecho)" : current ? " (paso actual)" : ""}</span>
                  </span>
                </li>
              );
            })}
          </ol>
          <div
            role="progressbar"
            aria-label="Progreso del diagnóstico"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            className="h-3 overflow-hidden rounded-full border-2 border-ink bg-bg"
          >
            <div
              className="h-full bg-violet transition-[width] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] } }}
            exit={reduce ? undefined : { opacity: 0, y: -8, transition: { duration: 0.18 } }}
            className="flex flex-col gap-7"
          >
            <div>
              <p className="font-bold text-violet">
                Paso {step + 1} de 4 · {STEP_NAMES[step]}
              </p>
              <h2
                ref={headingRef}
                tabIndex={-1}
                className="font-display text-3xl font-extrabold outline-none sm:text-4xl"
              >
                {STEP_TITLES[step]}
              </h2>
            </div>

            {step === 0 && (
              <>
                <Controller
                  control={control}
                  name="age"
                  render={({ field }) => (
                    <RangeField
                      label="Edad"
                      unit="años"
                      min={14}
                      max={60}
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.age?.message}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="heightCm"
                  render={({ field }) => (
                    <RangeField
                      label="Altura"
                      unit="cm"
                      min={130}
                      max={230}
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.heightCm?.message}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="weightKg"
                  render={({ field }) => (
                    <RangeField
                      label="Peso"
                      unit="kg"
                      min={35}
                      max={150}
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.weightKg?.message}
                      hint="Solo es contexto para ajustar las cargas del plan. No se juzga ni se calcula ningún índice."
                    />
                  )}
                />
              </>
            )}

            {step === 1 && (
              <>
                <Controller
                  control={control}
                  name="verticalJumpCm"
                  render={({ field }) => {
                    const unknown = field.value === null;
                    return (
                      <div className="flex flex-col gap-4">
                        <div className="grid items-center gap-4 sm:grid-cols-[1fr_auto]">
                          <RangeField
                            label="Salto vertical"
                            unit="cm"
                            min={10}
                            max={110}
                            value={unknown ? lastJump : (field.value ?? lastJump)}
                            disabled={unknown}
                            accent="#E83E8C"
                            onChange={(v) => {
                              setLastJump(v);
                              field.onChange(v);
                            }}
                            error={errors.verticalJumpCm?.message}
                          />
                          <div className="flex justify-center">
                            <JumpRuler value={unknown ? null : field.value} />
                          </div>
                        </div>
                        <label className="inline-flex min-h-11 w-fit cursor-pointer items-center gap-3 font-bold">
                          <input
                            type="checkbox"
                            checked={unknown}
                            onChange={(event) => field.onChange(event.target.checked ? null : lastJump)}
                            className="size-6 accent-violet"
                          />
                          No lo sé todavía
                        </label>
                        <details className="rounded-2xl border-2 border-ink bg-bg px-4">
                          <summary className="flex min-h-11 cursor-pointer items-center gap-2 font-bold">
                            <Ruler aria-hidden="true" className="size-5" /> Cómo medir tu salto
                          </summary>
                          <ol className="list-decimal space-y-1 pb-4 pl-5">
                            <li>De pie junto a una pared, estira el brazo y marca el punto más alto que tocas.</li>
                            <li>Sin carrera, salta con los dos pies y marca el punto más alto.</li>
                            <li>La distancia entre las dos marcas, en centímetros, es tu salto vertical.</li>
                          </ol>
                        </details>
                      </div>
                    );
                  }}
                />
                <Controller
                  control={control}
                  name="position"
                  render={({ field }) => (
                    <ChoiceGroup
                      legend="Posición"
                      name="position"
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.position?.message}
                      options={POSITIONS.map((position) => ({
                        value: position,
                        label: POSITION_LABELS[position].name,
                        description: POSITION_LABELS[position].description,
                      }))}
                    />
                  )}
                />
              </>
            )}

            {step === 2 &&
              SKILLS.map((skill) => (
                <Controller
                  key={skill}
                  control={control}
                  name={`skills.${skill}`}
                  render={({ field }) => (
                    <ChoiceGroup
                      legend={
                        <span className="inline-flex items-center gap-2">
                          <span
                            aria-hidden="true"
                            className={`size-4 rounded-full border-2 border-ink ${AXIS_META[skill].bg}`}
                          />
                          {AXIS_META[skill].label}
                          <span className="font-sans text-sm font-medium text-muted-foreground">
                            · {SKILL_COPY[skill].hint}
                          </span>
                        </span>
                      }
                      name={`skill-${skill}`}
                      value={field.value}
                      onChange={field.onChange}
                      columns="grid-cols-5"
                      error={errors.skills?.[skill]?.message}
                      options={[1, 2, 3, 4, 5].map((n) => ({
                        value: n as Rating,
                        label: <span className="block text-center text-lg">{n}</span>,
                        // Contraste AA: sobre violeta, texto blanco; el azul no admite texto, va como anillo.
                        selectedClassName:
                          skill === "colocacion"
                            ? "bg-violet text-white"
                            : skill === "bloqueo"
                              ? "bg-white ring-4 ring-blue ring-inset"
                              : AXIS_META[skill].bg,
                      }))}
                      description={
                        <p aria-live="polite" className="text-sm">
                          <strong>{field.value} de 5:</strong> {SKILL_COPY[skill].levels[(field.value ?? 3) - 1]}
                        </p>
                      }
                    />
                  )}
                />
              ))}

            {step === 3 && (
              <>
                <Controller
                  control={control}
                  name="goal"
                  render={({ field }) => (
                    <ChoiceGroup
                      legend="Tu rumbo"
                      name="goal"
                      value={field.value}
                      onChange={field.onChange}
                      columns="grid-cols-1 sm:grid-cols-3"
                      error={errors.goal?.message}
                      options={GOALS.map((goal) => ({
                        value: goal,
                        label: (
                          <span className="inline-flex items-center gap-2">
                            <span aria-hidden="true" className="text-xl">
                              {GOAL_COPY[goal].mark}
                            </span>
                            {GOAL_COPY[goal].name}
                          </span>
                        ),
                        description: GOAL_COPY[goal].description,
                        selectedClassName: "bg-[#EFE9FF]",
                      }))}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="weeklyDays"
                  render={({ field }) => (
                    <ChoiceGroup
                      legend="Días de entrenamiento por semana"
                      name="weeklyDays"
                      value={field.value}
                      onChange={field.onChange}
                      columns="grid-cols-6"
                      error={errors.weeklyDays?.message}
                      options={[1, 2, 3, 4, 5, 6].map((n) => ({
                        value: n,
                        label: <span className="block text-center text-lg">{n}</span>,
                        selectedClassName: "bg-violet text-white",
                      }))}
                    />
                  )}
                />
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-ink/15 pt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            <ArrowLeft aria-hidden="true" /> Atrás
          </Button>
          {step < 3 ? (
            <Button key="next" type="button" onClick={next}>
              Siguiente <ArrowRight aria-hidden="true" />
            </Button>
          ) : (
            <Button key="submit" type="submit" variant="sun" disabled={submitting}>
              {submitting ? "Calculando…" : "Ver mi perfil"} <ArrowRight aria-hidden="true" />
            </Button>
          )}
        </div>
      </form>

      <aside
        aria-label="Tu radar en vivo"
        className="order-1 rounded-[28px] border-[3px] border-ink bg-white p-4 shadow-hard lg:sticky lg:top-6 lg:order-2"
      >
        <p className="flex items-center gap-2 px-2 font-bold">
          <span aria-hidden="true" className="size-2.5 rounded-full border-[1.5px] border-ink bg-turquoise" />
          Tu radar en vivo
        </p>
        <Radar
          values={scores}
          mode="follow"
          label="Tu radar en vivo"
          className="mx-auto w-full max-w-xs lg:max-w-none"
        />
        <p className="px-2 text-sm text-muted-foreground">Se actualiza al tocar cualquier control.</p>
      </aside>
    </div>
  );
}
