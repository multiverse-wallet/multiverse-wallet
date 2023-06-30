import React, { useEffect, useState } from 'react';
import { useSelectedAccount } from '@multiverse-wallet/wallet/hooks';
import { useXRPLContext } from '@xrpl-components/react/hooks/xrpl';
import { AccountBalance } from '@xrpl-components/react/components/account-balance';
import { Spinner } from '@multiverse-wallet/shared/components/spinner';

export function SelectedAccountCurrencies() {
  const { selectedAccount } = useSelectedAccount();
  const { client, connectionState } = useXRPLContext();
  const [balances, setBalances] = useState<any[] | null>(null);
  useEffect(() => {
    selectedAccount &&
      connectionState === 'connected' &&
      client
        ?.getBalances(selectedAccount?.address)
        .then((balances) => setBalances(balances))
        .catch((e) => {
          setBalances(null);
        });
  }, [selectedAccount, client, connectionState]);
  if (connectionState === 'connecting') {
    return (
      <div className="flex-grow bg-white">
        <div className="h-full flex items-center justify-center">
          <Spinner variant="dark" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col bg-white font-mono divide-y">
      {balances?.map(({ currency, value, issuer }) => (
        <div key={currency + issuer} className="p-3 flex items-center h-16">
          <div className="text-xs flex-grow">
            <div className="capitalize">
              <AccountBalance.Currency>{currency}</AccountBalance.Currency>
            </div>
            <div className="text-xs text-slate-400">{issuer}</div>
          </div>
          <div>
            <AccountBalance.Value>{value}</AccountBalance.Value>
          </div>
        </div>

        // <div
        //   key={currency + issuer}
        //   className="flex items-center hover:bg-gray-50 cursor-pointer"
        // >
        //   <div className="p-5 flex-grow flex flex-col text-md font-mono">
        //     <div>
        //       <span className="mr-1">
        //         <AccountBalance.Value>{value}</AccountBalance.Value>
        //       </span>
        //       <AccountBalance.Currency>{currency}</AccountBalance.Currency>
        //     </div>
        //     <div>
        //       {issuer && (
        //         <div className="text-xs text-gray-500">{issuer}</div>
        //       )}
        //     </div>
        //   </div>
        // </div>
      ))}
    </div>
  );
}
