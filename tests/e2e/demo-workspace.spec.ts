import { expect, test, type Page } from "@playwright/test";

const alexQuinnId = "30000000-0000-4000-8000-000000000001";
const hygieneVisitId = "20000000-0000-4000-8000-000000000002";
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

async function openDemoControls(page: Page) {
  await page.getByRole("button", { name: "Open demo controls" }).click();
}

async function openResetDemoWorkspace(page: Page) {
  await openDemoWorkspace(page);
  await resetDemoWorkspace(page);
  await page.reload();
  await expect(
    page.getByRole("heading", { level: 1, name: "Today" }),
  ).toBeVisible();
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
    page.getByRole("link", { name: "Open patient E2E Patient", exact: true }),
  ).toBeVisible();
}

test("opens a provisioned demo session", async ({ page }) => {
  await page.setViewportSize({ height: 960, width: 1280 });
  await openDemoWorkspace(page);

  await expect(
    page.getByRole("heading", { level: 1, name: "Today" }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("main")
      .getByText("Tuesday, 12 May 2026", { exact: true })
      .first(),
  ).toBeVisible();

  const navigation = page.getByRole("navigation", {
    name: "Workspace navigation",
  });
  await expect(navigation).toBeVisible();
  await expect(navigation.getByRole("link")).toHaveText([
    "Today",
    "Schedule",
    "Patients",
    "Treatments",
    "Notes",
  ]);
  await expect(navigation.getByRole("link", { name: "Today" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(page.getByRole("link", { name: "Dashboard" })).toHaveCount(0);
});

test("opens the selected Today appointment in Schedule", async ({ page }) => {
  await openResetDemoWorkspace(page);

  const openInSchedule = page
    .getByRole("link", { name: "Open in schedule" })
    .first();
  await expect(openInSchedule).toHaveAttribute("href", /appointment=/);
  await openInSchedule.click();

  await expect(
    page.getByRole("dialog", { name: "Appointment details" }),
  ).toBeVisible();
});

test("adds a patient through the directory", async ({ page }) => {
  await openResetDemoWorkspace(page);
  await page.getByRole("link", { name: "Patients" }).click();

  await addPatient(page);
  await expect(page.getByRole("status")).toContainText("Patient added.");
});

test("keeps a failed patient save open and announces its error", async ({
  page,
}) => {
  await openResetDemoWorkspace(page);
  await page.getByRole("link", { name: "Patients" }).click();
  await page.route("**/api/demo/patients", async (route) => {
    if (route.request().method() === "POST") {
      await route.fulfill({
        body: JSON.stringify({
          error: { message: "The patient could not be saved." },
        }),
        contentType: "application/json",
        status: 503,
      });
      return;
    }

    await route.continue();
  });

  await page.getByRole("button", { name: "Add patient" }).first().click();
  const dialog = page.getByRole("dialog", { name: "Add patient" });
  await dialog.getByLabel("Identifier").fill("E2E-ERROR");
  await dialog.getByLabel("First name").fill("E2E");
  await dialog.getByLabel("Last name").fill("Error");
  await dialog
    .getByRole("button", { name: "Add patient", exact: true })
    .click();

  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("alert")).toHaveText(
    "The patient could not be saved.",
  );
});

test("keeps archive confirmation open when archiving fails", async ({
  page,
}) => {
  await openResetDemoWorkspace(page);
  await page.getByRole("link", { name: "Patients" }).click();
  await addPatient(page);
  await page
    .getByRole("link", { name: "Open patient E2E Patient", exact: true })
    .click();
  await page.route("**/api/demo/patients/*/archive", async (route) => {
    await route.fulfill({
      body: JSON.stringify({
        error: { message: "The patient could not be archived." },
      }),
      contentType: "application/json",
      status: 503,
    });
  });

  await page.getByRole("button", { name: "Archive" }).click();
  const confirmation = page.getByRole("alertdialog", {
    name: "Archive E2E Patient?",
  });
  await confirmation.getByRole("button", { name: "Archive patient" }).click();

  await expect(confirmation).toBeVisible();
  await expect(confirmation.getByRole("alert")).toHaveText(
    "The patient could not be archived.",
  );
});

test("confirms before discarding an edited appointment and restores focus", async ({
  page,
}) => {
  await openResetDemoWorkspace(page);
  await page.getByRole("link", { name: "Schedule", exact: true }).click();

  const createAppointment = page
    .getByRole("button", { name: "Create appointment" })
    .first();
  await createAppointment.focus();
  await page.keyboard.press("Enter");

  const dialog = page.getByRole("dialog", { name: "Create appointment" });
  await dialog.getByLabel("Patient").selectOption({ index: 1 });
  await page.keyboard.press("Escape");

  const discardDialog = page.getByRole("alertdialog", {
    name: "Discard changes?",
  });
  await expect(discardDialog).toBeVisible();
  await expect(
    discardDialog.getByRole("button", { name: "Keep editing" }),
  ).toBeFocused();

  await discardDialog.getByRole("button", { name: "Discard changes" }).click();
  await expect(dialog).toBeHidden();
  await expect(createAppointment).toBeFocused();
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

test("resolves selected appointment deep links and drafts an empty slot", async ({
  page,
}) => {
  await openResetDemoWorkspace(page);
  await page.goto(
    "/demo/schedule?week=2026-05-18&appointment=40000000-0000-4000-8000-000000000007",
  );

  const appointmentContext = page.getByRole("dialog", {
    name: "Appointment details",
  });
  await expect(appointmentContext).toBeVisible();
  await expect(appointmentContext.getByLabel("Time")).toHaveValue("09:30");

  await appointmentContext
    .getByRole("button", { name: "Close" })
    .first()
    .click();
  await page
    .getByRole("button", {
      name: "Create appointment for Tue 12 May at 09:00",
    })
    .click();

  await expect(
    page
      .locator('[role="status"]')
      .filter({ hasText: "Draft appointment" })
      .first(),
  ).toBeVisible();
  await expect(
    page.getByRole("dialog", { name: "Create appointment" }),
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
  await expect(page.getByRole("status")).toContainText("Patient note saved.");
});

test("uses Today as an immediate, connected operating view", async ({
  page,
}) => {
  await openResetDemoWorkspace(page);

  await expect(page.getByRole("heading", { name: "Alex Quinn" })).toBeVisible();
  await expect(page.getByText(/Operatory 1.*Assigned/)).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Today's agenda" }),
  ).toBeVisible();

  const recentTreatment = page
    .getByRole("link", { name: /Hygiene visit/ })
    .last();
  await expect(recentTreatment).toHaveAttribute(
    "href",
    `/demo/treatments?treatment=${hygieneVisitId}`,
  );
  await expect(page.getByRole("link", { name: "Open notes" })).toBeVisible();
});

test("opens treatment context from Notes and pre-fills Schedule", async ({
  page,
}) => {
  await openResetDemoWorkspace(page);
  await page.goto("/demo/notes");

  const treatmentLink = page
    .getByRole("link", { name: /Hygiene visit/ })
    .first();
  await expect(treatmentLink).toHaveAttribute(
    "href",
    `/demo/treatments?treatment=${hygieneVisitId}`,
  );

  await page.goto(`/demo/treatments?treatment=${hygieneVisitId}`);
  const selectedTreatment = page.locator(`#treatment-${hygieneVisitId}`);
  await expect(selectedTreatment).toBeFocused();
  await expect(selectedTreatment).toContainText("Hygiene visit");
  await expect(
    selectedTreatment.getByRole("link", { name: "Schedule Hygiene visit" }),
  ).toBeVisible();

  await selectedTreatment
    .getByRole("link", { name: "Schedule Hygiene visit" })
    .click();
  const appointmentDialog = page.getByRole("dialog", {
    name: "Create appointment",
  });
  await expect(appointmentDialog).toBeVisible();
  await expect(appointmentDialog.getByLabel("Treatment")).toHaveValue(
    hygieneVisitId,
  );
  await expect(appointmentDialog.getByLabel("Duration (minutes)")).toHaveValue(
    "45",
  );
});

test("connects patient summary, historical activity, and schedule context", async ({
  page,
}) => {
  await openResetDemoWorkspace(page);
  await page.goto(`/demo/patients/${alexQuinnId}`);

  await expect(page.getByLabel("Patient summary")).toContainText("1 visit");
  await expect(page.getByLabel("Patient summary")).toContainText(
    "Prefers morning",
  );
  await expect(page.getByLabel("Patient summary")).toContainText(
    "No clinical alert recorded",
  );
  await expect(
    page.getByText("Appointment preparation details reviewed."),
  ).toBeVisible();

  await page.getByRole("button", { name: "Appointments", exact: true }).click();
  await expect(
    page.getByText("Appointment preparation details reviewed."),
  ).toBeHidden();
  await page.getByRole("button", { name: "Notes", exact: true }).click();
  await expect(
    page.getByText("Appointment preparation details reviewed."),
  ).toBeVisible();

  const viewInSchedule = page.getByRole("link", { name: "View in schedule" });
  await expect(viewInSchedule).toHaveAttribute("href", /appointment=/);
  await viewInSchedule.click();
  await expect(
    page.getByRole("dialog", { name: "Appointment details" }),
  ).toBeVisible();
});

test("keeps archived patient records read-only while preserving history", async ({
  page,
}) => {
  await openResetDemoWorkspace(page);
  await page.getByRole("link", { name: "Patients" }).click();
  await addPatient(page);

  const patientRecord = page.getByRole("link", {
    name: "Open patient E2E Patient",
    exact: true,
  });
  const patientRecordHref = await patientRecord.getAttribute("href");
  expect(patientRecordHref).toBeTruthy();
  await patientRecord.click();
  await page.getByRole("button", { name: "Archive" }).click();
  await page
    .getByRole("alertdialog", { name: "Archive E2E Patient?" })
    .getByRole("button", { name: "Archive patient" })
    .click();

  await expect(page).toHaveURL(/\/demo\/patients$/);
  await page.goto(patientRecordHref!);
  await expect(page.getByText("Archived", { exact: true })).toBeVisible();
  await expect(
    page.getByText(/read-only and remains available for reference/),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Create appointment" }),
  ).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Edit" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Add note" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Archive" })).toHaveCount(0);
});

test("keeps the archive prerequisite explicit for patients with active appointments", async ({
  page,
}) => {
  await openResetDemoWorkspace(page);
  await page.goto(`/demo/patients/${alexQuinnId}`);

  await expect(
    page.getByText(
      "Cancel or complete active appointments before archiving this patient.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Archive" })).toHaveCount(0);
});

test("keeps the workspace available when sign out fails", async ({ page }) => {
  await openDemoWorkspace(page);
  await page.route("**/api/demo/logout", async (route) => {
    await route.fulfill({
      body: JSON.stringify({ error: "Unavailable" }),
      contentType: "application/json",
      status: 503,
    });
  });

  await openDemoControls(page);
  await page.getByRole("button", { name: "Sign out" }).click();

  await expect(page).toHaveURL(/\/demo\/dashboard$/);
  await expect(
    page.getByText("The workspace could not be signed out. Try again.", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign out" })).toBeEnabled();
});

test("resets sample data from the demo controls", async ({ page }) => {
  await openDemoWorkspace(page);
  await page.getByRole("link", { name: "Patients" }).click();
  await addPatient(page);

  await openDemoControls(page);
  await page.getByRole("button", { name: "Reset sample data" }).click();
  const confirmation = page.getByRole("alertdialog", {
    name: "Reset sample data?",
  });
  await confirmation.getByRole("button", { name: "Reset sample data" }).click();

  await expect(page).toHaveURL(/\/demo\/dashboard$/);
  await expect(page.getByRole("status")).toContainText("Sample data reset.");
  await page.getByRole("link", { name: "Patients" }).click();
  await page.getByLabel("Find a patient").fill(testPatient.identifier);
  await expect(page.getByText(/No patients match/)).toBeVisible();
});

test("signs out and protects the workspace route", async ({ page }) => {
  await openDemoWorkspace(page);
  await openDemoControls(page);
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
    page.getByRole("heading", { name: "No patients match this search." }),
  ).toBeVisible();
});
