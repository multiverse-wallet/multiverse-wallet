import React from 'react';
import { useConnect } from '@multiverse-wallet/react';
import { Button } from '@multiverse-wallet/shared/components/button';

export default function Connect() {
  const { disconnect, isConnected, error } = useConnect();
  if (!isConnected) {
    return <>Not yet connected!</>;
  }
  if (error) {
    return <div className="text-red-500">{error.message}</div>;
  }
  return (
    <Button variant="light" onPress={() => disconnect()}>
      Click to disconnect
    </Button>
  );
}
