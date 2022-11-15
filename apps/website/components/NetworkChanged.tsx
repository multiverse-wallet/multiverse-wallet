import React from 'react';
import { useNetwork } from '@multiverse-wallet/react';

export default function NetworkChanged() {
  const { network } = useNetwork();
  return <div>Network changed to {network?.name}</div>;
}
