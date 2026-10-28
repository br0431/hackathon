import { Check } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DEMO_PAYMENTS_NOTICE, PLANS, STRIPE_TEST_PAYMENT_LINKS } from "@/config/plans";

export function PlanCards() {
  return (
    <div className="flex flex-col gap-6">
      <ul className="grid gap-6 md:grid-cols-3 md:items-stretch">
        {PLANS.map((plan) => (
          <li
            key={plan.id}
            className={`relative flex flex-col gap-5 rounded-3xl border-[3px] border-ink p-6 ${
              plan.highlighted ? "bg-sun shadow-hard-lg md:-translate-y-3" : "bg-white shadow-hard"
            }`}
          >
            {plan.highlighted && (
              <span className="absolute -top-4 right-6 rotate-3 rounded-full border-2 border-ink bg-coral px-3 py-1 text-sm font-bold text-ink">
                Más popular
              </span>
            )}
            <div>
              <h3 className="font-display text-3xl font-extrabold">{plan.name}</h3>
              <p className="text-ink/80">{plan.tagline}</p>
            </div>
            <p className="font-display text-5xl font-extrabold">
              {plan.priceEur} €{plan.priceEur > 0 && <span className="font-sans text-lg font-medium"> al mes</span>}
            </p>
            <ul className="flex flex-1 flex-col gap-2.5">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-2">
                  <Check aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            {plan.id === "saque" ? (
              <Button asChild variant="secondary">
                <Link href="/diagnostico">Empezar gratis</Link>
              </Button>
            ) : STRIPE_TEST_PAYMENT_LINKS[plan.id] ? (
              <div className="flex flex-col gap-1.5">
                <Button
                  asChild
                  variant={plan.highlighted ? "default" : "secondary"}
                  className="w-full text-center whitespace-normal"
                >
                  <a href={STRIPE_TEST_PAYMENT_LINKS[plan.id]}>Pagar con Stripe</a>
                </Button>
                <p className="text-center text-xs font-bold">Modo de prueba · no se cobra nada</p>
              </div>
            ) : (
              <p className="rounded-full border-2 border-dashed border-ink px-4 py-2.5 text-center text-sm font-bold">
                Pago con Stripe: próximamente
              </p>
            )}
          </li>
        ))}
      </ul>
      <p className="text-center text-sm font-medium text-muted-foreground">{DEMO_PAYMENTS_NOTICE}</p>
    </div>
  );
}
