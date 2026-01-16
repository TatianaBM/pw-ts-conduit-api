import { test, expect, request } from '@playwright/test'

test.beforeEach(async ({page}) => {
    await page.goto('https://conduit.bondaracademy.com/')
    // log in 
    await page.getByText('Sign in').click()
    await page.getByPlaceholder('Email').fill('fuchs@gmail.com')
    await page.getByPlaceholder('Password').fill('fuchs123')
    await page.getByRole('button', {name: 'Sign in'}).click()
})

test('gelete article', async ({page, request}) => {
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
    
    // create a new article thru api
    const apiCallLoginArticle = await request.post(
      "https://conduit-api.bondaracademy.com/api/articles/",
      {
        data: {
            article: {
                title: 'Test fuchs',
                description: 'Test description',
                body: "body article",
                tagList: [
                    'Playwright', 'Automation', 'Manual testing'
                ]
            }
        },
        headers: {
            Authorization: `Token ${accessToken}`
        }
      }
    )
    expect(apiCallLoginArticle.status()).toEqual(201)

    // delete an artcle thru UI
    await page.getByRole('link', { name: /Test fuchs/ }).click()
    await page.getByRole('button', {name: 'Delete Article'}).first().click()
   
    await expect(page.locator('app-article-preview h1', {hasText: 'Test fuchs'})).not.toBeVisible()
    await expect(page.locator('app-article-preview a h1').first()).not.toContainText('Test fuchs')
})