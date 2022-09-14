import { ChevronRightIcon, DownloadIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@multiverse-wallet/shared/components/button";
import dynamic from 'next/dynamic'

const ConnectWalletButton = dynamic(() => import('./ConnectWalletButton').then(i => i.ConnectWalletButton), {
  ssr: false,
})

export default function Hero() {
  return (
    <div className="">
      <div className="relative overflow-hidden">
        <div className="relative pt-6 pb-16 sm:pb-14">
          <div className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24 sm:px-6">
            <div className="text-center">
              <p className="mb-12">
                <span className="rounded bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600 tracking-wide uppercase">
                  Early Alpha Release
                </span>
              </p>
              <div>
                <Image src="/logo.svg" height={100} width={300} />
              </div>
              <h1 className="text-5xl tracking-tight font-extrabold md:!text-6xl">
                Multiverse
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:!text-lg md:mt-5 md:!text-2xl md:max-w-3xl">
                An open-source wallet for XRPL that lives in the browser.
              </p>
              <p>
                <Link href="/docs/getting-started">
                  <a href="/docs/getting-started" className="no-underline">
                    <span className="inline-flex bg-gradient-to-br from-purple-500 to-orange-500 transition-all duration-500 px-5 py-2 rounded-full items-center text-2xl shadow hover:shadow-2xl font-medium text-white font-extrabold space-x-1">
                      <span>Download</span>
                      <DownloadIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </span>
                  </a>
                </Link>

              </p>
            </div>
          </div>
          <ConnectWalletButton />
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex flex-col" aria-hidden="true">
            <div className="flex-1" />
            <div className="flex-1 w-full" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {/* <img
              className="relative rounded-lg shadow-lg mx-auto"
              src="/component.png"
              alt="Component"
            /> */}
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-dark">
        <div className="max-w-7xl mx-auto pb-24 px-4 pt-12 sm:px-6 lg:px-8">
          <h2 className="text-center text-gray-400 !text-sm font-semibold uppercase tracking-wide">
            Proudly supported by:
          </h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="col-span-2 flex justify-center items-center font-extrabold italic text-4xl" style={{fontFamily:"'Work Sans', sans-serif"}}>
              XRPL Grants
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}