import { chromium } from '@playwright/test';

export default async function globalSetup() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('http://localhost:3000');
  await page.getByText('Sign in with Google').click();

  // wait for first login 
  await page.waitForURL('**/home');

  // save session after login
  await page.context().storageState({ path: 'storageState.json' });

  await browser.close();
}