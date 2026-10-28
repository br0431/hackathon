"use client";

import { useFollow } from "@/lib/hooks/motion";

/** Regla visual del salto con una pelota que sube hasta el valor (0–110 cm). */
export function JumpRuler({ value }: { value: number | null }) {
  const [shown = 0] = useFollow([value ?? 0]);
  const top = 20;
  const bottom = 300;
  const y = bottom - (Math.min(110, Math.max(0, shown)) / 110) * (bottom - top);

  return (
    <svg viewBox="0 0 160 330" className="h-64 w-auto" aria-hidden="true">
      <rect x="20" y={top} width="34" height={bottom - top} rx="8" fill="#fff" stroke="#1b1340" strokeWidth="2.5" />
      {Array.from({ length: 12 }, (_, i) => {
        const cm = i * 10;
        const ty = bottom - (cm / 110) * (bottom - top);
        return (
          <g key={cm}>
            <line x1="20" x2={cm % 50 === 0 ? 44 : 34} y1={ty} y2={ty} stroke="#1b1340" strokeWidth="2" />
            {cm % 20 === 0 && (
              <text x="62" y={ty} dominantBaseline="middle" fontSize="13" fontWeight="700" fill="#1b1340">
                {cm}
              </text>
            )}
          </g>
        );
      })}
      <line x1="10" x2="150" y1={bottom} y2={bottom} stroke="#1b1340" strokeWidth="3" />
      {value !== null && (
        <>
          <line x1="54" x2="128" y1={y} y2={y} stroke="#e83e8c" strokeWidth="3" strokeDasharray="5 4" />
          <circle cx="118" cy={y - 14} r="14" fill="#ffc933" stroke="#1b1340" strokeWidth="2.5" />
        </>
      )}
    </svg>
  );
}
