"use client";

import { AXIS_META } from "@/config/skills";
import { easeOutCubic, useFollow, useProgress } from "@/lib/hooks/motion";
import { RADAR_AXES, type Axis } from "@/lib/scoring/types";

// Geometría de docs/DESIGN.md §5: centro (200, 200), radio 130, θ = i·2π/7 desde arriba.
const CX = 200;
const CY = 200;
const R = 130;
const ANGLES = RADAR_AXES.map((_, i) => (i * 2 * Math.PI) / RADAR_AXES.length);

function point(value: number, i: number, radius = R): [number, number] {
  const theta = ANGLES[i] ?? 0;
  return [CX + radius * (value / 100) * Math.sin(theta), CY - radius * (value / 100) * Math.cos(theta)];
}

const ring = (level: number) =>
  RADAR_AXES.map((_, i) =>
    point(level, i)
      .map((n) => n.toFixed(1))
      .join(","),
  ).join(" ");

type RadarProps = {
  values: Record<Axis, number>;
  /** "draw": se dibuja desde el centro (resultados, landing). "follow": persigue los valores (diagnóstico). */
  mode?: "draw" | "follow";
  /** Cambiarlo repite la animación de dibujo. */
  replayKey?: unknown;
  /** Ejes con anillo de pulso (los que destaca el rumbo). */
  pulse?: Axis[];
  showValues?: boolean;
  className?: string;
  label?: string;
};

export function Radar({
  values,
  mode = "draw",
  replayKey,
  pulse = [],
  showValues = false,
  className,
  label = "Radar de habilidades",
}: RadarProps) {
  const target = RADAR_AXES.map((axis) => values[axis]);
  const followed = useFollow(target);
  const progress = useProgress(1700, replayKey);
  const eased = easeOutCubic(progress);

  const shown = mode === "draw" ? target.map((v) => v * eased) : followed;
  const points = shown.map((v, i) => point(v, i));
  const polygon = points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const done = mode === "follow" || progress >= 0.95;

  const ariaLabel = `${label}: ${RADAR_AXES.map((axis) => `${AXIS_META[axis].label} ${Math.round(values[axis])}`).join(", ")}.`;

  return (
    <svg viewBox="-70 -10 540 420" role="img" aria-label={ariaLabel} className={className}>
      {[25, 50, 75, 100].map((level) => (
        <polygon
          key={level}
          points={ring(level)}
          fill={level === 100 ? "#ffffff" : "none"}
          stroke="#1b1340"
          strokeOpacity={level === 100 ? 1 : 0.18}
          strokeWidth={level === 100 ? 2.5 : 1.5}
        />
      ))}
      {RADAR_AXES.map((axis, i) => {
        const [x, y] = point(100, i);
        return (
          <line key={axis} x1={CX} y1={CY} x2={x} y2={y} stroke="#1b1340" strokeOpacity={0.18} strokeWidth={1.5} />
        );
      })}

      <polygon
        points={polygon}
        fill="#6c3bff"
        fillOpacity={0.22}
        stroke="#1b1340"
        strokeWidth={3}
        strokeLinejoin="round"
      />

      {RADAR_AXES.map((axis, i) => {
        const [x, y] = points[i] ?? [CX, CY];
        // Los puntos aparecen escalonados.
        const dot = mode === "draw" ? Math.min(1, Math.max(0, progress * 1.8 - i * 0.12)) : 1;
        const pulsing = done && pulse.includes(axis);
        return (
          <g key={axis}>
            {pulsing && (
              <circle
                cx={x}
                cy={y}
                r={15}
                fill="none"
                stroke={AXIS_META[axis].color}
                strokeWidth={3}
                className="alza-pulse"
              />
            )}
            <circle cx={x} cy={y} r={9 * dot} fill={AXIS_META[axis].color} stroke="#1b1340" strokeWidth={2} />
          </g>
        );
      })}

      {RADAR_AXES.map((axis, i) => {
        const [x, y] = point(100, i, R + 32);
        const sin = Math.sin(ANGLES[i] ?? 0);
        const anchor = Math.abs(sin) < 0.2 ? "middle" : sin > 0 ? "start" : "end";
        return (
          <text
            key={axis}
            x={x}
            y={y}
            textAnchor={anchor}
            dominantBaseline="middle"
            className="fill-ink font-display"
            fontSize={17}
            fontWeight={700}
          >
            {AXIS_META[axis].label}
            {showValues && (
              <tspan x={x} dy={19} fontSize={14} fontWeight={500} className="font-sans">
                {Math.round(values[axis] * (mode === "draw" ? eased : 1))}
              </tspan>
            )}
          </text>
        );
      })}
    </svg>
  );
}
