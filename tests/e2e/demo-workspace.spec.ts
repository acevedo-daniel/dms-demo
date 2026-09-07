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
  await page
    .getByRole("button", { name: "Abrir espacio de demostración" })
    .click();
  await expect(page).toHaveURL(/\/demo\/dashboard$/);
}

async function resetDemoWorkspace(page: Page) {
  const response = await page.request.post("/api/demo/reset", { data: {} });

  expect(response.ok()).toBeTruthy();
}

async function openDemoControls(page: Page) {
  await page
    .getByRole("button", { name: "Abrir controles de la demo" })
    .click();
}

async function openResetDemoWorkspace(page: Page) {
  await openDemoWorkspace(page);
  await resetDemoWorkspace(page);
  await page.reload();
  await expect(
    page.getByRole("heading", { level: 1, name: "Hoy" }),
  ).toBeVisible();
}

async function addPatient(page: Page) {
  await page.getByRole("button", { name: "Nuevo paciente" }).first().click();

  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Identificador").fill(testPatient.identifier);
  await dialog.getByLabel("Nombre").fill(testPatient.firstName);
  await dialog.getByLabel("Apellido").fill(testPatient.lastName);
  await dialog
    .getByRole("button", { name: "Agregar paciente", exact: true })
    .click();

  await expect(dialog).toBeHidden();
  await expect(
    page.getByRole("link", { name: "Ver ficha de E2E Patient", exact: true }),
  ).toBeVisible();
}

test("opens a provisioned demo session", async ({ page }) => {
  await page.setViewportSize({ height: 960, width: 1280 });
  await openDemoWorkspace(page);

  await expect(
    page.getByRole("heading", { level: 1, name: "Hoy" }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("main")
      .getByText("Martes, 12 de mayo de 2026", { exact: true })
      .first(),
  ).toBeVisible();

  const navigation = page.getByRole("navigation", {
    name: "Navegación del espacio",
  });
  await expect(navigation).toBeVisible();
  await expect(navigation.getByRole("link")).toHaveText([
    "Hoy",
    "Agenda",
    "Pacientes",
    "Tratamientos",
    "Notas",
  ]);
  await expect(navigation.getByRole("link", { name: "Hoy" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(page.getByRole("link", { name: "Dashboard" })).toHaveCount(0);
});

test("opens the selected Today appointment in Schedule", async ({ page }) => {
  await openResetDemoWorkspace(page);

  const openInSchedule = page
    .getByRole("link", { name: "Ver en la agenda" })
    .first();
  await expect(openInSchedule).toHaveAttribute("href", /appointment=/);
  await openInSchedule.click();

  await expect(
    page.getByRole("dialog", { name: "Detalles del turno" }),
  ).toBeVisible();
});

test("adds a patient through the directory", async ({ page }) => {
  await openResetDemoWorkspace(page);
  await page.getByRole("link", { name: "Pacientes" }).click();

  await addPatient(page);
  await expect(page.getByRole("status")).toContainText(
    "Paciente agregado al directorio.",
  );
});

test("keeps a failed patient save open and announces its error", async ({
  page,
}) => {
  await openResetDemoWorkspace(page);
  await page.getByRole("link", { name: "Pacientes" }).click();
  await page.route("**/api/demo/patients", async (route) => {
    if (route.request().method() === "POST") {
      await route.fulfill({
        body: JSON.stringify({
          error: { message: "No se pudo guardar la ficha del paciente." },
        }),
        contentType: "application/json",
        status: 503,
      });
      return;
    }

    await route.continue();
  });

  await page.getByRole("button", { name: "Nuevo paciente" }).first().click();
  const dialog = page.getByRole("dialog", { name: "Nuevo paciente" });
  await dialog.getByLabel("Identificador").fill("E2E-ERROR");
  await dialog.getByLabel("Nombre").fill("E2E");
  await dialog.getByLabel("Apellido").fill("Error");
  await dialog
    .getByRole("button", { name: "Agregar paciente", exact: true })
    .click();

  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("alert")).toHaveText(
    "No se pudo guardar la ficha del paciente.",
  );
});

test("keeps archive confirmation open when archiving fails", async ({
  page,
}) => {
  await openResetDemoWorkspace(page);
  await page.getByRole("link", { name: "Pacientes" }).click();
  await addPatient(page);
  await page
    .getByRole("link", { name: "Ver ficha de E2E Patient", exact: true })
    .click();
  await page.route("**/api/demo/patients/*/archive", async (route) => {
    await route.fulfill({
      body: JSON.stringify({
        error: { message: "No se pudo archivar la ficha del paciente." },
      }),
      contentType: "application/json",
      status: 503,
    });
  });

  await page.getByRole("button", { name: "Archivar" }).click();
  const confirmation = page.getByRole("alertdialog", {
    name: "¿Archivar a E2E Patient?",
  });
  await confirmation.getByRole("button", { name: "Archivar paciente" }).click();

  await expect(confirmation).toBeVisible();
  await expect(confirmation.getByRole("alert")).toHaveText(
    "No se pudo archivar la ficha del paciente.",
  );
});

test("confirms before discarding an edited appointment and restores focus", async ({
  page,
}) => {
  await openResetDemoWorkspace(page);
  await page.getByRole("link", { name: "Agenda", exact: true }).click();

  const createAppointment = page
    .getByRole("button", { name: "Crear turno" })
    .first();
  await createAppointment.focus();
  await page.keyboard.press("Enter");

  const dialog = page.getByRole("dialog", { name: "Crear turno" });
  await dialog.getByLabel("Paciente").selectOption({ index: 1 });
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
  await expect(dialog).toBeHidden();
  await expect(createAppointment).toBeFocused();
});

test("creates an appointment from the weekly schedule", async ({ page }) => {
  await openResetDemoWorkspace(page);
  await page.getByRole("link", { name: "Agenda", exact: true }).click();
  await page.getByRole("button", { name: "Crear turno" }).first().click();

  const dialog = page.getByRole("dialog");
  await dialog
    .getByLabel("Paciente")
    .selectOption({ label: "Alex Quinn · AT-1001" });
  await dialog
    .getByLabel("Tratamiento")
    .selectOption({ label: "Consulta de rutina · 30 min" });
  await dialog.getByLabel("Fecha").fill("2026-05-11");
  await dialog.getByLabel("Horario").fill("09:00");
  await dialog
    .getByLabel("Nota de coordinación")
    .fill("Created by end-to-end test.");
  await dialog
    .getByRole("button", { name: "Crear turno", exact: true })
    .click();

  await expect(dialog).toBeHidden();
  await expect(page.getByText("Turno creado.")).toBeAttached();
  await expect(
    page.getByRole("button", {
      name: "Abrir turno programado para Alex Quinn · Consulta de rutina a las 09:00",
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
    name: "Detalles del turno",
  });
  await expect(appointmentContext).toBeVisible();
  await expect(appointmentContext.getByLabel("Horario")).toHaveValue("09:30");

  await appointmentContext
    .getByRole("button", { name: "Cerrar" })
    .first()
    .click();
  await page
    .getByRole("button", {
      name: "Agendar turno para mar 12 may a las 09:00",
    })
    .click();

  await expect(
    page
      .locator('[role="status"]')
      .filter({ hasText: "Turno en borrador" })
      .first(),
  ).toBeVisible();
  await expect(page.getByRole("dialog", { name: "Crear turno" })).toBeVisible();
});

test("adds a note from a patient record", async ({ page }) => {
  await openResetDemoWorkspace(page);
  await page.goto(`/demo/patients/${alexQuinnId}`);
  await page.getByRole("button", { name: "Nueva nota" }).click();

  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Nota clínica").fill("Created by end-to-end test.");
  await dialog.getByRole("button", { name: "Guardar nota" }).click();

  await expect(dialog).toBeHidden();
  await expect(page.getByText("Created by end-to-end test.")).toBeVisible();
  await expect(page.getByRole("status")).toContainText(
    "Nota de paciente guardada.",
  );
});

test("uses Today as an immediate, connected operating view", async ({
  page,
}) => {
  await openResetDemoWorkspace(page);

  await expect(page.getByRole("heading", { name: "Alex Quinn" })).toBeVisible();
  await expect(page.getByText(/Sillón 1.*Asignado/)).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Agenda del día" }),
  ).toBeVisible();

  const recentTreatment = page
    .getByRole("link", { name: /Higiene dental/ })
    .last();
  await expect(recentTreatment).toHaveAttribute(
    "href",
    `/demo/treatments?treatment=${hygieneVisitId}`,
  );
  await expect(
    page.getByRole("link", { name: "Ver libro de notas" }),
  ).toBeVisible();
});

test("prints the daily huddle in an isolated, unclipped document", async ({
  page,
}) => {
  await openResetDemoWorkspace(page);
  await page.getByRole("button", { name: "Informe diario" }).click();

  const dialog = page.getByRole("dialog", {
    name: "Reunión clínica diaria",
  });
  const printButton = dialog.getByRole("button", { name: "Imprimir" });

  await page.evaluate(() => {
    window.open = () =>
      ({
        close: () => {
          document.documentElement.dataset.printWindowClosed = "true";
        },
        document: {
          close: () => {},
          open: () => {},
          write: (markup: string) => {
            document.documentElement.dataset.printDocument = markup;
          },
        },
        focus: () => {},
        opener: window,
        print: () => {
          document.documentElement.dataset.printRequested = "true";
        },
      }) as unknown as Window;
  });
  await printButton.click();
  await expect(page.locator("html")).toHaveAttribute(
    "data-print-requested",
    "true",
  );
  await expect(page.locator("html")).toHaveAttribute(
    "data-print-window-closed",
    "true",
  );

  const printDocument = await page
    .locator("html")
    .getAttribute("data-print-document");

  expect(printDocument).toContain('<html lang="es">');
  expect(printDocument).toContain("@page { margin: 14mm; }");
  expect(printDocument).toContain("overflow: visible;");
  expect(printDocument).toContain("Reunión clínica diaria");
  expect(printDocument).toContain("Atelier Dental · informe operativo del día");
  expect(printDocument).toContain("page-break-inside: avoid;");

  if (!printDocument) {
    throw new Error("The daily huddle print document was not generated.");
  }

  const printPreview = await page.context().newPage();
  await printPreview.setContent(printDocument);
  await printPreview.emulateMedia({ media: "print" });

  const layout = await printPreview.locator("main").evaluate((element) => ({
    height: element.getBoundingClientRect().height,
    overflow: getComputedStyle(element).overflow,
    rowCount: element.querySelectorAll("tbody tr").length,
    rowsWithLayout: Array.from(element.querySelectorAll("tbody tr")).filter(
      (row) => row.getBoundingClientRect().height > 0,
    ).length,
  }));

  expect(layout).toEqual({
    height: expect.any(Number),
    overflow: "visible",
    rowCount: expect.any(Number),
    rowsWithLayout: expect.any(Number),
  });
  expect(layout.height).toBeGreaterThan(0);
  expect(layout.rowCount).toBeGreaterThan(0);
  expect(layout.rowsWithLayout).toBe(layout.rowCount);

  await printPreview.close();
});

test("opens treatment context from Notes and pre-fills Schedule", async ({
  page,
}) => {
  await openResetDemoWorkspace(page);
  await page.goto("/demo/notes");

  const treatmentLink = page
    .getByRole("link", { name: /Higiene dental/ })
    .first();
  await expect(treatmentLink).toHaveAttribute(
    "href",
    `/demo/treatments?treatment=${hygieneVisitId}`,
  );

  await page.goto(`/demo/treatments?treatment=${hygieneVisitId}`);
  const selectedTreatment = page.locator(`#treatment-${hygieneVisitId}`);
  await expect(selectedTreatment).toBeFocused();
  await expect(selectedTreatment).toContainText("Higiene dental");
  await expect(
    selectedTreatment.getByRole("link", { name: "Agendar Higiene dental" }),
  ).toBeVisible();

  await selectedTreatment
    .getByRole("link", { name: "Agendar Higiene dental" })
    .click();
  const appointmentDialog = page.getByRole("dialog", {
    name: "Crear turno",
  });
  await expect(appointmentDialog).toBeVisible();
  await expect(appointmentDialog.getByLabel("Tratamiento")).toHaveValue(
    hygieneVisitId,
  );
  await expect(appointmentDialog.getByLabel("Duración (minutos)")).toHaveValue(
    "45",
  );
});

test("connects patient summary, historical activity, and schedule context", async ({
  page,
}) => {
  await openResetDemoWorkspace(page);
  await page.goto(`/demo/patients/${alexQuinnId}`);

  await expect(page.getByLabel("Resumen del paciente")).toContainText(
    "1 consulta",
  );
  await expect(page.getByLabel("Resumen del paciente")).toContainText(
    "Prefiere turno mañana",
  );
  await expect(page.getByLabel("Resumen del paciente")).toContainText(
    "Sin alerta médica registrada",
  );
  await expect(
    page.getByText(
      "Revisión previa a la profilaxis: encías sanas sin signos de sangrado activo. Se confirma indicación de limpieza semestral.",
    ),
  ).toBeVisible();

  await page.getByRole("button", { name: "Turnos", exact: true }).click();
  await expect(
    page.getByText(
      "Revisión previa a la profilaxis: encías sanas sin signos de sangrado activo. Se confirma indicación de limpieza semestral.",
    ),
  ).toBeHidden();
  await page.getByRole("button", { name: "Notas", exact: true }).click();
  await expect(
    page.getByText(
      "Revisión previa a la profilaxis: encías sanas sin signos de sangrado activo. Se confirma indicación de limpieza semestral.",
    ),
  ).toBeVisible();

  const viewInSchedule = page.getByRole("link", { name: "Ver en la agenda" });
  await expect(viewInSchedule).toHaveAttribute("href", /appointment=/);
  await viewInSchedule.click();
  await expect(
    page.getByRole("dialog", { name: "Detalles del turno" }),
  ).toBeVisible();
});

test("keeps archived patient records read-only while preserving history", async ({
  page,
}) => {
  await openResetDemoWorkspace(page);
  await page.getByRole("link", { name: "Pacientes" }).click();
  await addPatient(page);

  const patientRecord = page.getByRole("link", {
    name: "Ver ficha de E2E Patient",
    exact: true,
  });
  const patientRecordHref = await patientRecord.getAttribute("href");
  expect(patientRecordHref).toBeTruthy();
  await patientRecord.click();
  await page.getByRole("button", { name: "Archivar" }).click();
  await page
    .getByRole("alertdialog", { name: "¿Archivar a E2E Patient?" })
    .getByRole("button", { name: "Archivar paciente" })
    .click();

  await expect(page).toHaveURL(/\/demo\/patients$/);
  await page.goto(patientRecordHref!);
  await expect(page.getByText("Archivado", { exact: true })).toBeVisible();
  await expect(
    page.getByText(/solo lectura y se conserva como referencia histórica/),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Crear turno" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Editar" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Nueva nota" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Archivar" })).toHaveCount(0);
});

test("keeps the archive prerequisite explicit for patients with active appointments", async ({
  page,
}) => {
  await openResetDemoWorkspace(page);
  await page.goto(`/demo/patients/${alexQuinnId}`);

  await expect(
    page.getByText(
      "Cancela o completa los turnos activos antes de archivar a este paciente.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Archivar" })).toHaveCount(0);
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
  await page.getByRole("button", { name: "Cerrar sesión" }).click();

  await expect(page).toHaveURL(/\/demo\/dashboard$/);
  await expect(
    page.getByText(
      "No se pudo cerrar la sesión en el espacio de trabajo. Reintentá.",
      {
        exact: true,
      },
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Cerrar sesión" }),
  ).toBeEnabled();
});

test("resets sample data from the demo controls", async ({ page }) => {
  await openDemoWorkspace(page);
  await page.getByRole("link", { name: "Pacientes" }).click();
  await addPatient(page);

  await openDemoControls(page);
  await page
    .getByRole("button", { name: "Restablecer datos de prueba" })
    .click();
  const confirmation = page.getByRole("alertdialog", {
    name: "¿Restablecer datos de prueba?",
  });
  await confirmation
    .getByRole("button", { name: "Restablecer datos de prueba" })
    .click();

  await expect(page).toHaveURL(/\/demo\/dashboard$/);
  await expect(page.getByRole("status")).toContainText(
    "Datos de prueba restablecidos.",
  );
  await page.getByRole("link", { name: "Pacientes" }).click();
  await page.getByLabel("Buscar paciente").fill(testPatient.identifier);
  await expect(page.getByText(/Ningún paciente coincide/)).toBeVisible();
});

test("signs out and protects the workspace route", async ({ page }) => {
  await openDemoWorkspace(page);
  await openDemoControls(page);
  await page.getByRole("button", { name: "Cerrar sesión" }).click();

  await expect(page).toHaveURL(/\/demo\/access$/);
  await page.goto("/demo/dashboard");
  await expect(page).toHaveURL(/\/demo\/access$/);
});

test("resets the demo workspace to its seeded dataset", async ({ page }) => {
  await openResetDemoWorkspace(page);
  await page.getByRole("link", { name: "Pacientes" }).click();
  await addPatient(page);

  await resetDemoWorkspace(page);
  await page.reload();
  await page.getByLabel("Buscar paciente").fill(testPatient.identifier);

  await expect(
    page.getByRole("heading", {
      name: "Ningún paciente coincide con esta búsqueda.",
    }),
  ).toBeVisible();
});
