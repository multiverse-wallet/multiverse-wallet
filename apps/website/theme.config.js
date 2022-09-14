/* eslint-disable react-hooks/rules-of-hooks */
import { DownloadIcon } from "@heroicons/react/solid";
import Image from "next/image";
import { useRouter } from "next/router";

const Logo = ({ height }) => (
    <svg height={height} xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 1366 768"><path fill="black" d="M558.18,594c-16.78,0-31.93-9.45-41.57-25.95a71.28,71.28,0,0,1-.6-69.78l182.45-324.2c9.51-16.91,25.28-27,42.17-27h68.81c16.78,0,31.94,9.46,41.58,25.95a71.32,71.32,0,0,1,.6,69.79L669.17,567c-9.51,16.91-25.28,27-42.17,27Z"/><path fill="black" d="M809.44,157.09c13.14,0,25.15,7.65,32.95,21a61.14,61.14,0,0,1,.51,59.83L660.46,562.12C652.74,575.84,640.23,584,627,584H558.18c-13.13,0-25.14-7.65-32.94-21a61.13,61.13,0,0,1-.51-59.84L707.17,179c7.72-13.71,20.23-21.9,33.46-21.9h68.81m0-20H740.63c-20.49,0-39.61,12.06-50.89,32.1L507.3,493.38C480.59,540.84,509.65,604,558.18,604H627c20.49,0,39.61-12.06,50.88-32.09l182.45-324.2C887,200.28,858,137.09,809.44,137.09Z"/><path fill="black" d="M925.69,594.12c-16.78,0-31.93-9.46-41.57-26a71.3,71.3,0,0,1-.6-69.79L1066,174.18c9.51-16.91,25.28-27,42.17-27H1177c16.78,0,31.94,9.46,41.58,25.95a71.32,71.32,0,0,1,.6,69.79L1036.68,567.11c-9.52,16.91-25.28,27-42.18,27Z"/><path fill="black" d="M1177,157.18c13.14,0,25.15,7.65,33,21a61.14,61.14,0,0,1,.51,59.83L1028,562.21c-7.72,13.72-20.22,21.91-33.45,21.91H925.69c-13.13,0-25.14-7.66-32.94-21a61.16,61.16,0,0,1-.52-59.84l182.45-324.19c7.72-13.72,20.23-21.91,33.46-21.91H1177m0-20h-68.81c-20.49,0-39.61,12.06-50.89,32.1L874.81,493.47c-26.71,47.46,2.35,110.65,50.88,110.65h68.82c20.49,0,39.61-12.06,50.88-32.1l182.45-324.2c26.71-47.45-2.36-110.64-50.89-110.64Z"/><path fill="black" d="M192.42,594.12c-16.79,0-31.94-9.46-41.58-26a71.32,71.32,0,0,1-.6-69.79l182.45-324.2c9.51-16.91,25.28-27,42.17-27h68.81c16.79,0,31.94,9.46,41.58,25.95a71.32,71.32,0,0,1,.6,69.79L303.4,567.11c-9.51,16.91-25.28,27-42.17,27Z"/><path fill="black" d="M443.67,157.18c13.14,0,25.15,7.65,32.95,21a61.14,61.14,0,0,1,.51,59.83L294.69,562.21c-7.72,13.72-20.23,21.91-33.46,21.91H192.42c-13.14,0-25.15-7.66-32.95-21a61.16,61.16,0,0,1-.51-59.84L341.4,179.09c7.72-13.72,20.23-21.91,33.46-21.91h68.81m0-20H374.86c-20.49,0-39.61,12.06-50.89,32.1L141.53,493.47c-26.71,47.46,2.36,110.65,50.89,110.65h68.81c20.49,0,39.61-12.06,50.89-32.1l182.44-324.2c26.71-47.45-2.35-110.64-50.89-110.64Z"/><path fill="white" d="M559,594c-16.89,0-32.66-10.09-42.17-27L334.35,242.83A71.32,71.32,0,0,1,335,173c9.64-16.49,24.79-25.95,41.58-25.95h68.81c16.89,0,32.66,10.09,42.17,27L670,498.29a71.28,71.28,0,0,1-.6,69.78c-9.64,16.5-24.79,25.95-41.58,25.95Z"/><path fill="black" d="M445.34,157.09c13.23,0,25.74,8.19,33.46,21.9l182.44,324.2a61.16,61.16,0,0,1-.51,59.84c-7.8,13.34-19.81,21-33,21H559c-13.23,0-25.74-8.18-33.46-21.9L343.07,237.92a61.14,61.14,0,0,1,.51-59.83c7.8-13.35,19.81-21,32.95-21h68.81m0-20H376.53c-48.53,0-77.6,63.19-50.89,110.64l182.44,324.2C519.36,592,538.48,604,559,604h68.81c48.54,0,77.6-63.18,50.89-110.64L496.23,169.19c-11.28-20-30.4-32.1-50.89-32.1Z"/><path fill="white" d="M923.29,594c-16.89,0-32.66-10.09-42.17-27L698.67,242.83a71.32,71.32,0,0,1,.59-69.79c9.65-16.49,24.8-25.95,41.58-25.95h68.82c16.89,0,32.65,10.09,42.17,27l182.45,324.2a71.3,71.3,0,0,1-.6,69.78C1024,584.57,1008.88,594,992.1,594Z"/><path fill="black" d="M809.66,157.09c13.23,0,25.73,8.19,33.45,21.9l182.45,324.2a61.16,61.16,0,0,1-.51,59.84c-7.8,13.34-19.81,21-32.95,21H923.29c-13.23,0-25.74-8.18-33.46-21.9L707.38,237.92a61.14,61.14,0,0,1,.52-59.83c7.8-13.35,19.81-21,32.94-21h68.82m0-20H740.84c-48.53,0-77.59,63.19-50.88,110.64L872.4,571.93C883.68,592,902.8,604,923.29,604H992.1c48.53,0,77.6-63.18,50.89-110.64L860.54,169.19c-11.27-20-30.39-32.1-50.88-32.1Z"/></svg>
);

const TITLE_WITH_TRANSLATIONS = {
  "en-US":
    "Headless Components and Hooks for building React applications on the XRP Ledger",
};

const theme = {
  projectLink: "https://github.com/decentralised-advertising/multiverse-wallet",
  docsRepositoryBase:
    "https://github.com/decentralised-advertising/multiverse-wallet/tree/main/apps/website/pages",
  titleSuffix: " – Multiverse Wallet",
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
          title={"Multiverse Wallet: " + (TITLE_WITH_TRANSLATIONS[locale] || "")}
        >
          Multiverse Wallet
        </span>
      </>
    );
  },
  head: ({ title, meta }) => {
    const ogImage = meta.image || "/og-image.jpg";
    const ogTitle = title || "Multiverse Wallet";
    const ogDescription =
      meta.description ||
      "Headless Components and Hooks for building React applications on the XRP Ledger.";

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
        return "Edit this page on GitHub →";
    }
  },
  footerText: ({ locale }) => {
    switch (locale) {
      default:
        return (
          <span>
            &copy; 2022 Decentralised Advertising Ltd. All rights reserved.
          </span>
        );
    }
  },
};

export default theme;
