import { test, expect } from '@playwright/test';

test.describe('HomePage Component', () => {
  // Before each test, navigate to the homepage
  test.beforeEach(async ({ page }) => {
    // Navigate to the page where the component is rendered
    await page.goto('http://localhost:8000');  // Update this URL if needed
  });


  // Test if the page renders the main components correctly
  test('should render the homepage with necessary elements', async ({ page }) => {
    // Verify that the logo is rendered
    const logo = await page.getByLabel("Platform logo");
    await expect(logo).toBeVisible();

    // Verify that the flags are rendered correctly
    const koreanFlag = await page.getByLabel("Korean flag");
    const japaneseFlag = await page.getByLabel("Japanese flag");;
    const mongolianFlag = await page.getByLabel("Mongolian flag");;
    const chineseFlag = await page.getByLabel("Chinese flag");;
    await expect(koreanFlag).toBeVisible();
    await expect(japaneseFlag).toBeVisible();
    await expect(mongolianFlag).toBeVisible();
    await expect(chineseFlag).toBeVisible();

    // Verify the title 
    const title = await page.getByLabel("Welcome to LanguageGo!");
    await expect(title).toBeVisible();

  });

    // Test if the dashboard is shown only when the user is signed in
    test('should display dashboard with number of sessions and score only when signed in', async ({ page }) => {
      // Initially check that the dashboard is not visible for a signed-out user
      const numSessionsRow = page.getByLabel("Number of Sessions");
      const scoreRow = page.getByLabel("Score");
  
      // Check that the dashboard (number of sessions and score) is not visible when signed out
      await expect(numSessionsRow).not.toBeVisible();
      await expect(scoreRow).not.toBeVisible();
  
    });


  // Test if the "Learning Mode" button navigates to the correct page
  test('should navigate to learning page when Learning Mode button is clicked', async ({ page }) => {
    const learnButton = await page.getByLabel("Learning Mode Button");
    await learnButton.click();

    // Verify if the page navigates to the learning page
    await expect(page).toHaveURL('http://localhost:8000/learnPage');
  });

    // Test if the "LeaderBoard" button navigates to the correct page
    test('should navigate to leaderboard page when LeaderBoard button is clicked', async ({ page }) => {
      const leaderboardButton = await page.getByLabel("Leaderboard Button");
      await leaderboardButton.click();
  
      // Verify if the page navigates to the learning page
      await expect(page).toHaveURL('http://localhost:8000/leaderBoard');
    });

    // Test if the "Practice Mode" button navigates to the correct page
    test('should navigate to practice page when Practice Mode button is clicked', async ({ page }) => {
      const practiceButton = await page.getByLabel("Select Practice Level");
      await practiceButton.click();

      const beginner = await page.getByLabel("Beginner level practice option");
      await beginner.click();
  
      // Verify if the page navigates to the practice page
      await expect(page).toHaveURL('http://localhost:8000/practicePage/beginner');
    });

    // Test if the user tag input works correctly when signed in
    test('should allow updating user tag when signed in', async ({ page }) => {

      await page.getByLabel('Sign In Button').click();
      await page.getByPlaceholder('Enter your email address').click();
      await page.getByPlaceholder('Enter your email address').fill('notreal@brown.edu');
      await page.getByRole('button', { name: 'Continue' }).click();
      await page.getByPlaceholder('Enter your password').fill('notrealnotreal');
      await page.getByRole('button', { name: 'Continue' }).click();
      await page.getByPlaceholder('Enter Here!').click();
      await page.getByPlaceholder('Enter Here!').fill('Lyra');
      await page.getByPlaceholder('Enter Here!').press('Enter');
      await page.getByLabel('Leaderboard Button').click();
      
      const lyra =  page.getByText('Lyra - 155');
      await expect(lyra).toBeVisible();
  });

    // Test that the "Sign Out" button is not visible when a user is not signed in
    test('should display Sign Out button when signed in', async ({ page }) => {
      const signOutButton = await page.getByLabel("Sign Out Button");
      await expect(signOutButton).not.toBeVisible();
    });


    // Test that the "Sign Out" button is  visible when a user is signed in
    test('should display Sign Out button when signed in', async ({ page }) => {
      await page.getByLabel('Sign In Button').click();
      await page.getByPlaceholder('Enter your email address').click();
      await page.getByPlaceholder('Enter your email address').fill('notreal@brown.edu');
      await page.getByRole('button', { name: 'Continue' }).click();
      await page.getByPlaceholder('Enter your password').fill('notrealnotreal');
      await page.getByRole('button', { name: 'Continue' }).click();
      const signOutButton = await page.getByLabel("Sign Out Button");
      await expect(signOutButton).not.toBeVisible();
    });

    // Test if the dropdown menu appears when clicking the "Practice Mode" button
    test('should display the dropdown menu when Practice Mode button is clicked', async ({ page }) => {
      const practiceButton = await page.getByLabel("Select Practice Level");
      await practiceButton.click();

      const beginnerOption = await page.getByLabel("Beginner level practice option");
      const intermediateOption = await page.getByLabel("Intermediate level practice option");
      const advancedOption = await page.getByLabel("Advanced level practice option");
      
      // Ensure that the dropdown menu has the level options
      await expect(beginnerOption).toBeVisible();
      await expect(intermediateOption).toBeVisible();
      await expect(advancedOption).toBeVisible();
    });

    // Tests that switching between practice levels works
    test('test that switching between practice levels works', async ({ page }) => {
      await page.getByLabel('Select Practice Level').click();
      
      const beginner = await page.getByLabel("Beginner level practice option");
      await page.getByLabel('Beginner level practice option').click();
      await expect(page).toHaveURL('http://localhost:8000/practicePage/beginner');
    
      await page.goto('http://localhost:8000/');
      await page.getByLabel('Select Practice Level').click();
      await page.getByLabel('Intermediate level practice').click();
      await expect(page).toHaveURL('http://localhost:8000/practicePage/intermediate');
    });


});


