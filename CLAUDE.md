# Alza (nombre provisional): convenciones del proyecto

App web de mejora en voleibol. El producto, el alcance y los hitos están en `docs/PRD.md`; el estilo visual, las animaciones y los componentes, en `docs/DESIGN.md`. Léelos antes de tocar código. Si algo de aquí contradice al PRD, manda el PRD y avísame.

## Stack

Next.js (App Router) con TypeScript estricto, Tailwind CSS, shadcn/ui como base de componentes, Framer Motion para animación, React Hook Form + Zod, Supabase (Postgres, Auth, RLS) y despliegue en Vercel. Gestor de paquetes: pnpm. Pruebas: Vitest (unitarias) y Playwright (recorrido principal).

Notas de versión: Next.js 16 con Cache Components (lee `node_modules/next/dist/docs/` antes de usar una API; el middleware se llama `proxy.ts` y `error.tsx` recibe `retry`). Framer Motion se usa con el paquete `motion` (`import { motion } from "motion/react"`). Tailwind v4: los tokens están en `app/globals.css` (`@theme`), no hay `tailwind.config`.

## Comandos

- `pnpm dev`: servidor de desarrollo.
- `pnpm lint` y `pnpm typecheck`: deben pasar sin errores antes de dar algo por terminado.
- `pnpm test`: Vitest. `pnpm e2e`: Playwright.

## Reglas que no se discuten

1. **El plan se decide siempre en servidor.** El permiso sale de la tabla `subscriptions` (middleware, Server Components y políticas RLS). Ocultar un botón en la interfaz nunca basta.
2. **Pagos simulados en la v1.** Todo cobro pasa por la interfaz `BillingProvider`; en la v1 solo existe `MockBillingProvider`. No se recogen ni guardan datos de tarjeta. Los campos de pago, si se dibujan, son decorativos y van marcados como demostración. Nunca claves de Stripe en el código ni en el repositorio.
3. **El motor de puntuación es una función pura** en `lib/scoring`, sin dependencias de React ni de Supabase, con tests. Las tablas de referencia (`config/benchmarks.ts`) y los pesos por posición (`config/positions.ts`) son datos provisionales: márcalos con un comentario `TODO validar con entrenador`.
4. **Todo el texto de la interfaz está en español.** Los textos de recomendación y de ejercicios viven en `content/`, no dentro de los componentes.
5. **Accesibilidad:** contraste AA, controles reales (`button`, `a`, `input` con `label`), foco visible, tamaño táctil de al menos 44 px y movimiento reducido respetado (`prefers-reduced-motion`): con él activo, ninguna animación se ejecuta y se muestra el estado final.
6. **El color nunca es la única señal.** Cada color de habilidad va con texto o icono.
7. **Datos de salud:** peso y altura son contexto, nunca se juzgan ni se muestra un IMC. Aviso visible de que las recomendaciones no sustituyen a un entrenador ni a un profesional sanitario. Edad mínima de registro: 14 años.
8. **Secretos:** variables de entorno validadas al arrancar con Zod. La clave de servicio de Supabase solo existe en servidor. `.env*` está en `.gitignore`.

## Cómo trabajamos

- Un hito del PRD por sesión. Empieza cada hito en modo plan, propón el plan y espera mi aprobación.
- No pases al siguiente hito hasta cumplir su "hecho cuando" del PRD.
- Componentes pequeños y reutilizables; añadir un ejercicio es añadir datos (`content/exercises`), no componentes.
- Estados de carga, vacío y error diseñados en cada pantalla, no solo el caso feliz.
- Al terminar un hito: resumen corto de lo hecho, qué falta y qué decisiones he de tomar yo.
