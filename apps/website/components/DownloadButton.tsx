import React, { useState, useEffect } from 'react';

export function DownloadButton() {
  const [browser, setBrowser] = useState<string>();
  const chromeDownloadUrl =
    'https://chrome.google.com/webstore/detail/multiverse-wallet/goklbepdodmbeolgcflflejbjpanmedo';
  const buttonClassName =
    'bg-black text-white dark:bg-white dark:text-black font-bold shadow-xl flex items-center no-underline p-3 px-6 text-2xl rounded-full';
  const logoClassName =
    'inline ml-2 border-2 border-white w-10 h-10 rounded-full bg-white';
  const ChromeLogo = () => (
    <svg
      className={logoClassName}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-10 -10 276 276"
    >
      <linearGradient
        id="a"
        x1="145"
        x2="34"
        y1="253"
        y2="61"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stop-color="#1e8e3e" />
        <stop offset="1" stop-color="#34a853" />
      </linearGradient>
      <linearGradient
        id="b"
        x1="111"
        x2="222"
        y1="254"
        y2="62"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stop-color="#fcc934" />
        <stop offset="1" stop-color="#fbbc04" />
      </linearGradient>
      <linearGradient
        id="c"
        x1="17"
        x2="239"
        y1="80"
        y2="80"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stop-color="#d93025" />
        <stop offset="1" stop-color="#ea4335" />
      </linearGradient>
      <circle cx="128" cy="128" r="64" fill="#fff" />
      <path
        fill="url(#a)"
        d="M96 183.4A63.7 63.7 0 0 1 72.6 160L17.2 64A128 128 0 0 0 128 256l55.4-96A64 64 0 0 1 96 183.4Z"
      />
      <path
        fill="url(#b)"
        d="M192 128a63.7 63.7 0 0 1-8.6 32L128 256A128 128 0 0 0 238.9 64h-111a64 64 0 0 1 64 64Z"
      />
      <circle cx="128" cy="128" r="52" fill="#1a73e8" />
      <path
        fill="url(#c)"
        d="M96 72.6a63.7 63.7 0 0 1 32-8.6h110.8a128 128 0 0 0-221.7 0l55.5 96A64 64 0 0 1 96 72.6Z"
      />
    </svg>
  );
  const BraveLogo = () => (
    <svg
      className={logoClassName}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 2770 2770"
    >
      <linearGradient id="a" y1="51%" y2="51%">
        <stop offset=".4" stop-color="#f50" />
        <stop offset=".6" stop-color="#ff2000" />
      </linearGradient>
      <linearGradient id="b" x1="2%" y1="51%" y2="51%">
        <stop offset="0" stop-color="#ff452a" />
        <stop offset="1" stop-color="#ff2000" />
      </linearGradient>
      <path
        fill="url(#a)"
        d="M2395 723l60-147-170-176c-92-92-288-38-288-38l-222-252H992L769 363s-196-53-288 37L311 575l60 147-75 218 250 953c52 204 87 283 234 387l457 310c44 27 98 74 147 74s103-47 147-74l457-310c147-104 182-183 234-387l250-953z"
      />
      <path
        fill="#fff"
        d="M1935 524s287 347 287 420c0 75-36 94-72 133l-215 230c-20 20-63 54-38 113 25 60 60 134 20 210-40 77-110 128-155 120a820 820 0 01-190-90c-38-25-160-126-160-165s126-110 150-124c23-16 130-78 132-102s2-30-30-90-88-140-80-192c10-52 100-80 167-105l207-78c16-8 12-15-36-20-48-4-183-22-244-5s-163 43-173 57c-8 14-16 14-7 62l58 315c4 40 12 67-30 77-44 10-117 27-142 27s-99-17-142-27-35-37-30-77c4-40 48-268 57-315 10-48 1-48-7-62-10-14-113-40-174-57-60-17-196 1-244 6-48 4-52 10-36 20l207 77c66 25 158 53 167 105 10 53-47 132-80 192s-32 66-30 90 110 86 132 102c24 15 150 85 150 124s-119 140-159 165a820 820 0 01-190 90c-45 8-115-43-156-120-40-76-4-150 20-210 25-60-17-92-38-113l-215-230c-35-37-71-57-71-131s287-420 287-420l273 44c32 0 103-27 168-50 65-20 110-22 110-22s44 0 110 22 136 50 168 50c33 0 275-47 275-47zm-215 1328c18 10 7 32-10 44l-254 198c-20 20-52 50-73 50s-52-30-73-50a13200 13200 0 00-255-198c-16-12-27-33-10-44l150-80a870 870 0 01188-73c15 0 110 34 187 73l150 80z"
      />
      <path
        fill="url(#b)"
        d="M1999 363l-224-253H992L769 363s-196-53-288 37c0 0 260-23 350 123l276 47c32 0 103-27 168-50 65-20 110-22 110-22s44 0 110 22 136 50 168 50c33 0 275-47 275-47 90-146 350-123 350-123-92-92-288-38-288-38"
      />
    </svg>
  );
  useEffect(() => {
    if (window?.chrome) {
      setBrowser('chrome');
      if ((navigator as any)?.brave?.isBrave) {
        setBrowser('brave');
      }
      return;
    }
    setBrowser('unsupported');
  }, []);
  switch (browser) {
    case 'brave':
      return (
        <a
          target="__blank"
          href={chromeDownloadUrl}
          className={buttonClassName}
        >
          Download for
          <BraveLogo />
        </a>
      );
    case 'chrome':
      return (
        <a
          target="__blank"
          href={chromeDownloadUrl}
          className={buttonClassName}
        >
          Download for
          <ChromeLogo />
        </a>
      );
    case 'unsupported':
      return (
        <div className="flex flex-col items-center rounded-xl p-3 px-6 bg-red-100 text-red-400">
          <div className="text-xl font-bold">
            Sorry, we don&#39;t currently support this browser.
          </div>
          <div className="text-md">Currently supported browsers are:</div>
          <div className="flex mt-3">
            <ChromeLogo />
            <BraveLogo />
          </div>
        </div>
      );
    default:
      return <></>;
  }
}
