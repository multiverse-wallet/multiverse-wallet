import React, { createContext, useContext, useEffect, useState } from "react";
import {
  MultiverseClientAPI,
  BrowserRuntimeTransport,
  Account,
  Network,
  Site,
  SiteConnectionRequest,
} from "@multiverse-wallet/multiverse";
import { Background } from "@multiverse-wallet/shared/api";

const multiverseAPI = new MultiverseClientAPI();

if (chrome?.runtime) {
  multiverseAPI.setTransport(new BrowserRuntimeTransport());
} else {
  // When in a browser context create a background instance locally.
  new Background();
}

const walletStateContext = createContext<{
  api: MultiverseClientAPI;
  lastUpdate: number;
}>({} as any);

export function useWalletState() {
  return useContext(walletStateContext);
}

export const WalletStateProvider = ({ children }: any) => {
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  useEffect(() => {
    const unsubscribe = multiverseAPI.onUpdate(() => {
      setLastUpdate(Date.now());
    });
    return () => unsubscribe();
  });
  return (
    <walletStateContext.Provider value={{ api: multiverseAPI, lastUpdate }}>
      {children}
    </walletStateContext.Provider>
  );
};

export function useSelectedAccount() {
  const { api, lastUpdate } = useWalletState();
  const [selectedAccount, setSelectedAccount] = useState<Account>();
  useEffect(() => {
    api.getSelectedAccount().then((account) => setSelectedAccount(account));
  }, [lastUpdate]);
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
  }, [lastUpdate]);
  const [accounts, setAccounts] = useState<Account[]>();
  return accounts;
}

export function useSelectedNetwork() {
  const { api, lastUpdate } = useWalletState();
  const [selectedNetwork, setSelectedNetwork] = useState<Network>();
  useEffect(() => {
    api.getSelectedNetwork().then((network) => setSelectedNetwork(network));
  }, [lastUpdate]);
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
  }, [lastUpdate]);
  return networks;
}

export function useSites() {
  const { api, lastUpdate } = useWalletState();
  const [sites, setSites] = useState<Site[]>();
  useEffect(() => {
    api.listSites().then((sites) => setSites(sites));
  }, [lastUpdate]);
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
  }, [lastUpdate]);
  return connectionRequests;
}

export function useIsLocked() {
  const { api, lastUpdate } = useWalletState();
  const [isLocked, setIsLocked] = useState<boolean>(true);
  useEffect(() => {
    api.isLocked().then((result) => {
      setIsLocked(result);
    });
  }, [lastUpdate]);
  return isLocked;
}

export function useHasCompletedSetup() {
  const { api, lastUpdate } = useWalletState();
  const [hasCompletedSetup, setHasCompletedSetup] = useState<boolean>(false);
  useEffect(() => {
    api.hasCompletedSetup().then((result) => {
      setHasCompletedSetup(result);
    });
  }, [lastUpdate]);
  return hasCompletedSetup;
}

export function useIsInitialized() {
  const { api } = useWalletState();
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  useEffect(() => {
    api.ping().then((result) => {
      setIsInitialized(result);
    });
  }, []);
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
