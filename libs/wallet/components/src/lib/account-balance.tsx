import React, { useEffect } from "react";
import { useWalletState } from "@multiverse-wallet/wallet/hooks";
import { AccountBalance as XRPLAccountBalance } from "@xrpl-components/react/components/account-balance";
import { Account } from "@multiverse-wallet/multiverse";

export interface AccountBalanceProps {
  account?: Account;
  address?: string;
}

export function AccountBalance({ account, address }: AccountBalanceProps) {
  return (
    <XRPLAccountBalance account={account?.address || (address as string)}>
      {({ isLoading, value, currency, errorMessage }: any) => {
        return isLoading ? (
          <>-</>
        ) : (
          // Apply a negative margin at the top to compensate for the monospace font
          <>
            <XRPLAccountBalance.Value>{value}</XRPLAccountBalance.Value>
            <XRPLAccountBalance.Currency unicodeSymbol={false}>
              {currency}
            </XRPLAccountBalance.Currency>
          </>
        );
      }}
    </XRPLAccountBalance>
  );
}
