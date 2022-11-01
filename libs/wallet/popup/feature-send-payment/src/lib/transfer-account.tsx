import { ChevronLeftIcon } from "@heroicons/react/outline";
import { Account } from "@multiverse-wallet/multiverse";
import { Button } from "@multiverse-wallet/shared/components/button";
import { TopBar } from "@multiverse-wallet/wallet/components";
import {
  useAccounts,
  useSelectedAccount,
} from "@multiverse-wallet/wallet/hooks";
import { AccountBalance } from "libs/wallet/components/src/lib/account-balance";
import { useState } from "react";

/* eslint-disable-next-line */
export interface TransferAccountProps {
  back: () => void;
  onSelect: (account: Account) => void;
}

export function TransferAccount(props: TransferAccountProps) {
  const { selectedAccount } = useSelectedAccount();
  const accounts = useAccounts();
  return (
    <ul className="flex flex-col divide-y overflow-y-scroll">
      {accounts
        ?.filter((acc) => acc.id !== selectedAccount?.id)
        .map((account) => (
          <li
            key={account.id}
            onClick={() => {
              props?.onSelect(account)
              props?.back()
            }}
            className="flex gap-4 cursor-pointer items-center p-3"
          >
            <div className="flex-grow flex items-center text-sm">
              <div className="flex-grow">
                <div className="block font-semibold">{account.name}</div>
                <div className="block text-gray-300 text-xs">
                  {account.address}
                </div>
              </div>
              <div className="text-sm font-mono">
                <AccountBalance account={account} />
              </div>
            </div>
          </li>
        ))}
      <li
        className="p-3 flex items-center cursor-pointer"
        onClick={() => props.back()}
      >
        <Button
          onPress={() => props.back()}
          className="w-full"
          variant="dark"
          size="medium"
        >
          Cancel
        </Button>
      </li>
    </ul>
  );
}

export default TransferAccount;
