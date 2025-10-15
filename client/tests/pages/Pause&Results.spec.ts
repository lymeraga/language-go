import { test, expect } from '@playwright/test';

test.describe('Learn Page - Pause and Results Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8000/');
  });

  test('pause functionality works correctly', async ({ page }) => {
    await page.getByLabel('Learning Mode Button').click();

    // Check initial timer state
    const timerText = await page.getByTestId('timer-text');
    await expect(timerText).toBeVisible();
    
    // Test pause functionality
    const pauseButton = page.getByRole('img', { name: 'Pause' });
    await pauseButton.click();
    
    // Verify pause overlay appears
    const pauseOverlay = page.getByRole('heading', { name: 'Lesson Paused' });
    await expect(pauseOverlay).toBeVisible();
    await expect(page.getByText('Your lesson is currently on hold.')).toBeVisible();
    
    // Test continue button
    const continueButton = page.getByRole('button', { name: 'Continue Lesson' });
    await continueButton.click();
    await expect(pauseOverlay).not.toBeVisible();
    
    // Test return to menu from pause screen
    await pauseButton.click();
    const returnButton = page.getByRole('button', { name: 'Return to Menu' });
    await returnButton.click();
    
    // Verify we're back at the main menu
    await expect (page.getByLabel('Welcome to LanguageGo!')).toBeVisible();
    await expect(page.getByLabel('Learning Mode Button')).toBeVisible();
  });


  test('completion results display correctly', async ({ page }) => {
    // Complete the lesson (simulating all correct answers)
    await page.getByLabel('Learning Mode Button').click();

    // Loop to process cards until no more prompts are available
    const getCurrentKey = async () => {
        const romanization = await page.getByTestId('card-romanization').textContent();
        if (!romanization) return { key: '', needsShift: false };
        
        // Remove "Press: " prefix and trim
        const instruction = romanization.replace('Press: ', '').trim();
        
        // Check if it requires Shift
        if (instruction.startsWith('Shift + ')) {
            return {
            key: instruction.replace('Shift + ', ''),
            needsShift: true
            };
        }
        
        return {
            key: instruction,
            needsShift: false
        };
        };
    
        // Complete the lesson by entering correct characters
        while (true) {
        try {
            // Check if lesson completion overlay is visible
            const completionOverlay = await page.getByRole('heading', { name: 'Lesson Completed' }).isVisible();
            if (completionOverlay) break;
    
            // Get the current key information
            const { key, needsShift } = await getCurrentKey();
            
            if (needsShift) {
            await page.keyboard.down('Shift');
            await page.keyboard.press(key);
            await page.keyboard.up('Shift');
            } else {
            await page.keyboard.press(key);
            }
            
            await page.waitForTimeout(600);
    
        } catch (error) {
            console.log('Error during lesson completion:', error);
            break;
        }
        }
    
        // Verify completion overlay and stats
        await expect(page.getByRole('heading', { name: 'Lesson Completed' })).toBeVisible();
        await expect(page.getByText('Total Time:')).toBeVisible();
        await expect(page.getByText('Total Attempts:')).toBeVisible();
        //await expect(page.getByText('Correct Attempts:')).toBeVisible();
        await expect(page.getByText('Incorrect Attempts:')).toBeVisible();
        await expect(page.getByText('Accuracy:')).toBeVisible();
  });

  test('timer continues accurately after unpausing', async ({ page }) => {
    await page.getByLabel('Learning Mode Button').click();

    // Record initial time
    const initialTime = await page.getByTestId('timer-text').textContent();
    
    // Pause for 2 seconds
    await page.getByRole('img', { name: 'Pause' }).click();
    await page.waitForTimeout(2000);
    
    // Unpause
    await page.getByRole('button', { name: 'Continue Lesson' }).click();
    
    // Wait a second and check time
    await page.waitForTimeout(1000);
    const finalTime = await page.getByTestId('timer-text').textContent();
    
    // Verify time difference is approximately 1 second (not counting pause time)
    const getSeconds = (timeStr) => {
      const [mins, secs] = timeStr.replace('Time: ', '').split(':').map(Number);
      return mins * 60 + secs;
    };
    
    const initialSeconds = getSeconds(initialTime);
    const finalSeconds = getSeconds(finalTime);
    const difference = finalSeconds - initialSeconds;
    
    // Allow for some timing variance but should be close to 1 second
    expect(difference).toBeLessThanOrEqual(2);
    expect(difference).toBeGreaterThanOrEqual(0);
  });  
});

///////////////////////////////// TESTS FOR PRACTICE PAGE /////////////////////////////////
test.describe('Practice Page - Pause and Results Functionality', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:8000/');
    });
  
    test('pause functionality works correctly', async ({ page }) => {
        await (page.getByLabel('Select Practice Level')).click();
        await (page.getByRole('button', { name: 'Beginner' })).click();

        // Check initial timer state
        const timerText = await page.getByText('Time: 0:');
        await expect(timerText).toBeVisible();
        
        // Test pause functionality
        const pauseButton = page.getByRole('img', { name: 'Pause' });
        await pauseButton.click();
        
        // Verify pause overlay appears
        const pauseOverlay = page.getByRole('heading', { name: 'Lesson Paused' });
        await expect(pauseOverlay).toBeVisible();
        await expect(page.getByText('Your lesson is currently on hold.')).toBeVisible();
        
        // Test continue button
        const continueButton = page.getByRole('button', { name: 'Continue Lesson' });
        await continueButton.click();
        await expect(pauseOverlay).not.toBeVisible();
        
        // Test return to menu from pause screen
        await pauseButton.click();
        const returnButton = page.getByRole('button', { name: 'Return to Menu' });
        await returnButton.click();
        
        // Verify we're back at the main menu
        await expect (page.getByLabel('Welcome to LanguageGo!')).toBeVisible();
        await expect (page.getByLabel('Select Practice Level')).toBeVisible();
    });

    test('timer continues accurately after unpausing', async ({ page }) => {
        // Navigate to practice level
        await page.getByLabel('Select Practice Level').click();
        await page.getByRole('button', { name: 'Beginner' }).click();
      
        // Function to extract time in seconds
        const getSeconds = (timeStr) => {
          const [mins, secs] = timeStr.replace('Time: ', '').split(':').map(Number);
          return mins * 60 + secs;
        };
      
        // Record initial time
        const timerElement = page.getByText(/Time: \d+:\d+/);
        const initialText = await timerElement.textContent();
        const initialSeconds = getSeconds(initialText);
      
        // Pause for 2 seconds
        await page.getByRole('img', { name: 'Pause' }).click();
        await page.waitForTimeout(2000);
      
        // Unpause
        await page.getByRole('button', { name: 'Continue Lesson' }).click();
      
        await page.waitForTimeout(1000);
      
        // Record final time
        const finalText = await timerElement.textContent();
        const finalSeconds = getSeconds(finalText);
      
        // Verify time difference
        const difference = finalSeconds - initialSeconds;
      
        // Allow slight timing variance
        expect(difference).toBeGreaterThanOrEqual(1);
        expect(difference).toBeLessThanOrEqual(2);
      });
      
});