import React, { useEffect, useState } from "react";
import multiverse, { Account } from "@multiverse-wallet/multiverse";

export default function AccountChanged() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  useEffect(() => {
    return multiverse.on("accountChanged", (account) => {
      if (account) {
        setAccounts([...accounts, account]);
      }
    });
  }, []);
  return (
    <div>
      {accounts.map((account) => (
        <div key={account?.id}>Account changed to {account?.name}</div>
      ))}
      {!accounts?.length && <div>No events to display</div>}
    </div>
  );
}
