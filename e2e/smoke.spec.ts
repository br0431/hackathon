import { expect, test } from "@playwright/test";

test("la landing carga en español con la marca y la llamada principal", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Descubre tu perfil de jugador");
  await expect(page.getByRole("link", { name: "Descubre tu perfil en 3 minutos" })).toBeVisible();
});

test("ninguna pantalla tiene scroll horizontal", async ({ page }) => {
  for (const path of ["/", "/diagnostico", "/resultados", "/planes"]) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, path).toBeLessThanOrEqual(0);
  }
});

test("/api/health responde con el estado de Supabase", async ({ request }) => {
  const response = await request.get("/api/health");
  const body = await response.json();
  expect(["ok", "error"]).toContain(body.supabase);
});

test("resultados sin diagnóstico muestra el estado vacío", async ({ page }) => {
  await page.goto("/resultados");
  await expect(page.getByRole("heading", { name: "Todavía no tienes perfil" })).toBeVisible();
});

test("recorrido: diagnóstico → resultados, con validación y cambio de rumbo", async ({ page }) => {
  await page.goto("/diagnostico");

  // Paso 1: un valor fuera de rango no deja avanzar y explica el rango.
  const height = page.getByRole("spinbutton", { name: "Altura" });
  await height.fill("300");
  await page.getByRole("button", { name: "Siguiente" }).click();
  await expect(page.getByText("Escribe un número entero entre 130 y 230 cm.")).toBeVisible();
  await height.fill("186");
  await page.getByRole("button", { name: "Siguiente" }).click();

  // Paso 2: salto y posición.
  await page.getByRole("spinbutton", { name: "Salto vertical" }).fill("76");
  await page.getByText("Receptor-atacante").click();
  await page.getByRole("button", { name: "Siguiente" }).click();

  // Paso 3: notas del perfil de ejemplo.
  const ratings = { Saque: 4, Recepción: 2, Colocación: 3, Remate: 5, Bloqueo: 4, Defensa: 2 };
  for (const [skill, note] of Object.entries(ratings)) {
    await page
      .getByRole("group", { name: new RegExp(`^${skill}`) })
      .getByText(String(note), { exact: true })
      .click();
  }
  await page.getByRole("button", { name: "Siguiente" }).click();

  // Paso 4: objetivo.
  await page.getByRole("radio", { name: /^Reforzar lo débil/ }).check({ force: true });
  await page.getByRole("button", { name: "Ver mi perfil" }).click();

  await expect(page).toHaveURL(/\/resultados$/);
  await expect(page.getByRole("heading", { name: "Rematador explosivo" })).toBeVisible();
  await expect(page.getByRole("heading", { name: /^Prioridad: recepción y defensa/ })).toBeVisible();

  await page.getByRole("button", { name: "Potenciar lo fuerte" }).click();
  await expect(page.getByRole("heading", { name: "Tu arma principal: el remate" })).toBeVisible();
});
