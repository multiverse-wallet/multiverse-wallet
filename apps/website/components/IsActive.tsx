import React, { useEffect, useState } from "react";
import multiverse from "@multiverse-wallet/multiverse";

export default function IsActive() {
  const [isActive, setIsActive] = useState<boolean>();
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  useEffect(() => {
    return multiverse.on("update", () => setLastUpdate(Date.now()));
  });
  useEffect(() => {
    multiverse.isActive().then((isActive) => setIsActive(isActive));
  }, [lastUpdate]);
  if (isActive) {
    return <div>Multiverse Wallet is active!</div>;
  }
  return <div>Multiverse Wallet is not available</div>;
}
