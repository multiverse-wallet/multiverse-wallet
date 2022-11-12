import React from "react";
import {
  useAccount,
  useNetwork,
  useTransaction,
} from "@multiverse-wallet/react";
import { Button } from "@multiverse-wallet/shared/components/button";

export default function RequestTransaction() {
  const { account, error: accountError } = useAccount();
  const { network, error: networkError } = useNetwork();
  const {
    transaction,
    requestTransaction,
    error: transactionError,
  } = useTransaction();
  const submitTx = async () => {
    const tx = {
      TransactionType: "Payment",
      Account: account.address,
      Amount: "10000000",
      DestinationTag: 123,
      Destination: "rPoSmtTpzZ6RsJY9rNTtMjH1tKSiJHp9Fg",
    };
    return requestTransaction(tx);
  };
  if (network?.name.toLowerCase() !== "testnet") {
    return (
      <div className="text-purple-500">This example only works on testnet.</div>
    );
  }
  if (accountError) {
    return (
      <div className="text-red-500">
        Error getting account: {accountError?.message}
      </div>
    );
  }
  if (networkError) {
    return (
      <div className="text-red-500">
        Error getting network: {networkError?.message}
      </div>
    );
  }
  if (transactionError) {
    return (
      <div className="text-red-500">
        Error getting transaction: {transactionError?.message}
      </div>
    );
  }
  if (transaction) {
    return (
      <>
        <div>Transaction requested with ID: {transaction?.id}</div>
        <div>Transaction status is {transaction?.status}</div>
      </>
    );
  }
  return (
    <Button variant="light" onPress={() => submitTx()}>
      Send 10 XRP to rPoSmtTpzZ6RsJY9rNTtMjH1tKSiJHp9Fg
    </Button>
  );
}
