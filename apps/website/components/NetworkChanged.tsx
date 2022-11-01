import React, { useEffect, useState } from "react";
import multiverse, { Network } from "@multiverse-wallet/multiverse";

export default function NetworkChanged() {
  const [networks, setNetworks] = useState<Network[]>([]);
  useEffect(() => {
    return multiverse.on("networkChanged", (network) => {
      if (network) {
        setNetworks([...networks, network]);
      }
    });
  }, []);
  return (
    <div>
      {networks.map((network) => (
        <div key={network?.id}>Network changed to {network?.name}</div>
      ))}
      {!networks?.length && <div>No events to display</div>}
    </div>
  );
}
