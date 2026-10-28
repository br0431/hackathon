# PRD: app web de mejora en voleibol

Fecha: 28 de octubre de 2026 · Autor: Rodrigo

Alza (nombre provisional) es una app web que convierte unos pocos datos físicos y una autoevaluación de seis habilidades en un diagnóstico visual del jugador de voleibol, y le propone tres niveles de producto (gratis, 10 €/mes y 30 €/mes) para reforzar sus puntos débiles o potenciar su arma principal. Este documento define la v1, con pagos simulados, para construirla con Claude Code sobre Next.js y Supabase.

## Decisiones ya tomadas

Estas decisiones salen de tus respuestas y no se reabren durante la construcción.

| Tema | Decisión |
| --- | --- |
| Público | Todos los niveles, de principiante a avanzado |
| Cuentas | Registro con email (Supabase Auth); el diagnóstico se hace ya con sesión iniciada |
| Estilo visual | Colorido y dinámico, juvenil y motivador |
| Stack | Next.js + Supabase + Stripe (Stripe queda preparado, ver sección de pagos) |
| Diagnóstico | Datos físicos (altura, peso, salto vertical), posición y autoevaluación por habilidad |
| Plan gratuito | Diagnóstico con radar, recomendación de qué reforzar, consejos básicos en texto y vista previa bloqueada de ejercicios |
| Plan de 10 €/mes | Biblioteca de ejercicios con animaciones propias (SVG), plan semanal e historial de progreso |
| Plan de 30 €/mes | Todo lo anterior, plan avanzado y reserva simulada de sesiones online con profesionales |
| Progreso en el tiempo | Solo en planes de pago |
| Pagos en la v1 | Flujo de pago simulado, sin llamar todavía a Stripe |
| Idioma | Solo español |
| Nombre | Sin definir: ver propuestas en la sección de diseño |

## Problema y propuesta de valor

La mayoría de jugadores de voleibol entrenan sin saber qué habilidad les limita más, y los planes genéricos no distinguen entre una colocadora de 1,65 m y un central de 1,95 m. Alza pide tres minutos de datos y devuelve un retrato claro: qué hace bien, qué le frena y qué trabajar primero.

La promesa de producto es una frase: **"Descubre tu perfil de jugador y entrena justo lo que te hace falta"**. El usuario elige además su rumbo: reforzar lo débil o convertir lo fuerte en su arma principal.

### Métricas de éxito de la v1

Son hipótesis a validar con la demo, no compromisos de negocio.

| Métrica | Objetivo |
| --- | --- |
| Usuarios registrados que completan el diagnóstico | 70 % o más |
| Tiempo medio para completar el formulario | Menos de 3 minutos |
| Clics en "Mejorar plan" desde la pantalla de resultados | 15 % o más |
| Checkouts simulados completados sobre los iniciados | 40 % o más |
| Usuarios de pago que rehacen el diagnóstico en 30 días | 30 % o más |

## Usuarios y casos de uso

La app sirve a cualquier jugador que quiera mejorar; lo que cambia entre perfiles es la habilidad que más pesa y el nivel de las recomendaciones.

| Perfil | Qué busca | Cómo lo resuelve la app |
| --- | --- | --- |
| Principiante | Saber por dónde empezar | Radar claro y 2 o 3 prioridades con lenguaje sencillo |
| Jugador de club o liga | Subir de nivel en su posición | Prioridades ponderadas por posición y plan semanal |
| Jugador avanzado | Pulir detalles y potenciar un arma | Modo "arma principal" y sesiones con profesionales |
| Jugador joven | Desarrollo físico y técnico sano | Cargas moderadas y aviso de consultar con su entrenador |

### Casos de uso principales

1. Como jugador nuevo, me registro, completo el diagnóstico y veo mi perfil en un gráfico radar.
2. Como jugador, elijo si quiero reforzar mis puntos débiles o potenciar mis puntos fuertes y la recomendación cambia en consecuencia.
3. Como usuario gratuito, veo qué trabajar pero los ejercicios aparecen bloqueados y puedo mejorar de plan.
4. Como suscriptor de 10 €, sigo un plan semanal con animaciones de cada ejercicio y comparo mis evaluaciones en el tiempo.
5. Como suscriptor de 30 €, reservo una sesión online con un profesional y sigo un plan avanzado de varias semanas.

## Alcance de la v1

La v1 es una demo funcional de extremo a extremo, con datos reales de usuario y contenido de ejemplo, pero sin cobros reales.

**Incluye**

- Landing, registro e inicio de sesión con email.
- Diagnóstico en formulario por pasos, motor de puntuación y pantalla de resultados con radar.
- Página de planes, checkout simulado, gestión de suscripción (cambiar, cancelar).
- Biblioteca de unos 24 ejercicios con animaciones SVG propias y plan semanal.
- Historial de evaluaciones y comparativa (planes de pago).
- Reserva simulada de sesiones con entrenadores ficticios (plan de 30 €).
- Diseño responsive, mobile first, en español.

**No incluye**

- Cobros reales ni facturación fiscal.
- Videollamadas reales: la sesión reservada solo se registra.
- App móvil nativa, notificaciones push y chat.
- Panel de administración para entrenadores; los ejercicios y entrenadores se cargan con un seed.
- Varios idiomas, suscripciones anuales y códigos de descuento.

## Flujo de usuario

Recorrido: 1) Landing → 2) Registro / inicio de sesión → 3) Diagnóstico de 4 pasos → 4) Resultados (radar, fortalezas, áreas a reforzar, recomendación según el rumbo) → 5) Decisión única: ¿mejora de plan? Si no, sigue en Saque (gratis) y puede volver a `/planes` cuando quiera. Si sí, elige Remate (10 €/mes) o Ace (30 €/mes) → checkout simulado → acceso a los contenidos de su plan (`/app`).

Todo usuario se registra y hace el diagnóstico; en la pantalla de resultados decide si mejora de plan. Quien no mejora sigue en Saque y puede volver a la página de planes cuando quiera; quien mejora pasa por el pago simulado y recibe el contenido de su plan.

## Diagnóstico y motor de puntuación

El diagnóstico es un asistente de cuatro pasos con barra de progreso, un campo principal por pantalla y guardado automático del borrador. El motor de puntuación es una función pura y testeable (`lib/scoring`), separada de la interfaz.

### Campos del formulario

| Paso | Campo | Regla de validación |
| --- | --- | --- |
| 1. Tú | Edad | Entero entre 14 y 60 |
| 1. Tú | Altura (cm) | Entre 130 y 230 |
| 1. Tú | Peso (kg) | Entre 35 y 150; dato de contexto, nunca se juzga ni se muestra un IMC |
| 2. Tu salto | Salto vertical (cm) | Entre 10 y 110; con guía visual de cómo medirlo y opción "no lo sé" |
| 2. Tu salto | Posición | Colocador, opuesto, receptor-atacante, central, líbero o "aún no lo sé" |
| 3. Tus habilidades | Saque, recepción, colocación, remate, bloqueo, defensa | Nota de 1 a 5, con una descripción concreta de cada nota por habilidad para reducir la sobrevaloración |
| 4. Tu objetivo | Rumbo | Reforzar lo débil, potenciar lo fuerte o equilibrado |
| 4. Tu objetivo | Días de entrenamiento por semana | De 1 a 6; se usa para dimensionar el plan |

### Puntuación

1. Cada habilidad pasa de la nota 1 a 5 a una escala de 0 a 100: `(nota - 1) / 4 * 100`.
2. El salto se puntúa de 0 a 100 comparándolo con una tabla de referencia por edad y posición, guardada en `config/benchmarks.ts`. Los valores iniciales son provisionales y debe validarlos un entrenador.
3. El radar tiene siete ejes: las seis habilidades y el salto. Altura y peso no son ejes; ajustan la lectura por posición (por ejemplo, la altura pesa más en un central) y las cargas del plan.
4. Cada posición tiene pesos por habilidad en `config/positions.ts`. Ejemplo: el líbero pondera recepción y defensa; el central, bloqueo y remate; el colocador, colocación y saque.

### Fortalezas, debilidades y recomendación

- **Prioridad de refuerzo** de una habilidad = `(100 - puntuación) × peso de la posición`. Las 2 o 3 mayores son las áreas a reforzar.
- **Arma principal** = la habilidad con mayor `puntuación × peso`. Las 2 mayores son las fortalezas.
- Si el rumbo es "reforzar lo débil", la recomendación gratuita lista las áreas a reforzar primero. Si es "potenciar lo fuerte", destaca el arma principal y cómo llevarla a otro nivel. Si es "equilibrado", mezcla ambas.
- **Perfil de jugador**: una etiqueta con nombre atractivo según la combinación de fortalezas (por ejemplo, "Rematador explosivo", "Cerebro de la red", "Muro defensivo"). Hace falta un catálogo de unas 8 etiquetas con regla de asignación.
- Los textos de recomendación salen de una plantilla por habilidad y nivel (bajo, medio, alto), sin llamadas a ningún modelo de IA en tiempo real.

## Planes y precios

Tres planes mensuales, cada uno con todo lo del anterior. Los nombres salen del vocabulario del voleibol y se pueden cambiar en `config/plans.ts`, que es la única fuente de verdad de precios y permisos.

| Funcionalidad | Saque (0 €) | Remate (10 €/mes) | Ace (30 €/mes) |
| --- | --- | --- | --- |
| Diagnóstico y radar de habilidades | Sí | Sí | Sí |
| Fortalezas, áreas a reforzar y perfil de jugador | Sí | Sí | Sí |
| Consejos básicos en texto por habilidad | Sí | Sí | Sí |
| Vista previa difuminada de ejercicios | Sí | No hace falta | No hace falta |
| Biblioteca de ejercicios con animaciones | No | Sí | Sí |
| Plan semanal personalizado | No | Básico: 3 sesiones por semana según los días elegidos | Avanzado: de 4 a 8 semanas con progresión y ajuste semanal |
| Historial de evaluaciones y comparativa | No | Sí | Sí |
| Sesiones online con profesionales (simuladas) | No | No | 2 sesiones de 45 minutos al mes |

**Reglas**

- El plan se aplica en servidor (middleware y políticas de Supabase); ocultar un botón en la interfaz nunca es suficiente.
- Un bloque de contenido que no está en el plan del usuario se muestra con el componente `PlanGate`: vista previa difuminada, texto de qué se desbloquea y botón de mejora.
- Al cancelar, el usuario conserva el plan hasta el final del periodo y después baja a Saque sin perder sus datos; el historial queda guardado pero bloqueado.

## Pantallas y requisitos funcionales

| Ruta | Pantalla | Requisitos clave | Acceso |
| --- | --- | --- | --- |
| `/` | Landing | Hero con CTA "Descubre tu perfil en 3 minutos", cómo funciona en 3 pasos, radar de ejemplo animado, planes, preguntas frecuentes | Público |
| `/registro`, `/login` | Acceso | Email y contraseña, validación en línea, mensajes de error claros, redirección al diagnóstico | Público |
| `/diagnostico` | Asistente de 4 pasos | Guardado de borrador, vuelta atrás sin perder datos, sliders con feedback visual, guía de medición del salto | Con sesión |
| `/resultados` | Resultados | Radar animado, fortalezas, áreas a reforzar, perfil de jugador, recomendación según el rumbo, consejos básicos, vista previa bloqueada de ejercicios y CTA a planes | Con sesión |
| `/planes` | Planes | Tres tarjetas con el plan central destacado, tabla comparativa, preguntas frecuentes | Público |
| `/checkout/[plan]` | Pago simulado | Resumen del plan, aviso visible "modo demostración", confirmación animada | Con sesión |
| `/app` | Panel | Plan semanal, próximo ejercicio, accesos rápidos | Remate o Ace |
| `/app/ejercicios` y `/app/ejercicios/[slug]` | Biblioteca y ficha | Filtros por habilidad, dificultad y duración; ficha con animación en bucle, pasos, series y repeticiones, errores comunes | Remate o Ace |
| `/app/progreso` | Progreso | Comparar dos evaluaciones, evolución del radar y del salto, botón "rehacer diagnóstico" | Remate o Ace |
| `/app/sesiones` | Sesiones | Entrenadores ficticios, calendario de huecos, reserva y cancelación, historial | Ace |
| `/app/cuenta` | Cuenta | Plan actual, cambiar o cancelar plan, historial de pagos simulados, borrar cuenta y datos | Con sesión |

### Reglas transversales

- Un usuario sin diagnóstico completado que entre a cualquier ruta privada es llevado a `/diagnostico`.
- Cada pantalla tiene estados de carga (esqueletos), vacío y error diseñados, no solo el caso feliz.
- Las animaciones de cada ejercicio se reproducen en bucle, se pueden pausar y se detienen si el sistema pide movimiento reducido.

## Pagos y suscripciones simulados

En la v1 no se llama a Stripe: todo el cobro pasa por una interfaz `BillingProvider` con una implementación simulada (`MockBillingProvider`). Pasar a Stripe en modo test en una fase 2 consiste en añadir `StripeBillingProvider` y cambiar una variable de entorno, sin tocar pantallas ni permisos.

### Interfaz

- `createCheckout(userId, plan)`: devuelve la URL de checkout. En simulado es `/checkout/[plan]`; en Stripe sería una sesión de Checkout alojada.
- `confirmCheckout(sessionId)`: activa la suscripción y registra el evento.
- `cancelSubscription(userId)`: marca la cancelación al final del periodo.
- `changePlan(userId, plan)`: cambia de plan con efecto inmediato.
- `getSubscription(userId)`: estado, plan y fecha de fin de periodo.

### Comportamiento simulado

- La pantalla de checkout muestra un aviso permanente: "Modo demostración: no se realiza ningún cobro".
- **No se recogen ni se guardan datos de tarjeta.** Los campos de pago, si se dibujan para dar realismo, son decorativos, vienen precargados con valores de demo y no se envían a ningún sitio.
- Al confirmar se crea la suscripción con `provider = 'mock'`, un periodo de 30 días y un evento de pago simulado en el historial de la cuenta.
- No hay renovaciones automáticas. Un botón visible solo en desarrollo permite avanzar el periodo para probar caducidades.

### Preparación para Stripe (fase 2)

- Variables de entorno previstas: `BILLING_PROVIDER` (`mock` o `stripe`), `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` y un `STRIPE_PRICE_ID` por plan. Nunca se escriben claves en el código ni en el repositorio.
- Sustitución: Checkout alojado, portal de cliente para cambiar o cancelar, y un webhook en `/api/webhooks/stripe` que actualiza la tabla `subscriptions`. El permiso de plan sigue leyendose de esa tabla, igual que ahora.

## Diseño y experiencia visual

La app debe sentirse como un producto deportivo moderno: colorida, con energía y con el radar de habilidades como protagonista. Se diseña primero para móvil.

### Principios

- **El producto es el héroe**: el radar y el perfil de jugador aparecen en la landing, en los resultados y en la tarjeta de plan. Nada de fotos de stock genéricas.
- **Movimiento con propósito**: cada animación explica algo (el radar se dibuja, los números suben, el ejercicio se demuestra) y respeta `prefers-reduced-motion`.
- **Un color por habilidad**, usado siempre igual en radar, etiquetas, ejercicios y filtros.
- **Nunca solo color**: cada color va con icono o texto para cumplir contraste AA.

### Tokens iniciales

| Token | Valor | Uso |
| --- | --- | --- |
| Fondo | `#FFF8EE` | Base cálida de todas las pantallas |
| Tinta | `#1B1340` | Texto y fondos oscuros |
| Violeta eléctrico | `#6C3BFF` | Acción principal y colocación |
| Coral | `#FF5A36` | Energía, remate y alertas suaves |
| Amarillo sol | `#FFC933` | Destacados, saque y plan central |
| Turquesa | `#18D4C0` | Recepción y estados correctos |
| Azul | `#2F7BFF` | Bloqueo |
| Verde | `#35C76B` | Defensa |
| Magenta | `#E83E8C` | Salto |

Tipografía con `next/font`: Bricolage Grotesque para titulares y DM Sans para texto. Esquinas redondeadas generosas, sombras suaves de color, degradados entre dos tokens.

### Animaciones clave

- Hero de la landing con un balón que rebota y el radar dibujándose.
- Asistente de diagnóstico con transiciones entre pasos, sliders que cambian de color según la nota y una regla visual para el salto.
- Resultados con revelado escalonado: radar, número de cada habilidad, perfil de jugador y confeti breve.
- Ejercicios: figura esquemática animada en SVG. Una sola figura articulada (`ExerciseRig`) se mueve a partir de fotogramas definidos en JSON por ejercicio con Framer Motion; añadir un ejercicio es añadir datos, no componentes.
- Pago simulado con confirmación animada.

### Propuestas de nombre

| Nombre | Idea |
| --- | --- |
| Alza | Subir y elevar; corto, fácil de recordar y evoca el salto |
| Ace Lab | Laboratorio de rendimiento; choca con el plan Ace, habría que renombrarlo |
| Vuelo | La altura y el salto como seña de identidad |
| NetUp | Subir de nivel en la red; tono juvenil |
| Remata | Verbo en imperativo, directo y motivador |

El nombre vive en una sola constante (`config/brand.ts`) para cambiarlo sin tocar el resto.

## Arquitectura y stack técnico

| Capa | Elección | Motivo |
| --- | --- | --- |
| Framework | Next.js (App Router) con TypeScript estricto | Rutas, renderizado en servidor y despliegue sencillo |
| Estilos | Tailwind CSS y componentes base de shadcn/ui | Velocidad y sistema de diseño coherente |
| Animación | Framer Motion | Transiciones, revelados y figura articulada de los ejercicios |
| Radar y gráficos | SVG propio para el radar; Recharts para la evolución en el tiempo | Control total del protagonista visual |
| Formularios | React Hook Form + Zod | Validación compartida entre cliente y servidor |
| Base de datos y auth | Supabase (Postgres, Auth, Row Level Security) | Cuentas con email y permisos por fila |
| Pagos | Interfaz `BillingProvider`: simulado en v1, Stripe en fase 2 | Ver sección de pagos |
| Pruebas | Vitest para el motor de puntuación y el permiso de plan; Playwright para el recorrido principal | Cubrir lo que más duele si falla |
| Despliegue | Vercel + proyecto de Supabase | Entornos de preview por rama |

### Estructura de carpetas sugerida

- `app/`: rutas, agrupadas en `(marketing)`, `(auth)` y `(app)`.
- `components/`: `ui/` (base), `radar/`, `exercise/`, `plan-gate/`.
- `lib/scoring/`: motor de puntuación puro y sus tests.
- `lib/billing/`: `BillingProvider`, `MockBillingProvider` y el stub de Stripe.
- `lib/supabase/`: clientes de servidor y de navegador.
- `config/`: `plans.ts`, `positions.ts`, `benchmarks.ts` y `brand.ts`.
- `content/`: textos de recomendación, ejercicios y fotogramas de animación.
- `supabase/`: migraciones y `seed.sql`.

### Decisiones técnicas

- Lectura de datos y permisos en servidor (Server Components y Route Handlers); el navegador nunca decide el plan.
- Variables de entorno validadas al arrancar; la clave de servicio de Supabase solo existe en servidor.
- Un archivo `CLAUDE.md` en la raíz con las convenciones de este documento para que Claude Code las respete entre sesiones.

## Modelo de datos y reglas de acceso

| Tabla | Campos clave | Notas |
| --- | --- | --- |
| `profiles` | `id` (igual que el usuario de Auth), `display_name`, `plan` (`saque`, `remate`, `ace`), `created_at` | El plan se mantiene sincronizado con `subscriptions` |
| `assessments` | `id`, `user_id`, `age`, `height_cm`, `weight_kg`, `vertical_jump_cm`, `position`, `goal`, `weekly_days`, `skill_scores` (json), `result` (json con radar, fortalezas, áreas a reforzar y perfil), `created_at` | Una fila por diagnóstico; el último es el vigente |
| `exercises` | `id`, `slug`, `title`, `skill`, `difficulty`, `duration_min`, `sets_reps`, `description`, `steps` (json), `common_mistakes`, `animation` (json de fotogramas) | Cargada con `seed.sql`; lectura según plan |
| `training_plans` | `id`, `user_id`, `assessment_id`, `level` (`basic`, `advanced`), `weeks`, `created_at` | Se genera al contratar o al rehacer el diagnóstico |
| `plan_items` | `id`, `plan_id`, `week`, `day`, `exercise_id`, `sets`, `reps`, `done_at` | Permite marcar ejercicios como hechos |
| `subscriptions` | `id`, `user_id`, `plan`, `status`, `provider` (`mock` o `stripe`), `provider_customer_id`, `provider_subscription_id`, `current_period_end`, `cancel_at_period_end` | Fuente de verdad del plan |
| `payment_events` | `id`, `user_id`, `type`, `amount_cents`, `created_at` | Historial simulado de cobros |
| `coaches` | `id`, `name`, `bio`, `specialty`, `avatar_url` | Entrenadores ficticios del seed |
| `coach_slots` | `id`, `coach_id`, `starts_at`, `duration_min`, `status` (`open`, `booked`) | Huecos generados por el seed |
| `bookings` | `id`, `user_id`, `slot_id`, `status`, `created_at` | Máximo 2 reservas activas por mes natural |

### Row Level Security

- `profiles`, `assessments`, `training_plans`, `plan_items`, `subscriptions`, `payment_events` y `bookings`: cada usuario solo lee y escribe sus filas.
- `exercises`: lectura solo si el plan del usuario es Remate o Ace; la vista previa gratuita usa una consulta de servidor que devuelve título, habilidad y duración, sin pasos ni animación.
- `coaches` y `coach_slots`: lectura solo para Ace. Reservar un hueco se hace en una función de base de datos para evitar dobles reservas.
- El permiso de plan se calcula a partir de `subscriptions`, nunca de un campo que el cliente pueda enviar.
- Borrar la cuenta elimina en cascada todos los datos del usuario.

## Hitos de construcción para Claude Code

Conviene trabajar un hito por sesión, empezando cada uno en modo plan, y no pasar al siguiente hasta cumplir su definición de hecho.

| Hito | Entregables | Hecho cuando |
| --- | --- | --- |
| 0. Base | Proyecto Next.js con TypeScript, Tailwind, shadcn/ui, Framer Motion, Supabase conectado, `CLAUDE.md`, variables de entorno validadas | La app arranca, lint y tipos pasan y hay un despliegue de preview |
| 1. Sistema de diseño y landing | Tokens, tipografías, componentes base, landing completa con hero animado | La landing se ve bien en móvil y escritorio y pasa auditoría de accesibilidad |
| 2. Cuentas | Registro, login, logout, tabla `profiles` con RLS, rutas privadas protegidas | Un usuario nuevo se registra, entra y no puede ver datos ajenos |
| 3. Diagnóstico y resultados | Asistente de 4 pasos, `lib/scoring` con tests, tabla `assessments`, pantalla de resultados con radar | Los tests del motor pasan y un diagnóstico guardado se ve en `/resultados` |
| 4. Planes y pago simulado | `config/plans.ts`, página de planes, `BillingProvider` simulado, checkout, `PlanGate` y permisos en servidor, página de cuenta | Un usuario sube, baja y cancela de plan y los accesos cambian sin recargar manualmente |
| 5. Ejercicios y plan semanal | Seed de unos 24 ejercicios, `ExerciseRig` con fotogramas JSON, biblioteca, ficha y generación del plan básico | Cada ejercicio se anima y un plan se genera según días y áreas a reforzar |
| 6. Progreso | Historial de evaluaciones y comparativa de radar y salto | Rehacer el diagnóstico añade un punto y la comparativa lo muestra |
| 7. Plan Ace | Plan avanzado de 4 a 8 semanas, entrenadores y huecos de ejemplo, reserva y cancelación de sesiones | No se puede reservar dos veces el mismo hueco ni superar el cupl mensual |
| 8. Pulido y entrega | Estados vacíos y de error, rendimiento, accesibilidad, prueba de extremo a extremo, README | El recorrido completo pasa en Playwright y la auditoría cumple los mínimos de abajo |

### Prompt de arranque recomendado

El repositorio lleva `CLAUDE.md` en la raíz y este PRD y `DESIGN.md` en `docs/`. Primera sesión de Claude Code: "Lee `docs/PRD.md`, `docs/DESIGN.md` y `CLAUDE.md` enteros. Después, en modo plan, propón el plan detallado del hito 0 y espera mi aprobación."

## Criterios de aceptación y requisitos no funcionales

### Criterios de aceptación clave

- **Diagnóstico**: dado un usuario con sesión, cuando completa los 4 pasos con datos válidos, entonces se guarda un `assessment` y se muestra el radar con 7 ejes en menos de 2 segundos.
- **Validación**: dado un valor fuera de rango (por ejemplo, altura de 300 cm), el paso no avanza y el mensaje de error explica el rango válido.
- **Rumbo**: dados los mismos datos, cambiar el rumbo de "reforzar lo débil" a "potenciar lo fuerte" cambia el orden y el texto de la recomendación.
- **Plan gratuito**: un usuario Saque ve radar, recomendación y consejos, y no puede abrir una ficha de ejercicio ni por URL directa.
- **Plan Remate**: tras el checkout simulado, el usuario accede a la biblioteca, al plan semanal y al historial, pero no a las sesiones.
- **Plan Ace**: puede reservar hasta 2 sesiones al mes; un tercer intento muestra un mensaje claro y no crea reserva.
- **Cancelación**: al cancelar, el plan sigue activo hasta `current_period_end` y después baja a Saque sin borrar datos.
- **Seguridad**: un usuario no puede leer ni modificar filas de otro, comprobado con tests de las políticas de acceso.

### Requisitos no funcionales

| Área | Requisito |
| --- | --- |
| Rendimiento | Landing con LCP menor de 2,5 s en móvil; puntuación de rendimiento de Lighthouse de 90 o más |
| Accesibilidad | Contraste AA, navegación completa con teclado, etiquetas en formularios, movimiento reducido respetado; Lighthouse de accesibilidad de 95 o más |
| Responsive | Funcional desde 360 px de ancho; diseño pensado primero para móvil |
| Privacidad | Política de privacidad y aviso de cookies mínimo; borrado de cuenta y datos desde `/app/cuenta`; solo se guardan los datos del formulario |
| Seguridad | RLS en todas las tablas, validación con Zod en servidor, sin secretos en el cliente, límite de intentos en login |
| Calidad | TypeScript estricto, lint sin errores, tests del motor de puntuación y del permiso de plan en integración continua |
| Contenido de salud | Aviso visible de que las recomendaciones no sustituyen a un entrenador ni a un profesional sanitario, y límite de cargas moderado para menores |

## Riesgos y preguntas abiertas

| Tema | Riesgo o duda | Propuesta |
| --- | --- | --- |
| Stripe | Tu idea original era conectar Stripe para simular cobros y en esta ronda elegiste simular el flujo sin llamar a Stripe | Mantener simulado en v1 y decidir si la fase 2 activa Stripe en modo test con Checkout y webhooks |
| Edad mínima | El público es de todos los niveles y puede incluir menores; en España la edad de consentimiento digital es 14 años | Exigir 14 años o más en el registro y revisar el texto legal y el tratamiento de datos de menores antes de publicar |
| Referencias de salto | Las tablas de salto por edad y posición son provisionales | Que un entrenador las valide antes de enseñar la app a usuarios reales |
| Autoevaluación | Los usuarios tienden a sobrevalorar sus habilidades y el diagnóstico pierde utilidad | Descripciones concretas por nota y, en una fase posterior, tests físicos guiados |
| Ejercicios y seguridad | Cargas pliométricas mal planteadas pueden causar lesiones | Contenido revisado por un entrenador, aviso visible y límites de carga para menores |
| Animaciones | Una figura esquemática puede no bastar para ejercicios complejos | Empezar con ejercicios sencillos y reservar la opción de añadir vídeo después |
| Sesiones Ace | Sin profesionales reales, el plan de 30 € solo es una demo | Etiquetar las sesiones como demostración hasta tener entrenadores reales y videollamada |
| Nombre | Alza es provisional y no se ha comprobado su disponibilidad como marca ni dominio | Decidir nombre antes de publicar y comprobar marca y dominio |
