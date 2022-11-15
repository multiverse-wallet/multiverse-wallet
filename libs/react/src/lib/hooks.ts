import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Account,
  Network,
  PublicAPI,
  Transaction,
} from '@multiverse-wallet/multiverse';
import * as xrpl from 'xrpl';

const defaultApi = new PublicAPI();

export interface Opts {
  // Overrides the API instance to be used by the hook.
  overrideApi?: PublicAPI;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UseConnectOpts extends Opts {}

export interface IUseConnect {
  isActive: boolean;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  error?: Error;
  revalidate: () => void;
}

export function useConnect({ overrideApi }: UseConnectOpts = {}): IUseConnect {
  const api = useMemo(() => overrideApi || defaultApi, [overrideApi]);
  const [isActive, setIsActive] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error>();
  const connect = () => {
    api
      ?.connect()
      .then(() => setError(undefined))
      .catch((e) => setError(e));
  };
  const disconnect = () => {
    api
      ?.disconnect()
      .then(() => setError(undefined))
      .catch((e) => setError(e));
  };
  const revalidate = useCallback(() => {
    api
      ?.isConnected()
      .then((c) => {
        setError(undefined);
        setIsConnected(c);
      })
      .catch((e) => setError(e));
    api
      ?.isActive()
      .then((a) => {
        setError(undefined);
        setIsActive(a);
      })
      .catch((e) => setError(e));
  }, [api]);
  useEffect(() => {
    revalidate();
    return api?.on('accountChanged', () => {
      revalidate();
    });
  }, [api, revalidate]);
  useEffect(() => {
    revalidate();
    return api?.on('connectionChanged', () => {
      revalidate();
    });
  }, [api, revalidate]);
  useEffect(() => {
    revalidate();
    return api?.on('update', () => {
      revalidate();
    });
  }, [api, revalidate]);
  return {
    isConnected,
    isActive,
    connect,
    disconnect,
    error,
    revalidate,
  };
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UseAccountOpts extends Opts {}

export interface IUseAccount {
  account?: Account;
  error?: Error;
  revalidate: () => void;
}

export function useAccount({ overrideApi }: UseAccountOpts = {}): IUseAccount {
  const api = useMemo(() => overrideApi || defaultApi, [overrideApi]);
  const [account, setAccount] = useState<Account>();
  const [error, setError] = useState<Error>();
  const revalidate = useCallback(() => {
    api
      ?.getAccount()
      .then((a) => {
        setError(undefined);
        setAccount(a);
      })
      .catch((e) => setError(e));
  }, [api]);
  useEffect(() => {
    revalidate();
    return api?.on('accountChanged', () => {
      revalidate();
    });
  }, [api, revalidate]);
  return {
    account,
    error,
    revalidate,
  };
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UseNetworkOpts extends Opts {}

export interface IUseNetwork {
  network?: Network;
  error?: Error;
  revalidate: () => void;
}

export function useNetwork({ overrideApi }: UseNetworkOpts = {}): IUseNetwork {
  const api = useMemo(() => overrideApi || defaultApi, [overrideApi]);
  const [network, setNetwork] = useState<Network>();
  const [error, setError] = useState<Error>();
  const revalidate = useCallback(() => {
    api
      ?.getNetwork()
      .then((n) => {
        setError(undefined);
        setNetwork(n);
      })
      .catch((e) => setError(e));
  }, [api]);
  useEffect(() => {
    revalidate();
    return api?.on('networkChanged', () => {
      revalidate();
    });
  }, [api, revalidate]);
  return {
    network,
    error,
    revalidate,
  };
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UseTransactionOpts extends Opts {
  transactionId?: string;
}

export interface IUseTransaction {
  requestTransaction: (txJson: unknown) => void;
  transaction?: Transaction;
  error?: Error;
  revalidate: () => void;
}

export function useTransaction({
  transactionId: defaultTransactionId,
  overrideApi,
}: UseTransactionOpts = {}): IUseTransaction {
  const api = useMemo(() => overrideApi || defaultApi, [overrideApi]);
  const [transactionId, setTransactionId] = useState<string | undefined>(
    defaultTransactionId
  );
  const [transaction, setTransaction] = useState<Transaction>();
  const [error, setError] = useState<Error>();
  const requestTransaction = useCallback(
    (transaction: unknown) => {
      return api
        ?.requestTransaction(transaction)
        .then((id) => {
          setError(undefined);
          setTransactionId(id);
        })
        .catch((e) => setError(e));
    },
    [api]
  );
  const revalidate = useCallback(() => {
    !!transactionId &&
      api
        ?.getTransaction(transactionId)
        .then((t) => {
          setError(undefined);
          setTransaction(t);
        })
        .catch((e) => setError(e));
  }, [transactionId, api]);
  useEffect(() => {
    revalidate();
    return api?.on('transactionStatusChanged', (tx) => {
      revalidate();
    });
  }, [api, revalidate]);
  return {
    transaction,
    error,
    revalidate,
    requestTransaction,
  };
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UseClientOpts extends Opts {
  clientOptions?: xrpl.ClientOptions;
}

export function useClient({ overrideApi, clientOptions }: UseClientOpts) {
  const { network } = useNetwork({ overrideApi });
  const [client, setClient] = useState<xrpl.Client>();
  const [error, setError] = useState<Error>();
  const reconnect = useCallback(async () => {
    setClient(undefined);
    if (!network) return;
    const client = new xrpl.Client(network.server, clientOptions);
    await client.connect().catch((e) => setError(e));
    client.on('error', (e) => setError(e));
    client.on('disconnected', () => reconnect());
    setClient(client);
    setError(undefined);
  }, [network, clientOptions]);
  const disconnect = useCallback(() => {
    client?.disconnect();
  }, [client]);
  useEffect(() => {
    reconnect();
    return () => disconnect();
  }, [reconnect, disconnect]);
  return {
    client,
    error,
  };
}
