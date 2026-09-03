import { expect, test, type Page } from "@playwright/test";

const alexQuinnId = "30000000-0000-4000-8000-000000000001";

const primaryViewports = [
  { height: 844, name: "mobile", width: 375 },
  { height: 900, name: "tablet", width: 768 },
  { height: 960, name: "desktop", width: 1280 },
] as const;

const extendedViewports = [
  { height: 932, name: "large mobile", width: 430 },
  { height: 900, name: "small desktop", width: 1024 },
  { height: 960, name: "wide desktop", width: 1440 },
  { height: 1080, name: "large desktop", width: 1920 },
] as const;

test.setTimeout(120_000);

async function openDemoWorkspace(page: Page) {
  await page.goto("/demo/access");
  await page.getByRole("button", { name: "Open demo workspace" }).click();
  await expect(page).toHaveURL(/\/demo\/dashboard$/);
}

async function expectViewportFit(page: Page) {
  await expect(page.locator("main").first()).toBeVisible();

  const dimensions = await page.evaluate(() => ({
    pageWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
  }));

  expect(dimensions.pageWidth).toBeLessThanOrEqual(dimensions.viewportWidth);
}

test("keeps every primary route within the responsive baseline", async ({
  page,
}) => {
  for (const viewport of primaryViewports) {
    await page.setViewportSize(viewport);

    await page.goto("/");
    await expectViewportFit(page);

    await page.goto("/demo/access");
    await expectViewportFit(page);
  }

  await openDemoWorkspace(page);

  const workspaceRoutes = [
    "/demo/dashboard",
    "/demo/schedule",
    "/demo/patients",
    `/demo/patients/${alexQuinnId}`,
    "/demo/treatments",
    "/demo/notes",
  ];

  for (const viewport of primaryViewports) {
    await page.setViewportSize(viewport);

    for (const route of workspaceRoutes) {
      await page.goto(route);
      await expectViewportFit(page);
    }
  }
});

test("uses the intended navigation, directory, and schedule compositions", async ({
  page,
}) => {
  await openDemoWorkspace(page);

  for (const viewport of [primaryViewports[0], extendedViewports[0]]) {
    await page.setViewportSize(viewport);
    await page.goto("/demo/schedule");

    await expect(
      page.getByRole("button", { name: "Open workspace navigation" }),
    ).toBeVisible();
    await expect(
      page.getByRole("region", { name: "Day agenda" }),
    ).toBeVisible();
    await expect(
      page.getByRole("region", { name: "Scrollable week schedule" }),
    ).toBeHidden();
    await expectViewportFit(page);

    await page.goto("/demo/patients");
    await expect(page.getByRole("table")).toBeHidden();
    await expect(
      page.getByRole("link", { name: /Open patient / }).first(),
    ).toBeVisible();
    await expectViewportFit(page);

    await page.goto(`/demo/patients/${alexQuinnId}`);
    await expect(
      page.getByRole("link", { name: "Create appointment" }).first(),
    ).toBeVisible();
    await expectViewportFit(page);
  }

  for (const viewport of [
    primaryViewports[1],
    extendedViewports[1],
    primaryViewports[2],
    extendedViewports[2],
    extendedViewports[3],
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/demo/schedule");

    await expect(
      page.getByRole("region", { name: "Scrollable week schedule" }),
    ).toBeVisible();
    await expect(page.getByRole("region", { name: "Day agenda" })).toBeHidden();
    await expectViewportFit(page);

    await page.goto("/demo/patients");
    await expect(page.getByRole("table")).toBeVisible();
    await expectViewportFit(page);

    await page.goto(`/demo/patients/${alexQuinnId}`);
    await expect(
      page.getByRole("heading", { name: "Relevant treatment" }),
    ).toBeVisible();
    await expectViewportFit(page);
  }

  await page.setViewportSize(primaryViewports[1]);
  await page.goto("/demo/dashboard");
  await expect(
    page.getByRole("button", { name: "Open workspace navigation" }),
  ).toBeVisible();

  await page.setViewportSize(primaryViewports[2]);
  await expect(
    page.getByRole("button", { name: "Open workspace navigation" }),
  ).toBeHidden();
  await expect(
    page.getByRole("navigation", { name: "Workspace navigation" }),
  ).toBeVisible();
});
