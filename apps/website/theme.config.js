/* eslint-disable react-hooks/rules-of-hooks */
import { useRouter } from 'next/router';
import Logo from './components/Logo';

const TITLE_WITH_TRANSLATIONS = {
  'en-US': 'An open-source wallet for the XRPL that lives in the browser.',
};

const theme = {
  projectLink: 'https://github.com/multiverse-wallet/multiverse-wallet',
  docsRepositoryBase:
    'https://github.com/multiverse-wallet/multiverse-wallet/tree/main/apps/website/pages',
  titleSuffix: ' – Multiverse Wallet',
  search: true,
  unstable_flexsearch: true,
  floatTOC: true,
  logo: () => {
    const { locale } = useRouter();
    return (
      <>
        <Logo height={40} />
        <span
          className="mx-2 font-extrabold hidden md:inline select-none"
          title={
            'Multiverse Wallet: ' + (TITLE_WITH_TRANSLATIONS[locale] || '')
          }
        >
          Multiverse Wallet
        </span>
      </>
    );
  },
  head: ({ title, meta }) => {
    const ogImage = meta.image || '/og-image.jpg';
    const ogTitle = title || 'Multiverse Wallet';
    const ogDescription =
      meta.description ||
      'An open-source wallet for the XRPL that lives in the browser.';

    return (
      <>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicon/safari-pinned-tab.svg"
          color="#111111"
        />
        <meta name="msapplication-TileColor" content="#111111" />
        <meta httpEquiv="Content-Language" content="en" />
        <title>{ogTitle}</title>
        <meta name="description" content={ogDescription} />
        <meta name="og:description" content={ogDescription} />
        <meta property="og:image:width" content="279" />
        <meta property="og:image:height" content="279" />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:image" content={ogImage}></meta>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@MrJamesHenry" />
        <meta name="twitter:image" content={ogImage} />
        <meta name="apple-mobile-web-app-title" content="Multiverse Wallet" />
      </>
    );
  },
  footerEditLink: ({ locale }) => {
    switch (locale) {
      default:
        return 'Edit this page on GitHub →';
    }
  },
  footerText: ({ locale }) => {
    switch (locale) {
      default:
        return (
          <div className="grid grid-cols-3">
            <div>
              <span>
                &copy; 2022 Decentralised Advertising Ltd. All rights reserved.
              </span>
            </div>
            <div></div>
            <div>
              <div>
                <a href="/privacy-policy">Privacy Policy</a>
              </div>
              <div>
                <a href="/cookie-policy">Cookie Policy</a>
              </div>
              <div>
                <a href="/terms-and-conditions">Terms and Conditions</a>
              </div>
            </div>
          </div>
        );
    }
  },
};

export default theme;
