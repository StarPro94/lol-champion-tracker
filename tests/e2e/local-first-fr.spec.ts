import { expect, test } from "@playwright/test";

test("affiche la grille en francais et declenche le nain a la validation", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.clear();
  });

  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Suivi des champions" })).toBeVisible();
  await expect(page.getByPlaceholder("Rechercher un champion")).toBeVisible();
  await expect(page.getByRole("img", { name: "Visuel de Aatrox" })).toBeVisible();

  const firstCard = page.locator("article").first();
  await expect(firstCard.getByRole("button", { name: "Valider" })).toBeVisible();
  await firstCard.getByRole("button", { name: "Valider" }).click();

  await expect(page.getByText("Champion validé !")).toBeVisible();
  await expect(firstCard.getByRole("button", { name: "Retirer" })).toBeVisible();
});
