import React from 'react';
import { useNetwork } from '@multiverse-wallet/react';

export default function GetNetwork() {
  const { network, error } = useNetwork();
  if (error) {
    return <div className="text-red-500">{error.message}</div>;
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
