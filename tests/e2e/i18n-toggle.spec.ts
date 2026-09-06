import { expect, test } from "@playwright/test";

test("localizes the public landing page and metadata", async ({ page }) => {
  await page.context().clearCookies();
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page).toHaveTitle(/Gestión operativa odontológica/);
  await expect(
    page.getByRole("heading", { level: 1, name: /Una forma más clara/ }),
  ).toBeVisible();

  await page.getByTestId("locale-en").click();

  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page).toHaveTitle(/Dental practice operations workspace/);
  await expect(
    page.getByRole("heading", { level: 1, name: /A clearer way/ }),
  ).toBeVisible();
  await expect(
    page.getByText("Una forma más clara de llevar el día en la clínica."),
  ).toHaveCount(0);
});

test("defaults to Spanish on initial visit and allows switching to English and back", async ({
  page,
}) => {
  await page.goto("/demo/access");

  // 1. Initial default state: Spanish
  const htmlElement = page.locator("html");
  await expect(htmlElement).toHaveAttribute("lang", "es");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Abrir el espacio de demostración de DMS",
    }),
  ).toBeVisible();

  const esButton = page.getByTestId("locale-es");
  const enButton = page.getByTestId("locale-en");

  await expect(esButton).toHaveAttribute("aria-pressed", "true");
  await expect(enButton).toHaveAttribute("aria-pressed", "false");

  // 2. Switch to English
  await enButton.click();

  await expect(htmlElement).toHaveAttribute("lang", "en");
  await expect(enButton).toHaveAttribute("aria-pressed", "true");
  await expect(esButton).toHaveAttribute("aria-pressed", "false");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Open DMS Demo Workspace",
    }),
  ).toBeVisible();

  // 3. Reload to verify cookie persistence
  await page.reload();
  await expect(htmlElement).toHaveAttribute("lang", "en");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Open DMS Demo Workspace",
    }),
  ).toBeVisible();

  // 4. Switch back to Spanish
  await page.getByTestId("locale-es").click();
  await expect(htmlElement).toHaveAttribute("lang", "es");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Abrir el espacio de demostración de DMS",
    }),
  ).toBeVisible();

  // 5. Reload to verify persistence in Spanish
  await page.reload();
  await expect(htmlElement).toHaveAttribute("lang", "es");
});

test("switches language live in workspace and persists across navigation", async ({
  page,
}) => {
  // Clear any existing locale cookie so it starts in default Spanish
  await page.context().clearCookies();

  await page.goto("/demo/access");
  await page
    .getByRole("button", { name: "Abrir espacio de demostración" })
    .click();
  await expect(page).toHaveURL(/\/demo\/dashboard$/);

  // Default Spanish workspace
  await expect(
    page.getByRole("heading", { level: 1, name: "Hoy" }),
  ).toBeVisible();

  // Switch to English in workspace
  await page.getByTestId("locale-en").click();

  // Workspace heading updates to English
  await expect(
    page.getByRole("heading", { level: 1, name: "Today" }),
  ).toBeVisible();

  // Navigate to Patients
  await page.getByRole("link", { name: "Patients" }).click();
  await expect(page).toHaveURL(/\/demo\/patients$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Patients" }),
  ).toBeVisible();

  // Navigate to Treatments
  await page.getByRole("link", { name: "Treatments" }).click();
  await expect(page).toHaveURL(/\/demo\/treatments/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Treatments" }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Notes" }).click();
  await expect(page).toHaveURL(/\/demo\/notes$/);
  await expect(
    page.getByText(/Remember to check blood pressure at arrival/),
  ).toBeVisible();

  // Switch back to Spanish
  await page.getByTestId("locale-es").click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Notas" }),
  ).toBeVisible();
});
