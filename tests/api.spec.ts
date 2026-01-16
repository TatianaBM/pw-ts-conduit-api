import { test, expect } from '@playwright/test';
import mockData from '../test-data/tags.json' with { type: "json" }

test.beforeEach(async ({page}) => {
  // create a mock
  // add */** to simplify the look, */** means we want to match any pattern 
  await page.route('*/**/api/tags', async route => {
    await route.fulfill({
      body: JSON.stringify(mockData)
    })
  })

  await page.goto('https://conduit.bondaracademy.com/')
})

test('has title', async ({ page }) => {
  // Expect "to contain" a substring.
  await expect(page.locator('.navbar-brand')).toHaveText(/conduit/);
})

test('check tags', async ({ page }) => {
  await expect(page.locator('.tag-list a')).toHaveText(mockData.tags);
})