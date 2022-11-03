import React, { useState } from 'react';
import { CopyValue } from '@multiverse-wallet/shared/components/copy-value';

interface MnemonicViewerProps {
  decryptedMnemonic: string;
  showCopyButton: boolean;
  showPlaceholder: boolean;
  progressPercentage?: number;
}

export function MnemonicViewer({
  decryptedMnemonic,
  progressPercentage,
  showCopyButton,
  showPlaceholder,
}: MnemonicViewerProps) {
  // Generate an array of subtly different width blocks to represent a "hidden" form of the mnemonic
  const [blocks] = useState(
    Array.from(new Array(12), () => {
      return Math.random() < 0.5
        ? 'w-12'
        : Math.random() < 0.5
        ? 'w-8'
        : 'w-14';
    })
  );

  return (
    <div className="text-base font-mono p-8 bg-gray-50 m-auto space-y-4 leading-10 relative flex items-center h-full">
      {decryptedMnemonic && (
        <>
          {showCopyButton && (
            <div className="bg-gray-50 absolute right-0 top-0">
              <div className="flex flex-1 items-center justify-end">
                <CopyValue
                  valueToCopy={decryptedMnemonic}
                  render={(copyState, onCopyClicked) => {
                    if (copyState === 'copied') {
                      return (
                        <div className="flex items-center px-4 pl-5 py-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 cursor-pointer">
                          <span className="text-xs uppercase">Copied</span>
                          <svg
                            style={{ marginTop: '-2px' }}
                            className="h-5 w-5 ml-1"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                            />
                          </svg>
                        </div>
                      );
                    }
                    return (
                      <div
                        className="flex items-center px-4 pl-5 py-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
                        onClick={onCopyClicked}
                      >
                        <span className="text-xs uppercase">Copy</span>
                        <svg
                          style={{ marginTop: '-2px' }}
                          className="h-5 w-5 ml-1"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                          />
                        </svg>
                      </div>
                    );
                  }}
                />
              </div>
            </div>
          )}
          <div className="text-teal-700">{decryptedMnemonic}</div>

          {progressPercentage !== undefined && (
            <div
              className="h-1 bg-teal-700 absolute left-0 bottom-0 opacity-50"
              style={{
                width: `${progressPercentage}%`,
              }}
            ></div>
          )}
        </>
      )}

      {!decryptedMnemonic && showPlaceholder && (
        <div>
          {blocks.map((widthClass, i) => {
            return (
              <div
                key={i}
                className={`inline-flex ${widthClass} h-3 bg-gray-200 mr-4`}
              ></div>
            );
          })}{' '}
        </div>
      )}
    </div>
  );
}
