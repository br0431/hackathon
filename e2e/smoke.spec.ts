import { expect, test } from "@playwright/test";

test("la portada carga en español con la marca", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page.getByRole("heading", { level: 1, name: "Alza" })).toBeVisible();
  await expect(page.getByTestId("supabase-status")).toHaveAttribute("data-status", /ok|error/);
});

test("la página no tiene scroll horizontal", async ({ page }) => {
  await page.goto("/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("/api/health responde con el estado de Supabase", async ({ request }) => {
  const response = await request.get("/api/health");
  const body = await response.json();
  expect(body).toHaveProperty("supabase");
  expect(["ok", "error"]).toContain(body.supabase);
});
