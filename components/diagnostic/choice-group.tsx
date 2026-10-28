"use client";

import type { ReactNode } from "react";

/**
 * Grupo de opciones con radios reales (accesible con teclado y lectores de pantalla),
 * dibujados como tarjetas o botones de marca.
 */
export function ChoiceGroup<T extends string | number>({
  legend,
  name,
  options,
  value,
  onChange,
  columns = "grid-cols-2 sm:grid-cols-3",
  error,
  description,
  legendClassName = "text-lg font-bold",
}: {
  legend: ReactNode;
  name: string;
  options: { value: T; label: ReactNode; description?: ReactNode; selectedClassName?: string }[];
  value: T | undefined;
  onChange: (value: T) => void;
  columns?: string;
  error?: string;
  description?: ReactNode;
  legendClassName?: string;
}) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className={legendClassName}>{legend}</legend>
      {description}
      <div className={`grid gap-3 ${columns}`}>
        {options.map((option) => {
          const checked = option.value === value;
          return (
            <label
              key={String(option.value)}
              className={`relative flex min-h-11 cursor-pointer flex-col justify-center gap-1 rounded-2xl border-2 border-ink px-4 py-3 transition-[transform,box-shadow] duration-150 has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-violet ${
                checked
                  ? `-translate-y-0.5 shadow-hard ${option.selectedClassName ?? "bg-sun"}`
                  : "bg-white hover:-translate-y-0.5"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={String(option.value)}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              <span className="font-bold">{option.label}</span>
              {option.description && <span className="text-sm">{option.description}</span>}
            </label>
          );
        })}
      </div>
      {error && (
        <p role="alert" className="text-sm font-bold text-destructive">
          {error}
        </p>
      )}
    </fieldset>
  );
}
