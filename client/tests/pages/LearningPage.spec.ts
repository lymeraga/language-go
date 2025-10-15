import { test, expect } from "@playwright/test";

test.describe("LearnPage Functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:8000/learnPage"); // Adjust base URL as needed
  });

  test("should navigate to LearnPage and render elements", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("Learn Korean");
    await expect(page.locator('[data-testid="progress-bar"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="card-container"]')).toBeVisible();
    await expect(page.locator('[data-testid="timer-text"]')).toBeVisible();
  });

  test("should allow correct key input and update progress", async ({ page }) => {
    const initialCharacter = await page.locator('[data-testid="card-character"]').textContent();
    const romanization = await page.locator('[data-testid="card-romanization"]').textContent();
  
    const key = romanization?.replace("Press: ", "").toLowerCase();
    console.log("Key being pressed:", key);
  
    if (key) {
      await page.keyboard.press(key);
    }
  
    // Wait for updates
    await page.waitForTimeout(500);
  
    // Check if the character has changed
    const updatedCharacter = await page.locator('[data-testid="card-character"]').textContent();
    console.log("Updated character:", updatedCharacter);
  
    expect(updatedCharacter).not.toBe(initialCharacter); // Ensure new character appears
  });
  
  

  test("should show feedback for incorrect key input", async ({ page }) => {
    const initialCharacter = await page.locator('[data-testid="card-character"]').textContent();
  
    // Simulate typing an incorrect key
    await page.keyboard.press("x");
  
    // Verify incorrect feedback appears
    await expect(page.locator('[data-testid="feedback-incorrect"]')).toBeVisible();
  
    // Verify character does not change
    const characterAfterInput = await page.locator('[data-testid="card-character"]').textContent();
    expect(characterAfterInput).toBe(initialCharacter);
  });
  

  test("should update timer during the lesson", async ({ page }) => {
    const initialTime = await page.locator('[data-testid="timer-text"]').textContent();

    // Wait for 3 seconds to check timer updates
    await page.waitForTimeout(3000);

    const updatedTime = await page.locator('[data-testid="timer-text"]').textContent();
    expect(updatedTime).not.toBe(initialTime); // Timer should increment
  });

  test("should toggle hints visibility", async ({ page }) => {
    const toggleButton = page.locator('[data-testid="toggle-slider"]');
    const hintText = page.locator('[data-testid="card-romanization"]');

    await toggleButton.waitFor({ state: "visible" }); // Ensure toggle is visible
    await toggleButton.click();
    await expect(hintText).toBeHidden(); // Hints hidden

    await toggleButton.click();
    await expect(hintText).toBeVisible(); // Hints visible
  });

  test("should show progress bar at 0 on initial load", async ({ page }) => {
    // Wait for the page to load
    await page.waitForSelector('[data-testid="progress-bar"]');
  
    // Check that the progress bar is at 0%
    const progressValue = await page.locator('[data-testid="progress-bar"]').getAttribute("aria-valuenow");
    expect(Number(progressValue)).toBe(0);
  });
});
