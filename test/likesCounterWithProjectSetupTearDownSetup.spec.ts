import { test, expect } from '@playwright/test'

test('article like increase PROJECT set up example', async({page}) => {
    await page.goto('/')
    await page.locator('.nav-link', {hasText: 'Global Feed'}).click()
    await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0')
    const firstLikeButton = page.locator('.article-preview').first().locator('button')
    expect(firstLikeButton).toContainText('0')
    await firstLikeButton.click()
    await page.waitForResponse('**/favorite')
    expect(firstLikeButton).toContainText('1')
})