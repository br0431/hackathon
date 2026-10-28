import Link from "next/link";

import { Logo } from "./logo";

export function SiteHeader({ children }: { children?: React.ReactNode }) {
  return (
    <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-8">
      <Logo />
      {children ?? (
        <nav aria-label="Principal" className="flex flex-wrap items-center gap-x-6 gap-y-1 font-medium">
          <Link href="/#como-funciona" className="inline-flex min-h-11 items-center">
            Cómo funciona
          </Link>
          <Link href="/planes" className="inline-flex min-h-11 items-center">
            Planes
          </Link>
          <Link href="/#faq" className="inline-flex min-h-11 items-center">
            Preguntas
          </Link>
        </nav>
      )}
    </header>
  );
}
