import React, { useEffect, useState } from "react";
import multiverse, {
  Account,
  Network,
  Transaction,
} from "@multiverse-wallet/multiverse";

export default function TransactionStatusChanged() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  useEffect(() => {
    return multiverse.on("transactionStatusChanged", (tx: Transaction) => {
      setTransactions([...transactions, tx]);
    });
  }, []);
  return (
    <div>
      {transactions.map((tx: Transaction) => (
        <div key={tx.txHash}>
          <div>ID: {tx.id}</div>
          <div>Hash: {tx.txHash}</div>
          <div>TxJson: {JSON.stringify(tx.txJson)}</div>
          <div>Status: {JSON.stringify(tx.status)}</div>
        </div>
      ))}
      {!transactions?.length && <div>No events to display</div>}
    </div>
  );
}
