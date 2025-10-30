import { test } from '@playwright/test';

test('user sees home with valid session', async ({ page, context }) => {
    await page.goto('http://localhost:3000');
    await page.getByText('Log in').click();
    await page.getByText('Sign in with Google').click();
    await context.addCookies([
      {
        name: 'session',
        value: 'mocked-session-token',
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
      },
    ]);
  await page.goto('http://localhost:3000/home');
});


