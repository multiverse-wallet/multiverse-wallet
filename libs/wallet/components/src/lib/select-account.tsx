/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
  CheckCircleIcon,
  QuestionMarkCircleIcon,
  ExclamationCircleIcon,
  CheckIcon,
} from "@heroicons/react/solid";
import {
  useAccounts,
  useSelectedAccount,
  useWalletState,
} from "@multiverse-wallet/wallet/hooks";
import React, { useEffect } from "react";
import { useXRPLContext } from "@xrpl-components/react/hooks/xrpl";
import { Button } from "@multiverse-wallet/shared/components/button";
import { AccountBalance } from "./account-balance";
import { navigateExtension } from "@multiverse-wallet/wallet/utils";
import { UsersIcon } from "@heroicons/react/solid";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export interface SelectAccountProps {
  align?: "left" | "right";
  showIcon?: boolean;
}

export function SelectAccount({ align, showIcon }: SelectAccountProps) {
  const { selectedAccount, setSelectedAccount } = useSelectedAccount();
  const accounts = useAccounts();
  return (
    <Menu as="div" className="relative">
      <div>
        <Menu.Button className="inline-flex justify-center w-full rounded-md bg-white shadow px-4 py-2 text-sm font-medium focus:outline-none">
          {!!selectedAccount && showIcon ? (
            <>
              <UsersIcon className="w-5 h-5 p-0.5" />
            </>
          ) : (
            selectedAccount?.name
          )}
          {!selectedAccount && "Select Account"}
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
          className={`${
            align === "left"
              ? "origin-top-left left-0"
              : "origin-top-right right-0"
          } z-10 max-w-md absolute mt-2 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
        >
          <div className="py-3">
            <div className="block px-4 pb-3 text-xs border-b font-semibold">
              Switch Account
            </div>
            <div className="max-h-80 overflow-y-scroll">
              {accounts?.map((account, i) => (
                <Menu.Item key={account.name}>
                  {({ active }) => (
                    <div
                      onClick={() => {
                        setSelectedAccount(account);
                      }}
                      className={classNames(
                        active ? "bg-gray-100" : "",
                        "block px-4 py-2 text-sm"
                      )}
                    >
                      <div className="flex w-64 gap-4 cursor-pointer items-center">
                        <div className="flex-grow">
                          <div className="block font-semibold">
                            {account.name}
                          </div>
                          <div className="block text-gray-400 text-xs">
                            <AccountBalance account={account} />
                          </div>
                        </div>
                        <div className="w-5">
                          {account?.name === selectedAccount?.name && (
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
                <div className={classNames("block px-4 py-2 text-sm")}>
                  <Button
                    onPress={() => navigateExtension("/admin/accounts")}
                    variant="primary"
                    size="small"
                    className="rounded-full w-full"
                  >
                    Manage Accounts
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
