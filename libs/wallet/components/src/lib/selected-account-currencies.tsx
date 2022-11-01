import React, { useEffect, useState } from "react";
import {
  useSelectedAccount,
  useWalletState,
} from "@multiverse-wallet/wallet/hooks";
import { useXRPLContext } from "@xrpl-components/react/hooks/xrpl";
import { AccountBalance } from "@xrpl-components/react/components/account-balance";
import { ChevronRightIcon } from "@heroicons/react/outline";
import { Spinner } from "@multiverse-wallet/shared/components/spinner";

export function SelectedAccountCurrencies() {
  const { selectedAccount } = useSelectedAccount();
  const { client, connectionState } = useXRPLContext();
  const [balances, setBalances] = useState<any[] | null>(null);
  useEffect(() => {
    selectedAccount &&
      connectionState == "connected" &&
      client
        ?.getBalances(selectedAccount?.address)
        .then((balances) => setBalances(balances))
        .catch((e) => {
          setBalances(null);
        });
  }, [selectedAccount, client, connectionState]);
  if (connectionState === "connecting") {
    return (
      <div className="flex-grow bg-white">
        <div className="h-full flex items-center justify-center">
          <Spinner variant="dark" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex-grow bg-white divide-y divide-purple-100">
      {balances?.map(({ currency, value, issuer }) => (
        <div
          key={currency + issuer}
          className="flex h-16 items-center hover:bg-gray-50 cursor-pointer"
        >
          <div className="p-5 flex-grow flex flex-col text-md font-mono">
            <div>
              <span className="mr-1">
                <AccountBalance.Value>{value}</AccountBalance.Value>
              </span>
              <AccountBalance.Currency>{currency}</AccountBalance.Currency>
            </div>
            <div>
              {issuer && (
                <div className="text-xs text-gray-500">{issuer}</div>
              )}
            </div>
          </div>
          <div className="p-5 items-center text-gray-200">
            <ChevronRightIcon className="w-8 h-8" />
          </div>
        </div>
      ))}
    </div>
  );
}
