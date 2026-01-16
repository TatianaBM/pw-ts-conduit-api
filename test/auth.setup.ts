import { test as setup } from '@playwright/test'

const authFile = '.auth/user.json'

setup('authentication', async ({page}) => {
    await page.goto('https://conduit.bondaracademy.com/')
    // log in 
    await page.getByText('Sign in').click()
    await page.getByPlaceholder('Email').fill('fuchs@gmail.com')
    await page.getByPlaceholder('Password').fill('fuchs123')
    await page.getByRole('button', {name: 'Sign in'}).click()
    await page.waitForResponse('https://conduit-api.bondaracademy.com/api/tags')

    await page.context().storageState({ path: authFile})
})
