import React, { useEffect, useState } from "react";
import { Account, MultiverseClientAPI } from "@multiverse-wallet/multiverse";
import { Button } from "@multiverse-wallet/shared/components/button";

const api = new MultiverseClientAPI();

export function ConnectWalletButton() {
  const [isConnected, setIsConnected] = useState(false);
  const [apiUpdate, setLastUpdate] = useState<number>();
  const [account, setAccount] = useState<Account>();
  useEffect(() => {
    const sub = api.onUpdate(() => setLastUpdate(Date.now()));
    return () => sub();
  }, []);
  useEffect(() => {
    api.getSelectedAccount().then((account) => setAccount(account));
  }, [apiUpdate, isConnected]);

const connect = () => {
    api.connect().then((connectionStatus) => {
      if (connectionStatus === "connected") {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    });
  }
  if (isConnected) {
    return <>Connected to {account?.name}</>;
  }
  return <Button variant="light" onPress={() => connect()}>Connect!</Button>
}
