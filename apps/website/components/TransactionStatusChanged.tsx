import React, { useEffect, useState } from "react";
import multiverse, {
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
        <pre className="text-xs" key={tx.txHash}>
          {JSON.stringify(tx, null, 2)}
        </pre>
      ))}
      {!transactions?.length && <div>No events to display</div>}
    </div>
  );
}
