import { expect, test } from '@playwright/test'
import { generateArticle } from "../src/test-data/generateArticleData.js";

test('check network response', async ({page, request}) => {
    const articleData = generateArticle()
    console.log('gen data', articleData)
    const createArticleApi = await request.post(
        "https://conduit-api.bondaracademy.com/api/articles/",
        {
        data: articleData,
        },
    )

    const articlePromise = page.waitForResponse('**/articles?limit=10&offset=0')

    await page.goto('/')
    const response = await articlePromise
    const allArticles = await response.json()
    const {title, description, body, tagList } = allArticles.articles[0]
    const actualArticledata = {
        title: title,
        description: description,
        body: body,
        tagList: tagList
    }

    expect(actualArticledata, ' same article data ').toEqual(articleData.article)
})