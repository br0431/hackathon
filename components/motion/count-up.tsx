"use client";

import { easeOutCubic, useProgress } from "@/lib/hooks/motion";

/** Número que sube hasta su valor. Los lectores de pantalla leen siempre el valor final. */
export function CountUp({
  value,
  duration = 1400,
  delay = 0,
  replayKey,
}: {
  value: number;
  duration?: number;
  delay?: number;
  replayKey?: unknown;
}) {
  const progress = useProgress(duration, replayKey, delay);
  return (
    <>
      <span aria-hidden="true">{Math.round(value * easeOutCubic(progress))}</span>
      <span className="sr-only">{value}</span>
    </>
  );
}
