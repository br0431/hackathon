"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/** true si el sistema pide movimiento reducido. En servidor, false. */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}

export const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

/**
 * Progreso lineal 0→1 durante `duration` ms tras `delay` ms, movido por requestAnimationFrame.
 * Cambiar `replayKey` lo reinicia. Con movimiento reducido devuelve 1 (estado final) al instante.
 */
export function useProgress(duration: number, replayKey: unknown = 0, delay = 0): number {
  const reduce = usePrefersReducedMotion();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const value = Math.min(1, Math.max(0, (now - start - delay) / duration));
      setProgress(value);
      if (value < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration, delay, replayKey, reduce]);

  return reduce ? 1 : progress;
}

/**
 * Valores que persiguen a su objetivo con una interpolación suave (no saltan de golpe).
 * Con movimiento reducido devuelve el objetivo directamente.
 */
export function useFollow(target: number[], duration = 650): number[] {
  const reduce = usePrefersReducedMotion();
  const [display, setDisplay] = useState(target);
  const displayRef = useRef(target);
  const key = target.join(",");

  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    const start = performance.now();
    const from = displayRef.current;
    const goal = key.split(",").map(Number);
    const tick = (now: number) => {
      const x = Math.min(1, (now - start) / duration);
      const eased = easeOutCubic(x);
      const next = goal.map((value, i) => (from[i] ?? 0) + (value - (from[i] ?? 0)) * eased);
      displayRef.current = next;
      setDisplay(next);
      if (x < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [key, duration, reduce]);

  return reduce ? target : display;
}
