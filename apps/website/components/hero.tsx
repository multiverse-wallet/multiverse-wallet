import { DownloadIcon } from "@heroicons/react/solid";
import Link from "next/link";
import Logo from "./Logo";

export default function Hero() {
  return (
    <div className="">
      <div className="relative overflow-hidden">
        <div className="relative pt-6 pb-16 sm:pb-14">
          <div className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24 sm:px-6">
            <div className="text-center">
              <p className="mb-12">
                <span className="rounded bg-blue-500 text-blue-50 px-2.5 py-1 text-xs font-semibold tracking-wide uppercase">
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
              <p>
                <Link href="/docs/getting-started">
                  <a href="/docs/getting-started" className="no-underline">
                    <span className="inline-flex bg-gradient-to-br from-gray-600 to-gray-700 transition-all duration-500 px-5 py-2 rounded-full items-center text-2xl shadow hover:shadow-2xl font-medium text-white font-extrabold space-x-1">
                      <span>Download</span>
                      <DownloadIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  </a>
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="flex relative rounded-xl">
          <div className="p-5">
            <img
              className="relative rounded-lg shadow-lg mx-auto border border-slate-50"
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
                  Designed with web app developers in mind, integration is easy. See our <Link href="/docs/developers/introduction"><a>docs</a></Link> for more information.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-dark">
        <div className="max-w-7xl mx-auto pb-24 px-4 pt-12 sm:px-6 lg:px-8">
          <h2 className="text-center text-gray-400 !text-sm font-semibold uppercase tracking-wide">
            Proudly supported by:
          </h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div
              className="col-span-2 flex justify-center items-center font-extrabold italic text-4xl"
              style={{ fontFamily: "'Work Sans', sans-serif" }}
            >
              <a
                target="__blank"
                className="text-slate-700"
                href="https://xrplgrants.org/"
              >
                XRPL Grants
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
