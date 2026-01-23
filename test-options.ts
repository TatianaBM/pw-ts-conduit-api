import { test as base } from '@playwright/test'

export type TestOptions = {
    gitHubRealProjectUrl: string
}

// we either provide a default value or empty string '' and later overwrite it in config file
export const test = base.extend<TestOptions>({
    gitHubRealProjectUrl: ['', { option: true}]
})

// now we need to import it inside of config file