/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  ChevronDownIcon,
  CheckCircleIcon,
  QuestionMarkCircleIcon,
  ExclamationCircleIcon,
  CheckIcon,
} from '@heroicons/react/solid';
import {
  useNetworks,
  useSelectedNetwork,
  useWalletAPI,
} from '@multiverse-wallet/wallet/hooks';
import React, { useEffect } from 'react';
import { useXRPLContext } from '@xrpl-components/react/hooks/xrpl';
import { Button } from '@multiverse-wallet/shared/components/button';
import { navigateExtension } from '@multiverse-wallet/wallet/utils';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export interface SelectNetworkProps {
  align?: 'left' | 'right';
}

export function SelectNetwork({ align }: SelectNetworkProps) {
  const { connectionState, error } = useXRPLContext();
  const networks = useNetworks();
  const { selectedNetwork, setSelectedNetwork } = useSelectedNetwork();
  return (
    <Menu as="div" className="relative">
      <div>
        <Menu.Button className="flex items-center rounded-md py-2 text-sm font-medium focus:outline-none">
          <img
            className="mx-auto mr-2"
            src="/assets/logo.png"
            width="70"
            alt="Multiverse Wallet"
          />
          <div className="truncate">{selectedNetwork?.name}</div>
          {connectionState === 'connected' && (
            <div className="-mr-1 ml-1 h-2 w-2 bg-green-400 rounded-full" />
          )}
          {connectionState === 'connecting' && !error && (
            <div className="-mr-1 ml-1 h-2 w-2 bg-indigo-400 rounded-full" />
          )}
          {error && (
            <div className="-mr-1 ml-1 h-2 w-2 bg-red-400 rounded-full" />
          )}
          <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
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
          className={`origin-top-left left-0  z-10 absolute mt-2 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
        >
          {' '}
          <div className="py-3">
            <div className="block px-4 pb-3 text-xs border-b font-semibold">
              Switch Network
            </div>
            <div className="max-h-64 overflow-y-auto">
              {networks?.map((network, i) => (
                <Menu.Item key={network.name}>
                  {({ active }) => (
                    <div
                      onClick={() => {
                        setSelectedNetwork(network);
                      }}
                      className={classNames(
                        active ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm'
                      )}
                    >
                      <div className="flex w-64 gap-4 cursor-pointer items-center">
                        <div className="flex-grow">
                          <div className="block font-semibold">
                            {network.name}
                          </div>
                          <div className="block text-gray-400 text-xs">
                            {network.server}
                          </div>
                        </div>
                        <div className="w-5">
                          {network?.name === selectedNetwork?.name && (
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
                    onPress={() => navigateExtension('/admin/networks')}
                    variant="primary"
                    size="small"
                    className="rounded-full w-full"
                  >
                    Manage Networks
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
