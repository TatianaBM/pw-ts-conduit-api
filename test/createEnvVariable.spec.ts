import { test } from '../test-options'
import { expect } from '@playwright/test'

test('redirect to github', async ({page, gitHubRealProjectUrl}) => {
    await page.goto(gitHubRealProjectUrl)
})
