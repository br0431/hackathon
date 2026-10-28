import type { Metadata } from "next";

import { ResultsClient } from "@/components/results/results-client";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

export const metadata: Metadata = { title: "Tu perfil" };

export default function ResultsPage() {
  return (
    <>
      <SiteHeader />
      <main id="contenido" className="mx-auto w-full max-w-6xl flex-1 px-4 pb-20 sm:px-8">
        <ResultsClient />
      </main>
      <SiteFooter />
    </>
  );
}
