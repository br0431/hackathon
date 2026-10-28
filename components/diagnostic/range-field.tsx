"use client";

import { useId } from "react";

/** Slider + campo numérico enlazados. El número permite escribir el valor exacto. */
export function RangeField({
  label,
  unit,
  min,
  max,
  value,
  onChange,
  error,
  hint,
  disabled,
  accent = "#6C3BFF",
}: {
  label: string;
  unit: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  error?: string;
  hint?: string;
  disabled?: boolean;
  accent?: string;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") || undefined;
  const safe = Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : min;

  return (
    <div className={`flex flex-col gap-2 ${disabled ? "opacity-50" : ""}`}>
      <div className="flex items-end justify-between gap-4">
        <label htmlFor={`${id}-number`} className="text-lg font-bold">
          {label}
        </label>
        <div className="flex items-center gap-2">
          <input
            id={`${id}-number`}
            type="number"
            inputMode="numeric"
            min={min}
            max={max}
            value={Number.isFinite(value) ? value : ""}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            onChange={(event) => onChange(event.target.value === "" ? Number.NaN : Number(event.target.value))}
            className="h-11 w-24 rounded-xl border-2 border-ink bg-white px-3 text-right font-display text-xl font-bold aria-invalid:border-destructive aria-invalid:bg-destructive/10"
          />
          <span className="w-8 font-medium text-muted-foreground">{unit}</span>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={safe}
        disabled={disabled}
        aria-label={`${label} (${min} a ${max} ${unit})`}
        aria-valuetext={`${safe} ${unit}`}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-11 w-full cursor-pointer"
        style={{ accentColor: accent }}
      />
      <div className="flex justify-between text-sm text-muted-foreground" aria-hidden="true">
        <span>
          {min} {unit}
        </span>
        <span>
          {max} {unit}
        </span>
      </div>
      {hint && (
        <p id={hintId} className="text-sm text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-sm font-bold text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
