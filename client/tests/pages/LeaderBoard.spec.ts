import { test, expect } from '@playwright/test';

test.describe('LeaderBoard Component', () => {
  // Before each test, navigate to the LeaderBoard
  test.beforeEach(async ({ page }) => {
    // Navigate to the page where the component is rendered
    await page.goto('http://localhost:8000/leaderBoard');  // Update this URL if needed
  });

  // Test if the page renders the main components correctly
  test('should render the leaderBoard with necessary elements', async ({ page }) => {
    // Verify that the positions are rendered correctly
    const first = await page.getByText("Tristan -");
    const second = await page.getByText("Lyraa -");
    let third = await page.getByText(":) -");


    await expect(first).toBeVisible();
    await expect(second).toBeVisible();
    await expect(third).toBeVisible();

    // Verify the leaderboard displays correctly
    await expect(third).toHaveText(" :) - 120");

    // Verify the leaderboard updates correctly
    await fetch(
    "http://localhost:3232/storeScore?userid=111&score=10"
    );
    await page.reload();
    third = await page.getByText(":) -");
    await expect(third).toHaveText(" :) - 130");

    // Resetting
    await fetch(
    "http://localhost:3232/storeScore?userid=111&score=-10"
    );

  });

  test('The back button works', async ({ page }) => {

    const back = await page.getByLabel("Home page button");
    await expect(back).toBeVisible();
    await back.click();
    // Verify if the page navigates to the learning page
    await expect(page).toHaveURL('http://localhost:8000');

  });
});
