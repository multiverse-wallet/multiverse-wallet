import React from 'react';
import { useConnect } from '@multiverse-wallet/react';

export default function IsActive() {
  const { isActive } = useConnect();
  if (isActive) {
    return <div>Multiverse Wallet is active!</div>;
  }
  return <div>Multiverse Wallet is not available</div>;
}
