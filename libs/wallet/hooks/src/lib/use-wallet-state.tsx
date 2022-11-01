import React, { createContext, useContext, useEffect, useState } from "react";
import {
  PublicAPI,
  BrowserRuntimeTransport,
  Account,
  Transaction,
  Network,
  Site,
  SiteConnectionRequest,
  Settings,
} from "@multiverse-wallet/multiverse";
import api from "@multiverse-wallet/multiverse";
import { Background } from "@multiverse-wallet/shared/api";

if (chrome?.runtime) {
  api.setTransport(new BrowserRuntimeTransport());
} else {
  // When in a browser context create a background instance locally.
  new Background();
}

const walletStateContext = createContext<{
  api: PublicAPI;
  lastUpdate: number;
}>({} as any);

export function useWalletState() {
  return useContext(walletStateContext);
}

export const WalletStateProvider = ({ children }: any) => {
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  useEffect(() => {
    return api.on("update", () => setLastUpdate(Date.now()));
  }, []);
  return (
    <walletStateContext.Provider value={{ api, lastUpdate }}>
      {children}
    </walletStateContext.Provider>
  );
};

export function useSelectedAccount() {
  const { api, lastUpdate } = useWalletState();
  const [selectedAccount, setSelectedAccount] = useState<Account>();
  useEffect(() => {
    api.getSelectedAccount().then((account) => setSelectedAccount(account));
  }, [api, lastUpdate]);
  return {
    selectedAccount,
    setSelectedAccount: (account: Account) => {
      api.selectAccount(account.id);
    },
  };
}

export function useAccounts() {
  const { api, lastUpdate } = useWalletState();
  useEffect(() => {
    api.listAccounts().then((accounts) => setAccounts(accounts));
  }, [api, lastUpdate]);
  const [accounts, setAccounts] = useState<Account[]>();
  return accounts;
}

export function useSelectedNetwork() {
  const { api, lastUpdate } = useWalletState();
  const [selectedNetwork, setSelectedNetwork] = useState<Network>();
  useEffect(() => {
    api.getSelectedNetwork().then((network) => setSelectedNetwork(network));
  }, [api, lastUpdate]);
  return {
    selectedNetwork,
    setSelectedNetwork: (network: Network) => {
      api.selectNetwork(network.id);
    },
  };
}

export function useNetworks() {
  const { api, lastUpdate } = useWalletState();
  const [networks, setNetworks] = useState<Network[]>();
  useEffect(() => {
    api.listNetworks().then((networks) => setNetworks(networks));
  }, [api, lastUpdate]);
  return networks;
}

export function useSites() {
  const { api, lastUpdate } = useWalletState();
  const [sites, setSites] = useState<Site[]>();
  useEffect(() => {
    api.listSites().then((sites) => setSites(sites));
  }, [api, lastUpdate]);
  return sites;
}

export function useSiteConnectionRequests() {
  const { api, lastUpdate } = useWalletState();
  const [connectionRequests, setConnectionRequests] =
    useState<SiteConnectionRequest[]>();
  useEffect(() => {
    api
      .getSiteConnectionRequests()
      .then((connectionRequests) => setConnectionRequests(connectionRequests));
  }, [api, lastUpdate]);
  return connectionRequests;
}

export function useIsLocked() {
  const { api, lastUpdate } = useWalletState();
  const [isLocked, setIsLocked] = useState<boolean>(true);
  useEffect(() => {
    api.isLocked().then((result) => {
      setIsLocked(result);
    });
  }, [api, lastUpdate]);
  return isLocked;
}

export function useHasCompletedSetup() {
  const { api, lastUpdate } = useWalletState();
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedSetup, setHasCompletedSetup] = useState<boolean>(false);
  useEffect(() => {
    api.hasCompletedSetup().then((result) => {
      setHasCompletedSetup(result);
      setIsLoading(false);
    });
  }, [api, lastUpdate]);
  return { hasCompletedSetup, isLoading };
}

export function useIsInitialized() {
  const { api } = useWalletState();
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  useEffect(() => {
    api.isActive().then((result) => {
      setIsInitialized(result);
    });
  }, [api]);
  return isInitialized;
}

export function useSupportsNFTokenMethods() {
  const { selectedNetwork } = useSelectedNetwork();
  const [supportsNFTokenMethods, setSupportsNFTokenMethods] = useState(false);
  useEffect(() => {
    setSupportsNFTokenMethods(
      selectedNetwork?.options?.supportsNFTokenMethods || false
    );
  }, [selectedNetwork]);
  return supportsNFTokenMethods;
}

export function useAPILogs() {
  const { api, lastUpdate } = useWalletState();
  const [apiLogs, setApiLogs] = useState<any[]>();
  useEffect(() => {
    api.getApiLogs().then((apiLogs) => setApiLogs(apiLogs));
  }, [api, lastUpdate]);
  return apiLogs;
}

export function useTransactions() {
  const { api, lastUpdate } = useWalletState();
  const [txs, setTxs] = useState<Transaction[]>();
  useEffect(() => {
    api.listTransactions().then((txs) => setTxs(txs));
  }, [api, lastUpdate]);
  return txs;
}

export function useTransaction(transactionId?: string) {
  const { api, lastUpdate } = useWalletState();
  const [transaction, setTransaction] = useState<Transaction>();
  const [error, setError] = useState<any>();
  useEffect(() => {
    !!transactionId &&
      api
        .getTransaction(transactionId)
        .then((tx) => setTransaction(tx))
        .catch(setError);
  }, [transactionId, api, lastUpdate]);
  return {
    transaction,
    error,
  };
}

export function useSettings() {
  const { api, lastUpdate } = useWalletState();
  const [settings, setSettings] = useState<Settings>();
  useEffect(() => {
    api.getSettings().then((settings) => setSettings(settings));
  }, [api, lastUpdate]);
  return settings;
}