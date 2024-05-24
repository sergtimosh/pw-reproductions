import { test, expect } from '@playwright/test';

test.describe('toBeHidden() timeout should has higher priority then "strict mode violation" rule', () => {
    test('toBeHidden() timeout should not be ignored', async ({ page }) => {
        await page.goto('https://playwright.dev/');
        await page.getByLabel('Search').click();
        await page.locator('#docsearch-input').fill(`test`);
        await page.waitForTimeout(2000); // wait for the search results to appear

        const timeout = 10000;
        const start = Date.now();
        await expect(page.locator('[role="option"]'))
            .toBeHidden({ timeout: timeout })
            .catch(e => console.log(e));

        //now test "toBeHidden" actual timeout
        expect(Date.now() - start).toBeGreaterThanOrEqual(timeout);
    });

    test('list elements expected to be hidden should be awaited to hide', async ({ page }) => {
        await test.step('#1 - filter the list by relevant search key', async () => {
            await page.goto('https://playwright.dev/');
            await page.getByLabel('Search').click();
            await page.locator('#docsearch-input').fill(`test`);
            await expect(page.locator('[role="option"]').nth(0)).toBeVisible();
        });
        await test.step('#2 - clear the search key and type some irrelevant one for list elements to be hidden', async () => {
            await page.locator('#docsearch-input').fill('you should never find me');

            await expect(page.locator('[role="option"]')).toBeHidden({ timeout: 10000 });
        });
    });
});
