import { expect, test } from './fixtures';
import { InternalAPI } from '@multiverse-wallet/multiverse';
// import { delay } from '@multiverse-wallet/shared/utils';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    // const api = new InternalAPI();
    // window.__api__ = {
    //   setupRecoveryPhrase() {
    //     console.log('HEL');
    //   }
    // };
  });
});

test('should load the wallet creation screen', async ({
  page,
  extensionId,
}) => {
  await page.goto(`chrome-extension://${extensionId}/index.html`);
  await expect(page.locator('h1')).toHaveText('Welcome to Multiverse');

  // await delay(2000);

  await page.evaluate(async () => {
    // const { InternalAPI, PublicAPI } = await import('@multiverse-wallet/multiverse');
    // const api = new InternalAPI();
    console.log(window);

    window.api.setupRecoveryPhrase({
      password: 'foobar',
      secretRecoveryPhrase:
        'car rival pepper popular arch coast leisure obtain ankle crew credit quarter',
    });
  });

  await page.pause();

  // await delay(30000);

  await expect(page.locator('h1')).toHaveText('Welcome to Multiverse');
});
