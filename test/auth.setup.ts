import { test as setup, expect } from '@playwright/test'
import user from '../.auth/user.json' with { type: "json" }
import fs from 'fs'

const authFile = '.auth/user.json'

setup('authentication', async ({request}) => {
    // UI auth
    // await page.goto('https://conduit.bondaracademy.com/')
    // await page.getByText('Sign in').click()
    // await page.getByPlaceholder('Email').fill('fuchs@gmail.com')
    // await page.getByPlaceholder('Password').fill('fuchs123')
    // await page.getByRole('button', {name: 'Sign in'}).click()
    // await page.waitForResponse('https://conduit-api.bondaracademy.com/api/tags')
    // await page.context().storageState({ path: authFile})

    // log in thru api
    const apiCallLogin = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: {
        "user": {
            "email": "fuchs@gmail.com",
            "password": "fuchs123"
            }
        }
    })
    expect(apiCallLogin.status()).toEqual(200)
    const responseBody = await apiCallLogin.json()
    const accessToken = responseBody.user.token
    if (!accessToken) {
        throw new Error('Login failed: No access token received');
    }
    if (user.origins?.[0]?.localStorage?.[0]) {
        user.origins[0].localStorage[0].value = accessToken;
    } else {
        throw new Error('User storage structure is invalid');
    }
    fs.writeFileSync(authFile, JSON.stringify(user))

    process.env['ACCESS_TOKEN'] = accessToken
})
