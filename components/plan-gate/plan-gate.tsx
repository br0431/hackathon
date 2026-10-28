import { Lock } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

/**
 * Contenido fuera del plan del usuario: vista previa desenfocada + panel de mejora.
 * Solo es la cara visible: el permiso real se comprueba en servidor (CLAUDE.md, regla 1).
 */
export function PlanGate({
  children,
  title,
  description,
  cta,
  href = "/planes",
  secondary,
}: {
  children: ReactNode;
  title: string;
  description: string;
  cta: string;
  href?: string;
  secondary?: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border-[3px] border-ink bg-white">
      <div aria-hidden="true" inert className="pointer-events-none blur-[5px] select-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-bg/40 p-4">
        <div className="flex max-w-md flex-col items-center gap-3 rounded-3xl border-[3px] border-ink bg-white p-6 text-center shadow-hard-lg">
          <span className="inline-flex size-12 items-center justify-center rounded-full border-2 border-ink bg-sun">
            <Lock aria-hidden="true" className="size-6" />
          </span>
          <h3 className="font-display text-2xl font-extrabold">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
          <Button asChild>
            <Link href={href}>{cta}</Link>
          </Button>
          {secondary}
        </div>
      </div>
    </div>
  );
}
