import { chromium, test as base, type BrowserContext } from '@playwright/test';
import { existsSync } from 'fs';
import path from 'path';

const pathToExtension = path.resolve(
  __dirname,
  '../../../',
  'dist/apps/wallet-unpacked'
);

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
}>({
  context: async ({}, use) => {
    if (!existsSync(pathToExtension)) {
      throw new Error(`
ERROR: No unpacked extension found at: ${pathToExtension}

You must build the browser extension before running these e2e tests.

Run:

yarn build-extension
`);
    }

    const context = await chromium.launchPersistentContext('', {
      headless: false,
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    });
    await use(context);
    await context.close();
  },
  extensionId: async ({ context }, use) => {
    let [background] = context.serviceWorkers();
    if (!background) {
      background = await context.waitForEvent('serviceworker');
    }
    const extensionId = background.url().split('/')[2];
    await use(extensionId);
  },
});

export const expect = test.expect;
