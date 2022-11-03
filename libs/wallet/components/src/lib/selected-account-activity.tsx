import React, { useEffect, useState } from "react";
import {
  useSelectedAccount,
  useWalletState,
} from "@multiverse-wallet/wallet/hooks";
import { useXRPLContext } from "@xrpl-components/react/hooks/xrpl";
import {
  AccountTxRequest,
  Payment,
  Transaction,
  TransactionMetadata,
} from "xrpl";
import { BaseTransaction } from "xrpl/dist/npm/models/transactions/common";
import { Amount } from "xrpl/dist/npm/models/common";
import { IssuedCurrencyAmount } from "./xrpl-amount";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/outline";

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
  return (
    <div className="flex flex-col bg-white font-mono divide-y">
      {transactions?.map((tx: AccountTransaction) => (
        <div key={tx.tx?.TxnSignature}>
          <TransactionSummary tx={tx} />
        </div>
      ))}
    </div>
  );
}

function TransactionSummary({ tx }: { tx: AccountTransaction }) {
  const { selectedAccount } = useSelectedAccount();
  switch (tx.tx?.TransactionType) {
    case "Payment":
      if (tx.tx.Account === selectedAccount?.address) {
        return (
          <div className="p-3 flex items-center h-16">
            <TransactionStatus tx={tx} />
            <div className="text-xs flex-grow">
              <div>Sent Payment</div>
              <div className="text-xs text-slate-400">{tx.tx.Destination}</div>
            </div>
            <div>-{formatAmount(tx.tx.Amount)}</div>
          </div>
        );
      }
      return (
        <div className="p-3 flex items-center h-16">
          <TransactionStatus tx={tx} />
          <div className="text-xs flex-grow">
            <div>Received Payment</div>
            <div className="text-xs text-slate-400">{tx.tx.Destination}</div>
          </div>
          <div>{formatAmount(tx.tx.Amount)}</div>
        </div>
      );
    default:
      return (
        <div className="p-3 flex items-center h-16 text-xs">
          <TransactionStatus tx={tx} />
          <div className="flex-grow">{tx.tx?.TransactionType}</div>
        </div>
      );
  }
}

function formatAmount(amount: Amount): string {
  if (typeof amount === "string") {
    return (+amount / 1e6).toLocaleString();
  }
  return (+amount.value).toLocaleString();
}

function TransactionStatus({ tx }: { tx: AccountTransaction }) {
  if (typeof tx.meta === "string") {
    return <div className="w-8">{tx.meta}</div>;
  }
  if (tx.meta.TransactionResult.startsWith("tes")) {
    return (
      <div className="w-8">
        <CheckCircleIcon className="h-5 w-5 text-slate-500" />
      </div>
    );
  }
  return (
    <div className="w-8">
      <XCircleIcon className="h-5 w-5 text-slate-300" />
    </div>
  );
}
