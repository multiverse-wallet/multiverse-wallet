import React from 'react';
import { useConnect } from '@multiverse-wallet/react';

export default function IsConnected() {
  const { isConnected, error } = useConnect();
  if (error) {
    return <div className="text-red-500">{error.message}</div>;
  }
  if (isConnected) {
    return <div>Multiverse Wallet is connected!</div>;
  }
  return <div>Multiverse Wallet is not connected</div>;
}
