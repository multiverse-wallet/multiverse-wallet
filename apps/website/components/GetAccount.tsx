import React from "react";
import { useAccount } from "@multiverse-wallet/react";

export default function GetAccount() {
  const { account, error } = useAccount();
  if (error) {
    return <div className="text-red-500">{error.message}</div>;
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
