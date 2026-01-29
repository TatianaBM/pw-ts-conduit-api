import { request, expect } from '@playwright/test'
import { generateArticle } from "./src/test-data/generateArticleData"
import user from "./.auth/user.json" with { type: "json" }
import fs from "fs";

const authFile = ".auth/user.json"

async function globalSetup() {
    // create a new context
    const context = await request.newContext()

    // get token
    const apiCallLogin = await context.post(
        "https://conduit-api.bondaracademy.com/api/users/login",
        {
          data: {
            user: {
              email: process.env.USEREMAIL,
              password: process.env.USERPASSWORD,
            },
          },
        },
      );
    expect(apiCallLogin.status()).toEqual(200);
    const responseBody = await apiCallLogin.json();
    const accessToken = responseBody.user.token;
    if (!accessToken) {
        throw new Error("Login failed: No access token received");
    }
    if (user.origins?.[0]?.localStorage?.[0]) {
        user.origins[0].localStorage[0].value = accessToken;
    } else {
        throw new Error("User storage structure is invalid");
    }
    fs.writeFileSync(authFile, JSON.stringify(user))
    process.env["ACCESS_TOKEN"] = accessToken

    // create an acticle
    const createArticleApi = await context.post(
        "https://conduit-api.bondaracademy.com/api/articles/",
        {
          data: generateArticle(),
          headers: {
            Authorization: `Token ${process.env.ACCESS_TOKEN}`
          }
        },
      );
      const createArticleResponse = await createArticleApi.json();
      const articleSlug = createArticleResponse.article.slug;
      process.env['SLUGID'] = articleSlug
      expect(createArticleApi.status()).toEqual(201)
}

export default globalSetup