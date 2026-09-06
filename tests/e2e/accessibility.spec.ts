import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function openDemoWorkspace(page: Page) {
  await page.goto("/demo/access");
  await page
    .getByRole("button", { name: "Abrir espacio de demostración" })
    .click();
  await expect(page).toHaveURL(/\/demo\/dashboard$/);
}

async function resetDemoWorkspace(page: Page) {
  const response = await page.request.post("/api/demo/reset", { data: {} });

  expect(response.ok()).toBeTruthy();
}

async function openResetDemoWorkspace(page: Page) {
  await openDemoWorkspace(page);
  await resetDemoWorkspace(page);
  await page.reload();
  await expect(
    page.getByRole("heading", { level: 1, name: "Hoy" }),
  ).toBeVisible();
}

async function expectNoWcagViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();

  expect(results.violations).toEqual([]);
}

test("meets automated WCAG AA checks on the public and core workspace screens", async ({
  page,
}) => {
  await page.goto("/demo/access");
  await expectNoWcagViolations(page);

  await openResetDemoWorkspace(page);
  await expectNoWcagViolations(page);

  await page.getByRole("link", { name: "Pacientes" }).click();
  await expectNoWcagViolations(page);

  await page.getByRole("link", { name: "Agenda", exact: true }).click();
  await expectNoWcagViolations(page);
});

test("keeps keyboard focus in the patient dialog and restores it to its trigger", async ({
  page,
}) => {
  await openResetDemoWorkspace(page);
  await page.getByRole("link", { name: "Pacientes" }).click();

  const addPatient = page
    .getByRole("button", { name: "Nuevo paciente" })
    .first();
  await addPatient.focus();
  await page.keyboard.press("Enter");

  const patientDialog = page.getByRole("dialog", { name: "Nuevo paciente" });
  const identifier = patientDialog.getByLabel("Identificador");
  await expect(identifier).toBeFocused();

  await identifier.fill("A11Y-9001");
  await page.keyboard.press("Escape");

  const discardDialog = page.getByRole("alertdialog", {
    name: "¿Descartar cambios?",
  });
  await expect(discardDialog).toBeVisible();
  await expect(
    discardDialog.getByRole("button", { name: "Continuar editando" }),
  ).toBeFocused();

  await discardDialog
    .getByRole("button", { name: "Descartar cambios" })
    .click();
  await expect(patientDialog).toBeHidden();
  await expect(addPatient).toBeFocused();
});

test("uses a visible focus indicator and honors reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/demo/access");

  const openWorkspace = page.getByRole("button", {
    name: "Abrir espacio de demostración",
  });
  await openWorkspace.focus();

  await expect(openWorkspace).toBeFocused();
  await expect(openWorkspace).toHaveCSS("outline-width", "3px");
  await expect(openWorkspace).toHaveCSS("outline-style", "solid");

  const transitionDuration = await openWorkspace.evaluate((element) =>
    Number.parseFloat(getComputedStyle(element).transitionDuration),
  );
  expect(transitionDuration).toBeLessThanOrEqual(0.001);
});

test("moves focus to the dashboard content when the walkthrough is dismissed", async ({
  page,
}) => {
  await openResetDemoWorkspace(page);

  const dismissGuide = page.getByRole("button", {
    name: "Ocultar guía de inicio rápido",
  });
  await dismissGuide.focus();
  await dismissGuide.press("Enter");

  await expect(dismissGuide).toBeHidden();
  await expect(
    page.getByRole("heading", { level: 2, name: "Agenda del día" }),
  ).toBeFocused();
});

test("uses the navigation sheet below the desktop breakpoint", async ({
  page,
}) => {
  await page.setViewportSize({ height: 844, width: 375 });
  await openResetDemoWorkspace(page);

  await page
    .getByRole("button", { name: "Abrir navegación del espacio" })
    .click();
  const navigationSheet = page.getByRole("dialog", {
    name: /DMS Atelier Dental/,
  });
  const navigation = navigationSheet.getByRole("navigation", {
    name: "Navegación del espacio",
  });

  await expect(navigationSheet).toBeVisible();
  await expect(navigation.getByRole("link", { name: "Hoy" })).toHaveAttribute(
    "aria-current",
    "page",
  );

  await navigation.getByRole("link", { name: "Pacientes" }).click();

  await expect(page).toHaveURL(/\/demo\/patients$/);
  await expect(navigationSheet).toBeHidden();
});
