import { defineConfig, devices } from '@playwright/test';
import type { TestOptions } from './test-options'
import { loadEnv } from './src/utils/env/loadEnv';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

// Load .env file
loadEnv()
/**
 * See https://playwright.dev/docs/test-configuration.
 */
// add TestOptions type to defineConfig
export default defineConfig<TestOptions>({
  testDir: './test',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['json', {outputFile: 'test-results/jsonReport.json'}],
    ['junit', {outputFile: 'test-results/junitReport.xml'}],
    ['allure-playwright']
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: process.env.BASE_URL,
    gitHubRealProjectUrl: 'https://github.com/gothinkster/realworld',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    extraHTTPHeaders: {
      Authorization: `Token ${process.env.ACCESS_TOKEN}`
    },
    video: {
      mode: 'on',
      size: {
        width: 1920, 
        height: 1080
      }
    }
  },
  //globalSetup: './global-setup',
  //globalTeardown: './global-teardown',

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'setup',
      testMatch: 'auth.setup.ts'
    },

    {
      name: 'articleSetup',
      testMatch: 'newArticle.setup.ts',
      dependencies: ['setup'],
      teardown: 'articleCleanUp'
    },

    {
      name: 'articleCleanUp',
      testMatch: 'articleCleanUp.setup.ts'
    },

    {
      name: 'likesCounterProjectLevel',
      testMatch: 'likesCounterWithProjectSetupTearDownSetup.spec.ts',
      use: { ...devices['Desktop Chrome'], storageState: '.auth/user.json'},
      dependencies: ['articleSetup']
    },

    {
      name: 'likesCounterGlobalLevel',
      testMatch: 'likesCounterWithGlobalSetupTearDown.spec.ts',
      use: { ...devices['Desktop Chrome'], storageState: '.auth/user.json'},
    },

    {
      name: 'regression',
      testIgnore: ['likesCounterWithProjectSetupTearDownSetup.spec.ts', 'likesCounterWithGlobalSetupTearDown.spec.ts'],
      use: { ...devices['Desktop Chrome'], storageState: '.auth/user.json'},
      dependencies: ['setup'],
    },

    {
      name: 'firefox',
      use: { 
        browserName: 'firefox', 
        storageState: '.auth/user.json',
        // turn video off for firefox project
        video: {
          mode: 'off',
          size: {
            width: 1920, 
            height: 1080
          }
        }},
      dependencies: ['setup'],
      // overwrite default timeout
      timeout: 60000
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], storageState: '.auth/user.json' },
      dependencies: ['setup'],
    },

    {
      name: 'mobile',
      testMatch: 'testMobile.spec.ts',
      use: {
        ...devices['iPhone 14 Pro'],
        //viewport: { width: 414, height: 800}
      },
      dependencies: ['setup'],
    },

    // create your own project
    {
      name: 'Create Article UI',
      testMatch: 'intercept.spec.ts',
      use: { 
        storageState: '.auth/user.json',
        viewport: {
          width: 1920,
          height: 1080
        }
       },
      dependencies: ['setup'],
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
