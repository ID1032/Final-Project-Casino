import { test } from '@playwright/test';

test('click all game buttons quickly', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.getByRole('button', { name: 'MAIN' }).click();
  await page.getByRole('button', { name: 'CARD' }).click();
  await page.getByRole('button', { name: 'RANDOM' }).click();
  await page.getByRole('button', { name: 'SLOT' }).click();
  await page.getByRole('link', { name: 'LOTTERY' }).click();
});
