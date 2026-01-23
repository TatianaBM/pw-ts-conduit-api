import { test } from '../test-options'
import { expect } from '@playwright/test'

test('github url', async ({page, gitHubRealProjectUrl}) => {
    await page.goto(gitHubRealProjectUrl)
    await expect(page.locator('[itemprop="author"] a')).toHaveText('gothinkster')
})

test('bondar academy url', async ({ page }) => {
    await page.goto(process.env.BONDARACADEMYURL!)
    await expect( page.locator('h1[data-element-id="heading1Large"]')).toHaveText('Learn Test Automation')
})
