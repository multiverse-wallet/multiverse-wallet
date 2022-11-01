import React, { useEffect, useState } from "react";
import multiverse, { Account } from "@multiverse-wallet/multiverse";

export default function GetAccount() {
  const [account, setAccount] = useState<Account>();
  const [error, setError] = useState<any>()
  const updateAccount = () => {
    multiverse
      .getAccount()
      .then((account) => {
        setAccount(account)
        setError(undefined)
      })
      .catch(setError);
  };
  useEffect(() => {
    updateAccount();
    return multiverse.on("accountChanged", () => updateAccount())
  }, []);
  if (error) {
    return <div className="text-red-500">{error.message}</div>
  }
  if (account) {
    return (
      <div>
        <div className="font-bold">The currently selected account is:</div>
        <div>ID: {account?.id}</div>
        <div>Name: {account?.name}</div>
        <div>Address: {account?.address}</div>
      </div>
    );
  }
  return <div>No account information available</div>;
}
