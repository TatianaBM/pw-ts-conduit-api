import { expect, test } from '@playwright/test'

test('switch between env', async ({ page }) => {
    console.log(process.env.USEREMAIL!, ' this is a username')
    console.log(process.env.BASE_URL!)
    await page.goto('/')
    await expect(page.locator('.navbar-brand')).toHaveText('conduit')
})