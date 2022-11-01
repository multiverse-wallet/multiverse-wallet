import React, { useEffect, useState } from "react";
import multiverse, { Account, Network } from "@multiverse-wallet/multiverse";
import { Button } from "@multiverse-wallet/shared/components/button";

export default function RequestTransaction() {
  const [error, setError] = useState<any>();
  const [network, setNetwork] = useState<Network>();
  const [transactionId, setTransactionId] = useState<string>();
  const [transactionStatus, setTransactionStatus] = useState<string>();
  const submitTx = async () => {
    multiverse
      .getAccount()
      .then((account) => {
        const tx = {
          TransactionType: "Payment",
          Account: account.address,
          Amount: "10000000",
          DestinationTag: 123,
          Destination: "rPoSmtTpzZ6RsJY9rNTtMjH1tKSiJHp9Fg",
        };
        return multiverse.requestTransaction(tx);
      })
      .catch(setError)
      .then((transactionId: string) => {
        setTransactionId(transactionId);
        setError(undefined);
      });
  };
  useEffect(() => {
    if (!transactionId) {
      return;
    }
    multiverse
      .getTransaction(transactionId)
      .then((tx) => setTransactionStatus(tx.status));
    return multiverse.on("transactionStatusChanged", (transaction) => {
      if (transaction.id === transactionId) {
        setTransactionStatus(transaction.status);
      }
    });
  }, [transactionId]);
  const updateNetwork = () => {
    multiverse
      .getNetwork()
      .then((network) => {
        setNetwork(network);
        setError(undefined);
      })
      .catch(setError);
  };
  useEffect(() => {
    updateNetwork();
    return multiverse.on("networkChanged", () => updateNetwork());
  }, []);
  if (network?.name.toLowerCase() !== "testnet") {
    return (
      <div className="text-purple-500">This example only works on testnet.</div>
    );
  }
  if (error) {
    return <div className="text-red-500">{error?.message}</div>;
  }
  if (transactionId) {
    return (
      <>
        <div>Transaction requested with ID: {transactionId}</div>
        <div>Transaction status is {transactionStatus}</div>
      </>
    );
  }
  return (
    <Button variant="light" onPress={() => submitTx()}>
      Send 10 XRP to rPoSmtTpzZ6RsJY9rNTtMjH1tKSiJHp9Fg
    </Button>
  );
}
