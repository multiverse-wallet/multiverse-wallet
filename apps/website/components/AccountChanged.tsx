import React from "react";
import { useAccount } from "@multiverse-wallet/react";

export default function AccountChanged() {
  const { account } = useAccount()
  return (
    <div>Account changed to {account?.name}</div>
  );
}
