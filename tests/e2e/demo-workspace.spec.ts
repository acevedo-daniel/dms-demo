import { expect, test, type Page } from "@playwright/test";

const alexQuinnId = "30000000-0000-4000-8000-000000000001";
const testPatient = {
  firstName: "E2E",
  identifier: "E2E-9001",
  lastName: "Patient",
};

async function openDemoWorkspace(page: Page) {
  await page.goto("/demo/access");
  await page.getByRole("button", { name: "Open demo workspace" }).click();
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
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
}

async function addPatient(page: Page) {
  await page.getByRole("button", { name: "Add patient" }).first().click();

  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Identifier").fill(testPatient.identifier);
  await dialog.getByLabel("First name").fill(testPatient.firstName);
  await dialog.getByLabel("Last name").fill(testPatient.lastName);
  await dialog
    .getByRole("button", { name: "Add patient", exact: true })
    .click();

  await expect(dialog).toBeHidden();
  await expect(
    page.getByRole("link", { name: "E2E Patient", exact: true }),
  ).toBeVisible();
}

test("opens a provisioned demo session", async ({ page }) => {
  await openDemoWorkspace(page);

  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  await expect(
    page
      .getByRole("main")
      .getByText("Tuesday, 12 May 2026", { exact: true })
      .first(),
  ).toBeVisible();
});

test("adds a patient through the directory", async ({ page }) => {
  await openResetDemoWorkspace(page);
  await page.getByRole("link", { name: "Patients" }).click();

  await addPatient(page);
  await expect(page.getByRole("status")).toContainText("Patient added.");
});

test("creates an appointment from the weekly schedule", async ({ page }) => {
  await openResetDemoWorkspace(page);
  await page.getByRole("link", { name: "Schedule", exact: true }).click();
  await page
    .getByRole("button", { name: "Create appointment" })
    .first()
    .click();

  const dialog = page.getByRole("dialog");
  await dialog
    .getByLabel("Patient")
    .selectOption({ label: "Alex Quinn · AT-1001" });
  await dialog
    .getByLabel("Treatment")
    .selectOption({ label: "Routine consultation · 30 min" });
  await dialog.getByLabel("Date").fill("2026-05-11");
  await dialog.getByLabel("Time").fill("09:00");
  await dialog
    .getByLabel("Operational note")
    .fill("Created by end-to-end test.");
  await dialog
    .getByRole("button", { name: "Create appointment", exact: true })
    .click();

  await expect(dialog).toBeHidden();
  await expect(page.getByText("Appointment created.")).toBeAttached();
  await expect(
    page.getByRole("button", {
      name: "Open scheduled appointment for Alex Quinn · Routine consultation at 09:00",
    }),
  ).toBeVisible();
});

test("adds a note from a patient record", async ({ page }) => {
  await openResetDemoWorkspace(page);
  await page.goto(`/demo/patients/${alexQuinnId}`);
  await page.getByRole("button", { name: "Add note" }).click();

  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Note").fill("Created by end-to-end test.");
  await dialog.getByRole("button", { name: "Save note" }).click();

  await expect(dialog).toBeHidden();
  await expect(page.getByText("Created by end-to-end test.")).toBeVisible();
});

test("signs out and protects the workspace route", async ({ page }) => {
  await openDemoWorkspace(page);
  await page.getByRole("button", { name: "Sign out" }).click();

  await expect(page).toHaveURL(/\/demo\/access$/);
  await page.goto("/demo/dashboard");
  await expect(page).toHaveURL(/\/demo\/access$/);
});

test("resets the demo workspace to its seeded dataset", async ({ page }) => {
  await openResetDemoWorkspace(page);
  await page.getByRole("link", { name: "Patients" }).click();
  await addPatient(page);

  await resetDemoWorkspace(page);
  await page.reload();
  await page.getByLabel("Find a patient").fill(testPatient.identifier);

  await expect(
    page.getByText(`No patients match “${testPatient.identifier}”.`),
  ).toBeVisible();
});
