import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
    await page.goto("http://localhost:5173/");

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/༺ everscending ༻/);

    await expect(
        page.getByRole("link", { name: "AI Engineering Path" }),
    ).toBeVisible();

    await expect(
        page.getByRole("link", { name: "Agentic Digital Twin" }),
    ).toBeVisible();

    await expect(page.getByRole("link", { name: "Resume" })).toBeVisible();
    await expect(page.getByRole("link", { name: "LinkedIn" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Dharmakaya" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Contact" })).toBeVisible();
});
