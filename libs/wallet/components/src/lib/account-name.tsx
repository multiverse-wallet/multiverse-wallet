import React, { useMemo } from "react";
import { useAccounts } from "@multiverse-wallet/wallet/hooks";

export interface AccountNameProps {
  address: string;
}

export function AccountName({ address }: AccountNameProps) {
  const accounts = useAccounts();
  const accountName = useMemo(() => {
    return accounts?.find((a) => a.address === address)?.name || "-";
  }, [accounts, address]);
  return <>{accountName}</>
}
