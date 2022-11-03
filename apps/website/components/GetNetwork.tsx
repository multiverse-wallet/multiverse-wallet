import React, { useEffect, useState } from "react";
import multiverse, { Network } from "@multiverse-wallet/multiverse";

export default function GetNetwork() {
  const [network, setNetwork] = useState<Network>();
  const [error, setError] = useState<any>()
  const updateNetwork = () => {
    multiverse
      .getNetwork()
      .then((network) => {
        setNetwork(network)
        setError(undefined)
      })
      .catch(setError);
  };
  useEffect(() => {
    updateNetwork();
    return multiverse.on("networkChanged", () => updateNetwork());
  }, []);
  if (error) {
    return <div className="text-red-500">{error.message}</div>
  }
  if (network) {
    return (
      <div> 
        <div className="font-bold">The currently selected network is:</div>
        <div>ID: {network?.id}</div>
        <div>Name: {network?.name}</div>
        <div>Server: {network?.server}</div>
      </div>
    );
  }
  return <div>No Network information available</div>;
}
