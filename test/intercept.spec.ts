import { test, expect, request } from '@playwright/test'

// test.beforeEach(async ({page}) => {
//     await page.goto('https://conduit.bondaracademy.com/')
//     // log in 
//     await page.getByText('Sign in').click()
//     await page.getByPlaceholder('Email').fill('fuchs@gmail.com')
//     await page.getByPlaceholder('Password').fill('fuchs123')
//     await page.getByRole('button', {name: 'Sign in'}).click()
// })

test('create an article thru ui', async ({page, request}) => {
    // create an article thru UI
    await page.goto('https://conduit.bondaracademy.com/')
    await page.locator('li.nav-item', {hasText: 'New Article'}).click()
    await page.getByPlaceholder('Article Title').fill('new test article')
    await page.getByPlaceholder('What\'s this article about?').fill('new test article description')
    await page.getByPlaceholder('Write your article (in markdown)').fill('new test article body')
    await page.getByRole('button', {name: 'Publish Article'}).click()
    // wait for the call to be finished and save the response
    const responseArticle = await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/')
    const responseArticleBody = await responseArticle.json()
    const articleSlug = responseArticleBody.article.slug
    
    // delete article thru api
    const deleteResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${articleSlug}`)
    expect(deleteResponse.status()).toEqual(204)
    await page.locator('li.nav-item', {hasText: 'Home'}).click()
    await expect(page.locator('app-article-preview a h1').first()).not.toContainText('new test article')
})