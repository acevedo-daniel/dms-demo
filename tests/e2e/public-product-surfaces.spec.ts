import { expect, test } from "@playwright/test";

test("uses finished workspace states as public product proof", async ({
  page,
}) => {
  await page.setViewportSize({ height: 960, width: 1280 });
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Una forma más clara de llevar el día en la clínica.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Señales de ingeniería" }),
  ).toBeVisible();

  for (const signal of [
    "Agenda sincronizada",
    "Integridad relacional",
    "Accesible por diseño",
    "Espacio protegido",
  ]) {
    await expect(page.getByText(signal, { exact: true })).toBeVisible();
  }

  await expect(
    page.getByRole("link", { name: "Abrir espacio de demostración" }).first(),
  ).toBeVisible();
});

test("frames access as a no-account entry point with Today proof", async ({
  page,
}) => {
  await page.goto("/demo/access");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Abrir el espacio de demostración de DMS",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Volver a DMS" }),
  ).toHaveAttribute("href", "/");
  await expect(
    page.getByText("No se requiere cuenta, contraseña ni datos personales.", {
      exact: false,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Abrir espacio de demostración" }),
  ).toBeVisible();
});

test("keeps demo access recovery and authorized redirects intact", async ({
  page,
}) => {
  await page.goto("/demo/access");
  await page.route("**/api/demo/access", async (route) => {
    await route.fulfill({
      body: JSON.stringify({
        error: "No se pudo abrir el espacio de demostración. Reintentá.",
      }),
      contentType: "application/json",
      status: 503,
    });
  });

  await page
    .getByRole("button", { name: "Abrir espacio de demostración" })
    .click();
  await expect(
    page.getByText("No se pudo abrir el espacio de demostración. Reintentá."),
  ).toBeVisible();

  await page.unroute("**/api/demo/access");
  await page
    .getByRole("button", { name: "Abrir espacio de demostración" })
    .click();
  await expect(page).toHaveURL(/\/demo\/dashboard$/);

  await page.goto("/demo/access");
  await expect(page).toHaveURL(/\/demo\/dashboard$/);
});
