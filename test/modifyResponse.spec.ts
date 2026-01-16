import { test, expect } from '@playwright/test';


test.beforeEach(async ({page}) => {
  // intercept the call and modify the responce
  await page.route('*/**/api/articles*', async route => {
    // continue api call and get the response
    const response = await route.fetch()
    const responseBody = await response.json()

    // update the response
    responseBody.articles[0].title = 'This is a test title'
    responseBody.articles[0].description = 'This is a test description'

    // fulfill the response
    await route.fulfill({
        body: JSON.stringify(responseBody)
    })
  })

  await page.goto('https://conduit.bondaracademy.com/')
})



test('check tags', async ({ page }) => {
  await expect(page.locator('app-article-preview a h1').first()).toHaveText('This is a test title')
  await expect(page.locator('app-article-preview a p').first()).toHaveText('This is a test description')
})