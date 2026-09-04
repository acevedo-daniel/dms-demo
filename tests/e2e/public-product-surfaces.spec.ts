import { expect, test } from "@playwright/test";

test("uses finished workspace states as public product proof", async ({
  page,
}) => {
  await page.setViewportSize({ height: 960, width: 1280 });
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "A clearer way to run the practice day.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("img", { name: /DMS Schedule showing/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Engineering signals" }),
  ).toBeVisible();

  for (const signal of [
    "100% Deterministic Seed",
    "Real PostgreSQL",
    "Automated WCAG AA Coverage",
    "Resettable Privacy Boundary",
  ]) {
    await expect(page.getByText(signal, { exact: true })).toBeVisible();
  }

  await expect(
    page.getByRole("link", { name: "Open demo workspace" }).first(),
  ).toBeVisible();
});

test("frames access as a no-account entry point with Today proof", async ({
  page,
}) => {
  await page.goto("/demo/access");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Open the DMS demo workspace",
    }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Back to DMS" })).toHaveAttribute(
    "href",
    "/",
  );
  await expect(
    page.getByText(
      "No account, password, or personal information is required.",
      { exact: false },
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("img", { name: /DMS Today view showing/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Open demo workspace" }),
  ).toBeVisible();
});

test("keeps demo access recovery and authorized redirects intact", async ({
  page,
}) => {
  await page.goto("/demo/access");
  await page.route("**/api/demo/access", async (route) => {
    await route.fulfill({
      body: JSON.stringify({
        error: "The demo workspace could not be opened. Try again.",
      }),
      contentType: "application/json",
      status: 503,
    });
  });

  await page.getByRole("button", { name: "Open demo workspace" }).click();
  await expect(
    page.getByText("The demo workspace could not be opened. Try again."),
  ).toBeVisible();

  await page.unroute("**/api/demo/access");
  await page.getByRole("button", { name: "Open demo workspace" }).click();
  await expect(page).toHaveURL(/\/demo\/dashboard$/);

  await page.goto("/demo/access");
  await expect(page).toHaveURL(/\/demo\/dashboard$/);
});
