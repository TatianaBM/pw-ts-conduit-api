import {
  generateArticle,
  generateArticleComment,
} from "../src/test-data/generateArticleData.js";
import { test, expect } from "@playwright/test";

test.describe.configure({retries: 2})

test("reconfirm number of comments after deletion of one", async ({
  page,
  request
}, testInfo) => {
  // set a condition e.g. clean the database before test retry
  if(testInfo.retry) {
    // code to clean database before running test again
  }

  // create an article tru api
  const createArticleApi = await request.post(
    "https://conduit-api.bondaracademy.com/api/articles/",
    {
      data: generateArticle(),
    },
  );
  const createArticleResponse = await createArticleApi.json();
  const articleSlug = createArticleResponse.article.slug;
  expect(createArticleApi.status()).toEqual(201);

  // add comments
  const addComment1 = await request.post(
    `https://conduit-api.bondaracademy.com/api/articles/${articleSlug}/comments`,
    {
      data: {
        comment: {
          body: generateArticleComment(),
        },
      },
    },
  );
  expect(addComment1.status()).toEqual(200);
  const addComment2 = await request.post(
    `https://conduit-api.bondaracademy.com/api/articles/${articleSlug}/comments`,
    {
      data: {
        comment: {
          body: generateArticleComment(),
        },
      },
    },
  );
  expect(addComment2.status()).toEqual(200);
  const addComment3 = await request.post(
    `https://conduit-api.bondaracademy.com/api/articles/${articleSlug}/comments`,
    {
      data: {
        comment: {
          body: generateArticleComment(),
        },
      },
    },
  );
  expect(addComment3.status()).toEqual(200);

  // verify comments on UI
  await page.goto('https://conduit.bondaracademy.com/')
  await page.locator('.preview-link h1', {hasText: createArticleResponse.article.title}).click()
  await page.waitForResponse(`https://conduit-api.bondaracademy.com/api/articles/${articleSlug}`)
  await page.waitForResponse(`https://conduit-api.bondaracademy.com/api/articles/${articleSlug}/comments`)
  // get comments text
  const commentsText = await page.locator('p.card-text').allTextContents()
  // confirm number of comments
  await expect(page.locator('p.card-text')).toHaveCount(3)
  // delete first comment
  await page.locator('.card-footer .ion-trash-a').first().click()
  // re-confirm number of comments
  await expect(page.locator('p.card-text')).toHaveCount(2)
  // confirm comments text
  await expect(page.locator('p.card-text')).toHaveText(commentsText.slice(1))


  // delete article
  const deleteArticleApi = await request.delete(
    `https://conduit-api.bondaracademy.com/api/articles/${articleSlug}`,
  );
  expect(deleteArticleApi.status()).toEqual(204)
});
