import React from 'react';
import { useConnect } from '@multiverse-wallet/react';
import { Button } from '@multiverse-wallet/shared/components/button';

export default function Connect() {
  const { connect, isConnected, error } = useConnect();
  if (isConnected) {
    return <>A connection to this site already exists!</>;
  }
  if (error) {
    return <div className="text-red-500">{error?.message}</div>;
  }
  return (
    <Button variant="light" onPress={() => connect()}>
      Click to connect
    </Button>
  );
}
