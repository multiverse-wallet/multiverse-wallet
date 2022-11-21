import Link from 'next/link';
import { DownloadButton } from './DownloadButton';
import Logo from './Logo';

export default function Hero() {
  return (
    <div className="">
      <div className="bg -z-50 absolute top-0 bottom-0 left-0 right-0"></div>
      <div className="relative overflow-hidden">
        <div className="relative pt-6 pb-16 sm:pb-14">
          <div className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24 sm:px-6">
            <div className="text-center">
              <p className="mb-12">
                <span className="rounded bg-black text-blue-50 px-2.5 py-1 text-xs font-semibold tracking-wide uppercase">
                  Early Alpha Release
                </span>
              </p>
              <div className="flex justify-center">
                <Logo height={100} />
              </div>
              <h1 className="text-5xl tracking-tight font-extrabold md:!text-6xl">
                Multiverse Wallet
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-300 sm:!text-lg md:mt-5 md:!text-2xl md:max-w-3xl">
                An open-source wallet for the XRPL that lives in the browser.
              </p>
              <div className="mt-6 flex justify-center items-center">
                <DownloadButton />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row relative rounded-xl">
          <div className="p-5">
            <img
              className="relative w-3/4 md:w-auto rounded-lg shadow-lg mx-auto border border-slate-50"
              src="/screenshot.png"
              alt="Component"
            />
          </div>
          <div className="p-5 text-lg flex items-center">
            <ul className="flex flex-col gap-4">
              <li>
                <div className="font-extrabold text-2xl">Non-Custodial</div>
                <div>
                  Multiverse Wallet stores everything on your device, only you
                  have access to your accounts, data and keys.
                </div>
              </li>
              <li>
                <div className="font-extrabold text-2xl">
                  Developer Friendly
                </div>
                <div>
                  Designed with web app developers in mind, integration is easy.
                  See our{' '}
                  <Link href="/docs/developers/introduction">
                    <a>docs</a>
                  </Link>{' '}
                  for more information.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="relative rounded-xl z-10 flex items-center justify-center">
        <div className="m-8 flex flex-col">
          <p className="text-center !text-sm font-semibold uppercase tracking-wide">
            Proudly supported by:
          </p>
          <div
            className="text-center font-extrabold italic text-4xl"
            style={{ fontFamily: "'Work Sans', sans-serif" }}
          >
            <a target="__blank" href="https://xrplgrants.org/">
              XRPL Grants
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
