/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  ChevronDownIcon,
  CheckIcon,
  LockClosedIcon,
} from '@heroicons/react/solid';
import {
  useAccounts,
  useSelectedAccount,
  useWalletAPI,
} from '@multiverse-wallet/wallet/hooks';
import React, { useEffect } from 'react';
import { Button } from '@multiverse-wallet/shared/components/button';
import { AccountBalance } from './account-balance';
import { navigateExtension } from '@multiverse-wallet/wallet/utils';
import { AccountIcon } from './account-icon';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export interface SelectAccountProps {
  align?: 'left' | 'right';
  showIcon?: boolean;
}

export function SelectAccount({ align, showIcon }: SelectAccountProps) {
  const { selectedAccount, setSelectedAccount } = useSelectedAccount();
  const { api } = useWalletAPI();
  const accounts = useAccounts();
  return (
    <Menu as="div" className="relative">
      <div>
        <Menu.Button className="inline-flex items-center justify-center w-full rounded-md px-4 py-2 text-sm font-medium focus:outline-none">
          {!!selectedAccount && (
            <>
              <div className="mr-3 truncate">{selectedAccount?.name}</div>
              <AccountIcon
                address={selectedAccount.address}
                className="w-5 h-5 p-0.5"
              />
            </>
          )}
          {!selectedAccount && 'Select Account'}
          <ChevronDownIcon className="-mr-2 h-5 w-5" aria-hidden="true" />
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
        <Menu.Items
          className={`${
            align === 'left'
              ? 'origin-top-left left-0'
              : 'origin-top-right right-0'
          } z-10 max-w-md absolute mt-2 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
        >
          <div className="py-3">
            <div className="block px-4 pb-3 text-xs border-b font-semibold">
              Switch Account
            </div>
            <div className="max-h-64 overflow-y-auto">
              {accounts?.map((account, i) => (
                <Menu.Item key={account.id}>
                  {({ active }) => (
                    <div
                      onClick={() => {
                        setSelectedAccount(account);
                      }}
                      className={classNames(
                        active ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm'
                      )}
                    >
                      <div className="flex w-64 gap-4 cursor-pointer items-center">
                        <div className="flex">
                          <AccountIcon
                            address={account.address}
                            className="w-5 h-5 p-0.5"
                          />
                        </div>
                        <div className="flex-grow">
                          <div className="block font-semibold">
                            {account.name}
                          </div>
                          <div className="block text-gray-400 text-xs">
                            <AccountBalance account={account} />
                          </div>
                        </div>
                        <div className="w-5">
                          {account?.id === selectedAccount?.id && (
                            <CheckIcon className="w-5 h-5 text-black" />
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </Menu.Item>
              ))}
            </div>
            <Menu.Item>
              {() => (
                <div className={classNames('block px-4 py-2 text-sm')}>
                  <Button
                    onPress={() => navigateExtension('/admin/accounts')}
                    variant="primary"
                    size="small"
                    className="rounded-full w-full"
                  >
                    Manage Accounts
                  </Button>
                </div>
              )}
            </Menu.Item>
            <Menu.Item>
              {() => (
                <div className={classNames('block px-4 py-2 text-sm')}>
                  <Button
                    onPress={() => api.lock()}
                    variant="light"
                    size="small"
                    className="rounded-full w-full"
                  >
                    <LockClosedIcon className="w-5 h-5 inline -mt-1 mr-1" />
                    Lock
                  </Button>
                </div>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
