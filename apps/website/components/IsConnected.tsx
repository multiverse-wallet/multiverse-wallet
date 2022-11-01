import React, { useEffect, useState } from "react";
import multiverse from "@multiverse-wallet/multiverse";

export default function IsConnected() {
  const [isConnected, setIsConnected] = useState<boolean>();
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
  if (error) {
    return <div className="text-red-500">{error.message}</div>;
  }
  if (isConnected) {
    return <div>Multiverse Wallet is connected!</div>;
  }
  return <div>Multiverse Wallet is not connected</div>;
}
