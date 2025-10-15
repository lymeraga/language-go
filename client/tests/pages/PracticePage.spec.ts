import { test, expect } from "@playwright/test";

test.describe("PracticePage Functionality", () => {
  test.beforeEach(async ({ page }) => {
    // Mock the sentences data
    await page.route('**/Korean_sentences.json', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          sentences: [
            {
              level: 'beginner',
              sentence: '안녕 하세요',
              word_translation: {
                '안녕': 'hello',
                '하세요': 'formal greeting'
              }
            },
            {
              level: 'beginner',
              sentence: '감사 합니다',
              word_translation: {
                '감사': 'thank you',
                '합니다': 'formal ending'
              }
            }
          ]
        })
      });
    });

    await page.goto("http://localhost:8000/practicePage/beginner");
    await page.waitForLoadState('networkidle');
  });

  test("should render initial practice page elements", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Practice Korean (beginner)");
    await expect(page.locator('[class*="practice-page"]')).toBeVisible();
    await expect(page.locator('[class*="sentence-container"]')).toBeVisible();
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(page.locator('[class*="timer-container"]')).toBeVisible();
  });

  test("should display Korean sentence and handle correct input", async ({ page }) => {
    await page.waitForSelector('[class*="word"]');
    
    const firstWord = await page.locator('[class*="word"]').first().textContent();
    const input = page.locator('input[type="text"]');
    
    await input.type((firstWord?.split('hello')[0] || '') + " ");
    
    // Use a more specific selector for the correct state
    await expect(page.locator(`[class*="word"]:has-text("${firstWord}")`).first())
      .toHaveClass(/correct/);
    
    await expect(input).toHaveValue("");
  });

  test("should show feedback for incorrect input", async ({ page }) => {
    await page.waitForSelector('input[type="text"]');
    const input = page.locator('input[type="text"]');
    
    await input.type("incorrect ");
    
    await expect(input).toHaveClass(/incorrect/);
    await expect(input).toHaveValue("");
  });

  test("should track progress as words are completed", async ({ page }) => {
    await page.waitForSelector('[class*="word"]');
    await page.waitForSelector('input[type="text"]');

    const firstWord = await page.locator('[class*="word"]').first().textContent();
    const input = page.locator('input[type="text"]');
    
    await input.type((firstWord?.split('hello')[0] || '') + " ");
    
    // Use a more specific selector for the correct state
    await expect(page.locator(`[class*="word"]:has-text("${firstWord}")`).first())
      .toHaveClass(/correct/);
  });

  test("should handle pause functionality", async ({ page }) => {
    await page.waitForSelector('img[alt="Pause"]');
    await page.locator('img[alt="Pause"]').click();
    
    await expect(page.locator('[class*="pause-overlay"]')).toBeVisible();
    await expect(page.locator('input[type="text"]')).toBeDisabled();
    
    await page.getByRole('button', { name: 'Continue Lesson' }).click();
    
    await expect(page.locator('[class*="pause-overlay"]')).toBeHidden();
    await expect(page.locator('input[type="text"]')).toBeEnabled();
  });

  test("should track time spent", async ({ page }) => {
    await page.waitForSelector('[class*="timer-text"]');
    const initialTime = await page.locator('[class*="timer-text"]').textContent();
    
    await page.waitForTimeout(3000);
    
    const updatedTime = await page.locator('[class*="timer-text"]').textContent();
    expect(updatedTime).not.toBe(initialTime);
  });

  test("should display word translations on hover", async ({ page }) => {
    await page.waitForSelector('[class*="word"]');
    await page.locator('[class*="word"]').first().hover();
    
    await page.waitForSelector('[class*="tooltip"]');
    const tooltip = await page.locator('[class*="tooltip"]').first();
    await expect(tooltip).toBeVisible();
    await expect(tooltip).not.toHaveText("No translation available");
  });
});