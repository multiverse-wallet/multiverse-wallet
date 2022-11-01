import React, { useEffect, useState } from "react";
import {
  useSelectedAccount,
  useWalletState,
} from "@multiverse-wallet/wallet/hooks";
import { useXRPLContext } from "@xrpl-components/react/hooks/xrpl";
import { AccountTxRequest, Transaction, TransactionMetadata } from "xrpl";

interface AccountTransaction {
  ledger_index: number;
  meta: string | TransactionMetadata;
  tx?: Transaction;
  tx_blob?: string;
  validated: boolean;
}

export function SelectedAccountActivity() {
  const { selectedAccount } = useSelectedAccount();
  const { client } = useXRPLContext();
  const [transactions, setTransactions] = useState<any[]>([]);
  useEffect(() => {
    client
      ?.request({
        command: "account_tx",
        account: selectedAccount?.address,
      } as AccountTxRequest)
      .then((res) => setTransactions(res.result.transactions))
      .catch(console.error);
  }, [selectedAccount?.address, client]);
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{transactions?.map((tx: AccountTransaction) => (
    <div key={tx.tx?.TxnSignature} className="p-5">
      <div>{tx.tx?.TransactionType}</div>
    </div>
  ))}</>
}
