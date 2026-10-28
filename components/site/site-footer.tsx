import { BRAND } from "@/config/brand";
import { HEALTH_NOTICE } from "@/content/recommendations";

import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="border-t-[3px] border-ink bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <Logo />
        <p className="max-w-md text-sm text-muted-foreground">
          {HEALTH_NOTICE} {BRAND.name} es una versión de demostración: los pagos son simulados.
        </p>
      </div>
    </footer>
  );
}
