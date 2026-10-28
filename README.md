# Alza (nombre provisional)

App web de mejora en voleibol: un diagnóstico de tres minutos que dibuja tu perfil de jugador y te dice qué entrenar.

- Producto, alcance e hitos: [`docs/PRD.md`](docs/PRD.md)
- Estilo visual, animaciones y componentes: [`docs/DESIGN.md`](docs/DESIGN.md) y prototipos en `docs/design-reference/`
- Convenciones para Claude Code: [`CLAUDE.md`](CLAUDE.md)

## Stack

Next.js 16 (App Router, Cache Components) con TypeScript estricto, Tailwind CSS v4, shadcn/ui (Radix), Motion (sucesor de Framer Motion), React Hook Form + Zod, Supabase (Postgres, Auth, RLS) y Vercel. Gestor de paquetes: pnpm.

## Puesta en marcha

Requisitos: Node 22 o superior (`.nvmrc` indica 24) y pnpm 12 (`corepack enable`).

1. `pnpm install`
2. Copia `.env.example` a `.env.local` y rellena las variables de Supabase (Project Settings → API).
3. `pnpm dev` y abre http://localhost:3000

Las variables se validan al arrancar con Zod (`lib/env/schema.ts`). Si falta alguna o es incorrecta, `pnpm dev` y `pnpm build` se detienen y dicen cuál. `GET /api/health` comprueba la conexión con Supabase.

## Comandos

| Comando                     | Qué hace                                                                                     |
| --------------------------- | -------------------------------------------------------------------------------------------- |
| `pnpm dev`                  | Servidor de desarrollo                                                                       |
| `pnpm build` / `pnpm start` | Compilación y servidor de producción                                                         |
| `pnpm lint`                 | ESLint                                                                                       |
| `pnpm typecheck`            | Genera los tipos de rutas y ejecuta `tsc --noEmit`                                           |
| `pnpm test`                 | Tests unitarios (Vitest)                                                                     |
| `pnpm e2e`                  | Recorrido en navegador (Playwright; la primera vez, `pnpm exec playwright install chromium`) |
| `pnpm format`               | Prettier                                                                                     |

## Estructura

```
app/            rutas: (marketing), (auth), (app) y api/
components/     ui/ (shadcn), radar/, exercise/, plan-gate/
config/         brand.ts y, más adelante, plans, positions y benchmarks
content/        textos de recomendación y ejercicios
lib/env/        validación de variables de entorno
lib/supabase/   clientes de navegador, servidor, proxy y admin
lib/scoring/    motor de puntuación (función pura)
lib/billing/    BillingProvider (simulado en la v1)
supabase/       config.toml, migraciones y seed.sql
e2e/            tests de Playwright
```

Migraciones de Supabase: usa la CLI con `pnpm dlx supabase …` (no es una dependencia del proyecto).

## Despliegue

Vercel con integración de GitHub: cada rama y PR genera un preview. En Vercel → Settings → Environment Variables, define las variables de `.env.example` para Preview y Production. Nunca subas claves al repositorio.

## Pagos

En la v1 los pagos son simulados (`BILLING_PROVIDER=mock`): no se cobra nada ni se recogen datos de tarjeta.
