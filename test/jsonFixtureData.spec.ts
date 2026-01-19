import { test , expect } from '@playwright/test'
import articleData from '../test-data/article.json' with { type: "json" }

test('confirm number of articles created', async ({page, request}) => {
    // confirm default 10 articles
    const numberOfDefaultArticles = 10
    let numberOfArticles
    const fetchArticles = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0')
    const fetchArticlesResponse = await fetchArticles.json()
    numberOfArticles = fetchArticlesResponse.articles

    expect(numberOfArticles.length).toBe(numberOfDefaultArticles)

    // create an article
    const createArticleApi = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
        data: articleData
    })
    const createArticleResponse = await createArticleApi.json()
    console.log(createArticleResponse)
    const articleSlug = createArticleResponse.article.slug
    expect(createArticleApi.status()).toEqual(201)

    // delete article 
    const deleteArticleApi = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${articleSlug}`, )
    expect(deleteArticleApi.status()).toEqual(204)

    // re-connfirm default 10 articles
    const fetchTotalArticles = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0')
    const response = await fetchTotalArticles.json()
    numberOfArticles = response.articles
    expect(numberOfArticles.length).toBe(numberOfDefaultArticles)
})