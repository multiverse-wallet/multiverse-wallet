/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { useSelectedAccountBalances } from '@multiverse-wallet/wallet/hooks';
import React, { useEffect } from 'react';
import { AccountBalance } from '@xrpl-components/react/components/account-balance';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export interface SelectAssetProps {
  align?: 'left' | 'right';
  onChange?: (asset: {
    value: string;
    currency: string;
    issuer?: string;
  }) => void;
}

export function SelectAsset({ align, onChange }: SelectAssetProps) {
  const balances = useSelectedAccountBalances();
  const [asset, setAsset] = useState<{
    value: string;
    currency: string;
    issuer?: string | undefined;
    reserve?: string;
  }>();
  useEffect(() => {
    if (!asset && balances) {
      setAsset(balances[0]);
    }
  }, [balances, asset]);
  useEffect(() => {
    if (asset) {
      onChange && onChange(asset);
    }
  }, [asset, onChange]);
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="inline-flex items-center text-left w-full rounded-md bg-white border shadow-sm px-4 py-2 text-sm font-medium focus:outline-none">
        <div className="flex-grow capitalize">
          {asset?.currency && (
            <>
              <AccountBalance.Currency>
                {asset?.currency}
              </AccountBalance.Currency>
              <div className="font-light text-slate-500">
                Balance:{' '}
                <AccountBalance.Value>{asset?.value}</AccountBalance.Value>
              </div>
            </>
          )}
        </div>
        <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
      </Menu.Button>

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
          } z-10 w-full absolute mt-2 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
        >
          {' '}
          <div className="py-1 w-full">
            <div className="max-h-80 overflow-y-scroll">
              {balances?.map((balance, i) => (
                <Menu.Item key={i}>
                  {({ active }) => (
                    <div
                      onClick={() => {
                        setAsset(balance);
                      }}
                      className={classNames(
                        active ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm'
                      )}
                    >
                      <div className="flex w-full gap-4 cursor-pointer items-center">
                        <div className="flex-grow">
                          <div className="block capitalize">
                            <AccountBalance.Currency>
                              {balance.currency}
                            </AccountBalance.Currency>
                            <div className="font-light text-slate-500">
                              Balance:{' '}
                              <AccountBalance.Value>
                                {balance.value}
                              </AccountBalance.Value>
                            </div>
                          </div>
                          {/* {balance.issuer && (
                            <div className="block text-gray-400 text-xs">
                              {balance.issuer}
                            </div>
                          )} */}
                        </div>
                      </div>
                    </div>
                  )}
                </Menu.Item>
              ))}
            </div>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
