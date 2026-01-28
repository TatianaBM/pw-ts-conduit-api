import { test, expect } from '@playwright/test'

test('delete article', async({request}) => {
    const deleteArticleApi = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${process.env.SLUGID}`,
    );
    expect(deleteArticleApi.status()).toEqual(204)
})