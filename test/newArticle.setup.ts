import { test as setup , expect } from '@playwright/test'
import { generateArticle } from "../src/test-data/generateArticleData.js";

setup('create new article', async({page, request}) => {
    const createArticleApi = await request.post(
        "https://conduit-api.bondaracademy.com/api/articles/",
        {
          data: generateArticle(),
        },
      );
      const createArticleResponse = await createArticleApi.json();
      const articleSlug = createArticleResponse.article.slug;
      process.env['SLUGID'] = articleSlug
      expect(createArticleApi.status()).toEqual(201);

})