import { test, expect } from '@playwright/test';
import { generateTags } from '../src/test-data/generateArticleData'

test('stubbing GET/ acticle call', async ({ page }) => {
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

  await page.goto('/')
  await expect(page.locator('app-article-preview a h1').first()).toHaveText('This is a test title')
  await expect(page.locator('app-article-preview a p').first()).toHaveText('This is a test description')
})

test('stubbing /tags call', async({ page }) => {
  const tagArray = generateTags()
  await page.route('**/tags', async(route) => {
    const response = await route.fetch()
    const responseBody = await response.json()
    responseBody.tags = tagArray
    await route.fulfill({
      //headers: { 'content-type': 'application/json'},
      body: JSON.stringify(responseBody)
    })
  })
  const tagPromise = page.waitForResponse('**/tags')
  await page.goto('/')
  // confirm the application made the GET /tags request
  await tagPromise
  console.log(await page.locator('.sidebar a').allTextContents())
  console.log(tagArray)
  // confirm the application is showing the stubbed tags
  await expect(page.locator('.sidebar a')).toHaveText(tagArray)
})
