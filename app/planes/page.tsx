import type { Metadata } from "next";

import { PlanCards } from "@/components/plans/plan-cards";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

export const metadata: Metadata = { title: "Planes" };

const ROWS: [string, string, string, string][] = [
  ["Diagnóstico y radar de habilidades", "Sí", "Sí", "Sí"],
  ["Fortalezas, áreas a reforzar y perfil de jugador", "Sí", "Sí", "Sí"],
  ["Consejos básicos en texto por habilidad", "Sí", "Sí", "Sí"],
  ["Vista previa difuminada de ejercicios", "Sí", "No hace falta", "No hace falta"],
  ["Biblioteca de ejercicios con animaciones", "No", "Sí", "Sí"],
  ["Plan semanal personalizado", "No", "Básico: 3 sesiones por semana", "Avanzado: de 4 a 8 semanas"],
  ["Historial de evaluaciones y comparativa", "No", "Sí", "Sí"],
  ["Sesiones online con profesionales (simuladas)", "No", "No", "2 de 45 minutos al mes"],
];

export default function PlansPage() {
  return (
    <>
      <SiteHeader />
      <main id="contenido" className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-10 sm:px-8">
        <div>
          <h1 className="font-display text-5xl font-extrabold">Planes</h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            Empieza gratis con tu diagnóstico. Cuando quieras entrenar con ejercicios y plan, sube de nivel.
          </p>
        </div>
        <PlanCards />
        <section aria-labelledby="comparativa">
          <h2 id="comparativa" className="mb-6 font-display text-3xl font-extrabold">
            Comparativa
          </h2>
          <div className="overflow-x-auto rounded-3xl border-[3px] border-ink bg-white">
            <table className="w-full min-w-[640px] text-left">
              <thead className="border-b-[3px] border-ink">
                <tr>
                  <th scope="col" className="p-4">
                    Funcionalidad
                  </th>
                  <th scope="col" className="p-4">
                    Saque (0 €)
                  </th>
                  <th scope="col" className="bg-sun p-4">
                    Remate (10 €/mes)
                  </th>
                  <th scope="col" className="p-4">
                    Ace (30 €/mes)
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map(([feature, ...cells]) => (
                  <tr key={feature} className="border-b-2 border-ink/15 last:border-0">
                    <th scope="row" className="p-4 font-medium">
                      {feature}
                    </th>
                    {cells.map((cell, i) => (
                      <td key={i} className={`p-4 ${i === 1 ? "bg-sun/30" : ""}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
