import { request , expect } from '@playwright/test'


async function globalTearDown() {
    const slug = process.env.SLUGID;
    const token = process.env.ACCESS_TOKEN;

    expect(slug, 'SLUGID env var is missing').toBeTruthy();
    expect(token, 'ACCESS_TOKEN env var is missing').toBeTruthy();
    
    const context = await request.newContext()
    const deleteArticleApi = await context.delete(
        `https://conduit-api.bondaracademy.com/api/articles/${slug}`,
        {
            headers: {
                Authorization: `Token ${token}`
            }
        }
    )
    expect(deleteArticleApi.status()).toEqual(204)
}

export default globalTearDown