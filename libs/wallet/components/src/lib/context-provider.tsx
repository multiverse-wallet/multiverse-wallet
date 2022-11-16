import React, { useState } from 'react';
import { XRPLContextProvider } from '@xrpl-components/react/components/xrpl-context-provider';
import * as xrpl from 'xrpl';
import { useSelectedNetwork } from '@multiverse-wallet/wallet/hooks';

export interface ContextProviderProps {
  children: any;
}

export function ContextProvider({ children }: ContextProviderProps) {
  const { selectedNetwork } = useSelectedNetwork();
  return (
    <XRPLContextProvider
      xrpl={xrpl as any}
      server={selectedNetwork?.server as string}
    >
      {children}
    </XRPLContextProvider>
  );
}
