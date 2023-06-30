import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  BrowserRuntimeTransport,
  Account,
  Transaction,
  Network,
  Site,
  SiteConnectionRequest,
  Settings,
  InternalAPI,
  NFT,
} from '@multiverse-wallet/multiverse';
import { Background } from '@multiverse-wallet/shared/api';
import { useXRPLContext } from '@xrpl-components/react/hooks/xrpl';

export interface IWalletAPIContext {
  api: InternalAPI;
  lastUpdate: number;
}

const walletAPIContext = createContext<IWalletAPIContext>(
  {} as IWalletAPIContext
);

export function useWalletAPI() {
  return useContext(walletAPIContext);
}

const transport = chrome?.runtime ? new BrowserRuntimeTransport() : undefined;

if (!chrome?.runtime) {
  new Background();
}

export const WalletStateProvider = ({ children }: any) => {
  const api = useMemo(() => {
    const api = new InternalAPI();
    if (chrome?.runtime) {
      api.setTransport(transport as BrowserRuntimeTransport);
    }
    return api;
  }, []);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  useEffect(() => {
    return api.on('update', () => setLastUpdate(Date.now()));
  }, []);
  return (
    <walletAPIContext.Provider value={{ api, lastUpdate }}>
      {children}
    </walletAPIContext.Provider>
  );
};

export function useSelectedAccount() {
  const { api, lastUpdate } = useWalletAPI();
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
  const { api, lastUpdate } = useWalletAPI();
  useEffect(() => {
    api.listAccounts().then((accounts) => setAccounts(accounts));
  }, [api, lastUpdate]);
  const [accounts, setAccounts] = useState<Account[]>();
  return accounts;
}

export function useSelectedNetwork() {
  const { api, lastUpdate } = useWalletAPI();
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
  const { api, lastUpdate } = useWalletAPI();
  const [networks, setNetworks] = useState<Network[]>();
  useEffect(() => {
    api.listNetworks().then((networks) => setNetworks(networks));
  }, [api, lastUpdate]);
  return networks;
}

export function useSites() {
  const { api, lastUpdate } = useWalletAPI();
  const [sites, setSites] = useState<Site[]>();
  useEffect(() => {
    api.listSites().then((sites) => setSites(sites));
  }, [api, lastUpdate]);
  return sites;
}

export function useSiteConnectionRequests() {
  const { api, lastUpdate } = useWalletAPI();
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
  const { api, lastUpdate } = useWalletAPI();
  const [isLocked, setIsLocked] = useState<boolean>(true);
  useEffect(() => {
    api.isLocked().then((result) => {
      setIsLocked(result);
    });
  }, [api, lastUpdate]);
  return isLocked;
}

export function useHasCompletedSetup() {
  const { api, lastUpdate } = useWalletAPI();
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
  const { api } = useWalletAPI();
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
  const { api, lastUpdate } = useWalletAPI();
  const [apiLogs, setApiLogs] = useState<any[]>();
  useEffect(() => {
    api.getApiLogs().then((apiLogs) => setApiLogs(apiLogs));
  }, [api, lastUpdate]);
  return apiLogs;
}

export function useTransactions() {
  const { api, lastUpdate } = useWalletAPI();
  const [txs, setTxs] = useState<Transaction[]>();
  useEffect(() => {
    api.listTransactions().then((txs) => setTxs(txs));
  }, [api, lastUpdate]);
  return txs;
}

export function useTransaction(transactionId?: string) {
  const { api, lastUpdate } = useWalletAPI();
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
  const { api, lastUpdate } = useWalletAPI();
  const [settings, setSettings] = useState<Settings>();
  useEffect(() => {
    api.getSettings().then((settings) => setSettings(settings));
  }, [api, lastUpdate]);
  return settings;
}

export function useSelectedAccountBalances() {
  const { selectedAccount } = useSelectedAccount();
  const { client } = useXRPLContext();
  const [balances, setBalances] = useState<
    {
      value: string;
      currency: string;
      issuer?: string | undefined;
    }[]
  >();
  useEffect(() => {
    if (!selectedAccount?.address) {
      setBalances(undefined);
      return;
    }
    client
      ?.getBalances(selectedAccount?.address)
      .then((balances) => {
        setBalances(balances);
      })
      .catch(() => setBalances(undefined));
  }, [client, selectedAccount]);
  return balances;
}

export interface NFToken {
  Flags: number;
  Issuer: string;
  NFTokenID: string;
  NFTokenTaxon: number;
  URI?: string;
  nft_serial: number;
}

export function useSelectedAccountNFTs() {
  const { selectedAccount } = useSelectedAccount();
  const { client } = useXRPLContext();
  const [nfts, setNFTs] = useState<NFToken[]>();
  useEffect(() => {
    if (!selectedAccount?.address) {
      setNFTs(undefined);
      return;
    }
    client
      ?.request({ command: 'account_nfts', account: selectedAccount?.address })
      .then((nfts: any) => {
        setNFTs(nfts?.result?.account_nfts as NFToken[]);
      })
      .catch(() => setNFTs(undefined));
  }, [client, selectedAccount]);
  return nfts;
}

export function useNFTs() {
  const { api, lastUpdate } = useWalletAPI();
  const [nfts, setNFTs] = useState<NFT[]>();
  useEffect(() => {
    api.listNFTokens().then((nfts) => setNFTs(nfts));
  }, [api, lastUpdate]);
  return nfts;
}

export function useXRPLAccountReserve() {
  const { selectedAccount } = useSelectedAccount();
  const { client } = useXRPLContext();
  const [reserve, setReserve] = useState<number>(0);
  const updateReserve = useCallback(async () => {
    if (!selectedAccount?.address) return;
    const accountInfo = await client?.request({
      command: 'account_info',
      account: selectedAccount?.address,
    });
    const serverInfo = await client?.request({
      command: 'server_info',
    });
    const ownerCount = accountInfo?.result?.account_data?.OwnerCount || 0;
    const reserveIncXRP =
      serverInfo?.result?.info?.validated_ledger?.reserve_inc_xrp || 0;
    const reserveBaseXRP =
      serverInfo?.result?.info?.validated_ledger?.reserve_base_xrp || 0;
    setReserve(ownerCount * reserveIncXRP + reserveBaseXRP);
  }, [selectedAccount, client]);
  useEffect(() => {
    updateReserve();
  }, [updateReserve]);
  return reserve;
}
