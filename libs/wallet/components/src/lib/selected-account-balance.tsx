import React, { useEffect, useMemo, useState } from 'react';
import {
  useSelectedAccount,
  useXRPLAccountReserve,
} from '@multiverse-wallet/wallet/hooks';
import { AccountBalance } from '@xrpl-components/react/components/account-balance';
import { Spinner } from '@multiverse-wallet/shared/components/spinner';

export function SelectedAccountBalance() {
  const { selectedAccount, setSelectedAccount } = useSelectedAccount();
  const reserve = useXRPLAccountReserve();
  return (
    <div>
      <AccountBalance account={selectedAccount?.address || ''}>
        {({ isLoading, value, currency }) => {
          return (
            <div className="text-4xl p-4 h-20 flex flex-col items-center justify-center font-extrabold">
              {isLoading ? (
                <Spinner variant="dark" size="medium" />
              ) : (
                // Apply a negative margin at the top to compensate for the monospace font
                <div className="flex items-center justify-center space-x-2 -mt-2">
                  <div>
                    <AccountBalance.Value>{value}</AccountBalance.Value>
                  </div>
                  <div>
                    <AccountBalance.Currency unicodeSymbol={false}>
                      {currency}
                    </AccountBalance.Currency>
                  </div>
                </div>
              )}
              <div className="text-sm font-normal text-slate-500">
                <AvailableBalance value={+value} reserve={reserve} />
              </div>
            </div>
          );
        }}
      </AccountBalance>
    </div>
  );
}

export interface AvailableBalanceProps {
  value: number;
  reserve: number;
}

function AvailableBalance({ value, reserve }: AvailableBalanceProps) {
  if (value === 0) {
    return <>Account not initialized</>;
  }
  return (
    <>
      (<AccountBalance.Value>{+value - reserve}</AccountBalance.Value>{' '}
      available)
    </>
  );
}
