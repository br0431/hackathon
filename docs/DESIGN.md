# Alza: guía de diseño (nombre provisional)

Referencias visuales y de lógica en `docs/design-reference/` (cuatro archivos `.dc.html`). No son ejecutables en Next.js: son prototipos de lienzo. Úsalos para ver el resultado esperado y para copiar valores (tiempos, curvas, geometrías). Reimplementa todo como componentes React.

| Archivo | Pantalla | Ruta prevista |
|---|---|---|
| `Main.dc.html` | Landing | `/` |
| `Diagnostico.dc.html` | Asistente de 4 pasos con radar en vivo | `/diagnostico` |
| `Resultados.dc.html` | Perfil, radar animado, rumbo, vista previa bloqueada | `/resultados` |
| `Ejercicio.dc.html` | Ficha de ejercicio con animación SVG | `/ejercicios/[slug]` |

## 1. Identidad

Colorida, dinámica, deportiva. Bordes gruesos de tinta, sombras duras con desplazamiento, sin degradados, botones en píldora.

### Colores (tokens en Tailwind y variables CSS)

| Token | Hex | Uso |
|---|---|---|
| `bg` | `#FFF8EE` | Fondo general (crema) |
| `ink` | `#1B1340` | Texto, bordes, sombras duras |
| `violet` | `#6C3BFF` | Marca, acciones principales, Colocación |
| `coral` | `#FF5A36` | Acento cálido, Remate |
| `sun` | `#FFC933` | Destacados, Saque |
| `turquoise` | `#18D4C0` | Recepción |
| `blue` | `#2F7BFF` | Bloqueo |
| `green` | `#35C76B` | Defensa |
| `magenta` | `#E83E8C` | Salto |

Color por habilidad: Saque amarillo, Recepción turquesa, Colocación violeta, Remate coral, Bloqueo azul, Defensa verde, Salto magenta.

**Contraste:** el texto sobre azul y magenta no cumple AA. Esos dos colores solo van como punto, barra o borde; el texto siempre en `ink` o blanco sobre `violet`/`ink`. Comprobarlo con herramienta antes de cerrar el hito 1.

### Tipografía

- Titulares: Bricolage Grotesque (pesos 700–800), tamaños grandes, interlineado ajustado.
- Cuerpo e interfaz: DM Sans (400–700).
- Cargar con `next/font`, sin peticiones externas en tiempo de ejecución.

### Forma

- Borde de 2–3 px en `ink`. Radios generosos (tarjetas 20–28 px, botones y chips en píldora).
- Sombra dura: `box-shadow: 4px 4px 0 ink` (6–8 px en tarjetas grandes). Al pasar el ratón, el elemento se desplaza y la sombra se reduce; al pulsar, se hunde.
- Sin degradados ni sombras difusas.
- Mobile first. El diseño de referencia es de escritorio (1280); en móvil las rejillas pasan a una columna y el radar ocupa el ancho completo.

## 2. Principios de animación

1. La animación explica algo (progreso, cambio de dato, énfasis); nunca es decoración gratuita.
2. Entradas con `ease-out`, 300–500 ms; salidas más cortas. Escalonado de 60–90 ms entre elementos hermanos.
3. **`prefers-reduced-motion`:** sin movimiento; se muestra el estado final al instante (el radar completo, los números finales, sin confeti).
4. Las animaciones continuas (pelota, pulsos) se pausan fuera de pantalla y no deben bloquear el hilo principal.
5. Hay un botón "Ver otra vez" en la pantalla de resultados para repetir la secuencia.

## 3. Pantallas y comportamiento

### Landing (`Main.dc.html`)
Barra superior, héroe con titular "Descubre tu perfil de jugador. Entrena lo que te falta." y tarjeta de radar de ejemplo animada con una pelota que rebota; banda con las 7 habilidades; "Cómo funciona" (3 tarjetas); "Tú eliges el rumbo" (3 tarjetas); planes Saque / Remate (con sello "Más popular") / Ace con la nota "Versión de demostración: los pagos son simulados"; preguntas frecuentes con `details`; llamada final en violeta; pie con aviso legal y de salud.

El radar de ejemplo usa los mismos valores que la pantalla de resultados para que sean coherentes: Remate 100, Bloqueo 75, Saque 75, Defensa 25, Recepción 25, Colocación 50, Salto 80.

### Diagnóstico (`Diagnostico.dc.html`)
Cuatro pasos: Tú, Tu salto, Habilidades, Objetivo. Indicador de pasos con barra de progreso animada.
- **Tú:** edad (14–60), altura (130–230 cm), peso (35–150 kg) y posición (6 tarjetas).
- **Tu salto:** salto vertical (10–110 cm) con una regla animada y una pelota que sube al valor.
- **Habilidades:** 6 filas con botones 1–5 y descripción del nivel elegido.
- **Objetivo:** rumbo (reforzar lo débil / potenciar lo fuerte / equilibrado) y días por semana (1–6).
- **Radar en vivo:** a la derecha (arriba en móvil) y se actualiza al tocar cualquier control. El polígono se interpola con `requestAnimationFrame` y suavizado exponencial hacia el objetivo (`animateTo`), no salta de golpe.
- Puntuación del salto: `(salto - 20) / 70 * 100`, limitado a 0–100. Los valores finales y las referencias por edad/sexo salen de `config/benchmarks.ts` (provisional).
- Validación con Zod y React Hook Form; mensajes de error en español junto al campo.

### Resultados (`Resultados.dc.html`)
Perfil de ejemplo "Rematador explosivo" (Receptor-atacante, 186 cm, 78 kg, salto 76 cm). Secuencia:
1. El radar se dibuja en ~1700 ms con curva suavizada y los puntos aparecen escalonados.
2. Anillos de pulso en el eje que corresponde al rumbo elegido.
3. Contador numérico animado en las cifras.
4. Sello ("stamp") del arquetipo con escala y rotación.
5. Confeti con física simple movido por JavaScript (no variables CSS).
6. Siete barras de habilidad ordenadas, con etiquetas "Arma principal", "Fortaleza" o "A reforzar".
7. Selector de rumbo que cambia el bloque de recomendaciones (los tres bloques se remontan con entrada animada).
8. Vista previa de ejercicios desenfocada con panel de mejora de plan (`PlanGate`).

### Ficha de ejercicio (`Ejercicio.dc.html`)
"Aproximación explosiva en tres pasos". Escenario SVG de 720×400 con suelo, red en x=450, sombra y balón. Controles: reproducir/pausar, velocidad 0,5× / 1×, barra para recorrer el movimiento. Lista de 5 pasos sincronizada con la animación (el paso activo se resalta). Fichas: 4 series, 6 repeticiones, 90 s de descanso (valores de ejemplo). Errores comunes, aviso de seguridad y botón "Marcar como hecho".

## 4. Motor de animación de ejercicios (`ExerciseRig`)

Un ejercicio es **datos**, no un componente. Un único componente `ExerciseRig` renderiza cualquier ejercicio a partir de:

```ts
type Keyframe = {
  t: number;       // 0..1 dentro del ciclo
  x: number;       // posición horizontal de la cadera
  air: number;     // altura sobre el suelo (salto)
  torso: number;   // inclinación del tronco (grados)
  lAU: number; lAL: number;  // brazo izq.: superior e inferior
  rAU: number; rAL: number;  // brazo der.: superior e inferior
  lTh: number; lSh: number;  // pierna izq.: muslo y espinilla
  rTh: number; rSh: number;  // pierna der.: muslo y espinilla
};
type BallKey = { t: number; x: number; y: number };
type ExerciseAnim = {
  loopMs: number;           // 5200 en el ejemplo
  keyframes: Keyframe[];    // 10 en el ejemplo
  ball: BallKey[];
  steps: { from: number; to: number; title: string; text: string }[]; // tramos de t
};
```

- Interpolación entre keyframes con `smoothstep`. Cinemática directa: cadera → tronco → hombros → codos → manos; cadera → rodillas → pies.
- Keyframes de ejemplo (t): 0, .10, .22, .38, .52, .62, .74, .82, .92, 1.0.
- Trayectoria del balón del ejemplo: (560,-30) → (455,34) → (400,52) → (382,56) → (650,335).
- Fundido en los extremos del bucle para que no se vea el salto de reinicio.
- Un único reloj (`requestAnimationFrame`) gobierna figura, balón y paso resaltado, para que nunca se desincronicen.
- El `ExerciseRig` aplica a cualquier ejercicio solo si el modelo articulado lo expresa; para ejercicios con material o pareja habrá que añadir elementos al escenario (fase posterior).
- Accesibilidad: descripción textual de cada paso siempre visible; con movimiento reducido arranca pausado en el primer fotograma y el usuario avanza con la barra.

## 5. Radar

SVG propio de 7 ejes (no usar librería). Orden de ejes en sentido horario desde arriba: Remate, Bloqueo, Saque, Defensa, Recepción, Colocación, Salto. Anillos al 25/50/75/100. Polígono con relleno al 20–25 % de opacidad y trazo grueso de tinta; un punto de color por eje. `aria-label` con los siete valores en texto. En el prototipo, centro (200, 150) y radio 120 sobre un lienzo de 400×300; el cálculo es `x = cx + r·(v/100)·sin(θ)`, `y = cy − r·(v/100)·cos(θ)`, con `θ = i·2π/7`.

Evolución en el tiempo (hito 6): Recharts, mismo estilo (bordes gruesos, colores por habilidad).

## 6. Inventario de componentes

`Button` (primario violeta, secundario crema, peligro), `Chip`, `Card` (con sombra dura), `Stepper`, `RangeField`, `PositionCard`, `SkillRating` (1–5), `RumboCard`, `Radar`, `SkillBar`, `StampBadge`, `Confetti`, `CountUp`, `PlanCard`, `PlanGate` (contenido desenfocado + panel de mejora), `ExerciseRig`, `ExerciseControls`, `StepList`, `FaqItem`, `AppNav` (con chip del plan), `Footer`.

Cada uno con estados de reposo, hover, foco, activo y deshabilitado; y con variante de movimiento reducido cuando anima.

## 7. Textos de referencia

Los textos exactos están en los `.dc.html`. Al pasarlos a `content/` mantén el tono: cercano, directo, de entrenador amable; frases cortas; tuteo; sin tecnicismos innecesarios; nunca juzgar el cuerpo del jugador.
