import React, { useEffect, useState } from "react";
import multiverse, { Account } from "@multiverse-wallet/multiverse";
import { Button } from "@multiverse-wallet/shared/components/button";

export default function Connect() {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [error, setError] = useState<any>();
  useEffect(() => {
    return multiverse.on("update", () => setLastUpdate(Date.now()));
  });
  useEffect(() => {
    multiverse
      .isConnected()
      .then((isConnected) => {
        setIsConnected(isConnected);
        setError(undefined);
      })
      .catch(setError);
  }, [lastUpdate]);
  if (!isConnected) {
    return <>Not yet connected!</>;
  }
  if (error) {
    return <div className="text-red-500">{error.message}</div>;
  }
  return (
    <Button
      variant="light"
      onPress={() =>
        multiverse
          .disconnect()
          .then(() => setError(undefined))
          .catch(setError)
      }
    >
      Click to disconnect
    </Button>
  );
}
