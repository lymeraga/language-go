import { test, expect } from "@playwright/test";
import { setupClerkTestingToken, clerk } from "@clerk/testing/playwright";


const url = "http://localhost:8000";

test("login/logout", async ({ page }) => {
   setupClerkTestingToken({ page });
   await page.goto(url);
   await clerk.loaded({ page });
   const loginButton = page.getByRole("button", { name: "Login" })
   await expect(loginButton).toBeVisible();
  
   await clerk.signIn({
     page,
     signInParams: {
       strategy: "password",
       password: process.env.E2E_CLERK_USER_PASSWORD!,
       identifier: process.env.E2E_CLERK_USER_USERNAME!,
     },
   });
 
 
   const loginText = page.getByText("Welcome");
   await expect(loginText).toBeVisible();
 
 
   await clerk.signOut({ page });
 });

 test('COD access REPL with @brown.edu email', async ({ page }) => {
   await page.goto(url);
   await page.getByLabel('Login').click();
   await page.getByLabel('Email address').click();
   await page.getByLabel('Email address').fill('test@brown.edu');
   await page.getByLabel('Email address').press('Enter');
   await page.getByRole('button', { name: 'Continue', exact: true }).click();
   await page.getByLabel('Password', { exact: true }).click();
   await page.getByLabel('Password', { exact: true }).fill('testtest123');
   await page.getByRole('button', { name: 'Continue' }).click();
   const replHeader = page.getByLabel('Mock Header');
   await expect(replHeader).toBeVisible();
   await clerk.signOut({ page });
 });


 test('COD restrict access for non-@brown.edu email', async ({ page }) => {
   await page.goto(url);
   await page.getByLabel('Login').click();
   await page.getByLabel('Email address').click();
   await page.getByLabel('Email address').fill('test@gmail.com');
   await page.getByRole('button', { name: 'Continue', exact: true }).click();
   await page.getByText('Couldn\'t find your account.').click();
 });

 test('failed login attempt', async ({ page }) => {
   await page.goto(url);
   await page.getByLabel('Login').click();
   await page.getByLabel('Email address').click();
   await page.getByLabel('Email address').fill('test@brown.edu');
   await page.getByRole('button', { name: 'Continue', exact: true }).click();
   await page.getByLabel('Password', { exact: true }).fill('incorrect123');
   await page.getByRole('button', { name: 'Continue' }).click();
   const errorMessage = page.getByText("Password is incorrect.");
   await expect(errorMessage).toBeVisible();
 });
 

 test("restrict access after signing out", async ({ page }) => {
   setupClerkTestingToken({ page });
   await page.goto(url);
   await clerk.loaded({ page });
   const loginButton = page.getByRole("button", { name: "Login" })
   await expect(loginButton).toBeVisible();

   await clerk.signIn({
     page,
     signInParams: {
       strategy: "password",
       password: process.env.E2E_CLERK_USER_PASSWORD!,
       identifier: process.env.E2E_CLERK_USER_USERNAME!,
     },
   });

   await clerk.signOut({ page });
   
   const replHeader = page.getByText("Mock Header");
   await expect(replHeader).not.toBeVisible();
 });
 