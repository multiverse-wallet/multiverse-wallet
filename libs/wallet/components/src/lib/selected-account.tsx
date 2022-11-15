import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  useSelectedAccount,
  useWalletState,
} from '@multiverse-wallet/wallet/hooks';
import { CopyValue } from '@multiverse-wallet/shared/components/copy-value';
import {
  DuplicateIcon,
  DotsVerticalIcon,
  ExternalLinkIcon,
} from '@heroicons/react/outline';

export function AccountDetails() {
  const { selectedAccount } = useSelectedAccount();
  return (
    <Menu as="div" className="relative w-auto">
      <div>
        <Menu.Button>
          <DotsVerticalIcon className="w-7 h-7 p-1 mr-2 -ml-4 rounded-full hover:bg-slate-100" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              <div className="block px-4 py-2 text-sm text-gray-900 cursor-pointer hover:bg-slate-50">
                <a
                  target="_blank"
                  href={`https://xrpscan.com/account/${selectedAccount?.address}`}
                >
                  <ExternalLinkIcon className="h-4 w-4 inline mr-2" />
                  View account on xrpscan.org
                </a>
              </div>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export function SelectedAccount() {
  const { selectedAccount } = useSelectedAccount();
  return (
    <div className="py-3 flex items-center justify-between">
      <div></div>
      <div className="flex-grow text-center">
        <div className="cursor-pointer transition duration-500 py-2">
          <CopyValue
            valueToCopy={selectedAccount?.address || ''}
            render={(copyState, onCopyClicked) => {
              if (copyState === 'copied') {
                return (
                  <div>
                    <div className="font-bold text-xl">
                      {selectedAccount?.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      {selectedAccount?.address}
                      <DuplicateIcon className="inline w-4 h-4 ml-1" />
                    </div>
                    <div className="text-xs font-semibold text-blue-400">
                      Copied address to clipboard!
                    </div>
                  </div>
                );
              }
              return (
                <div
                  onClick={onCopyClicked}
                  //   className='text-teal-600 hover:text-teal-900 mr-4 cursor-pointer'
                >
                  <div className="font-bold text-xl">
                    {selectedAccount?.name}
                  </div>
                  <div className="text-xs text-gray-600">
                    {selectedAccount?.address}
                    <DuplicateIcon className="inline w-4 h-4 ml-1" />
                  </div>
                </div>
              );
            }}
          />
        </div>
      </div>
      <div>
        <AccountDetails />
      </div>
    </div>
  );
}
