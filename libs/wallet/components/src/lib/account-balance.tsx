import React, { useEffect } from "react";
import { useWalletState } from "@multiverse-wallet/wallet/hooks";
import { AccountBalance as XRPLAccountBalance } from "@xrpl-components/react/components/account-balance";
import { Account } from "@multiverse-wallet/multiverse";

export interface AccountBalanceProps {
  account: Account;
}

export function AccountBalance({ account }: AccountBalanceProps) {
  return (
    <div>
      <XRPLAccountBalance account={account.address}>
        {({ isLoading, value, currency, errorMessage }: any) => {
          return (
            <div>
              {isLoading ? (
                <>-</>
              ) : (
                // Apply a negative margin at the top to compensate for the monospace font
                <div className="inline">
                  <XRPLAccountBalance.Value>{value}</XRPLAccountBalance.Value>
                  <span className="ml-1">
                    <XRPLAccountBalance.Currency unicodeSymbol={false}>
                        {currency}
                    </XRPLAccountBalance.Currency>
                  </span>
                </div>
              )}
            </div>
          );
        }}
      </XRPLAccountBalance>
    </div>
  );
}
