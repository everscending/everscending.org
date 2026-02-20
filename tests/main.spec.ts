import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
    await page.goto("http://localhost:5173/");

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/༺ everscending ༻/);

    await expect(
        page.getByRole("link", { name: "AI Engineering Path" }),
    ).toBeVisible();

    await expect(page.getByRole("link", { name: "Resume" })).toBeVisible();
    await expect(page.getByRole("link", { name: "धर्मकाय" })).toBeVisible();
    await expect(page.getByRole("link", { name: "LinkedIn" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Github" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Email" })).toBeVisible();
});

test("home page shows blog section with heading and loading state", async ({
    page,
}) => {
    await page.goto("http://localhost:5173/");

    await expect(page.getByRole("region", { name: "Blog" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Blog" })).toBeVisible();
    await expect(page.getByText("Loading…")).toBeVisible();
});
