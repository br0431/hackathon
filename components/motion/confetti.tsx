"use client";

import { useProgress } from "@/lib/hooks/motion";
import { usePrefersReducedMotion } from "@/lib/hooks/motion";

const COLORS = ["#FF5A36", "#FFC933", "#6C3BFF", "#18D4C0", "#2F7BFF", "#E83E8C", "#35C76B"];
const COUNT = 24;
const DURATION = 1500;
const GRAVITY = 900; // px/s²

/** Confeti breve con física simple (velocidad inicial + gravedad), movido por JavaScript. */
export function Confetti({ replayKey, delay = 1100 }: { replayKey?: unknown; delay?: number }) {
  const reduce = usePrefersReducedMotion();
  const progress = useProgress(DURATION, replayKey, delay);
  if (reduce || progress <= 0 || progress >= 1) return null;

  const t = (progress * DURATION) / 1000;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-visible">
      {Array.from({ length: COUNT }, (_, i) => {
        const angle = i * ((Math.PI * 2) / COUNT) + (i % 3) * 0.18;
        const speed = 260 + ((i * 37) % 200);
        const x = Math.cos(angle) * speed * t;
        const y = Math.sin(angle) * speed * t - 180 * t + 0.5 * GRAVITY * t * t;
        const size = 10 + (i % 3) * 3;
        return (
          <span
            key={i}
            className="absolute top-1/2 left-1/2 border-[1.5px] border-ink"
            style={{
              width: size,
              height: size,
              background: COLORS[i % COLORS.length],
              borderRadius: i % 2 === 0 ? 999 : 3,
              opacity: progress < 0.65 ? 1 : (1 - progress) / 0.35,
              transform: `translate(${x}px, ${y}px) rotate(${Math.round(i * 47 * progress * 4)}deg)`,
            }}
          />
        );
      })}
    </div>
  );
}
