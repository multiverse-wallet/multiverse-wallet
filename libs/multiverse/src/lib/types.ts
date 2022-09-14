export enum RPCRequestMethod {
  lock = "lock",
  unlock = "unlock",
  isLocked = "isLocked",
  hasCompletedSetup = "hasCompletedSetup",
  setupRecoveryPhrase = "setupRecoveryPhrase",
  revealRecoveryPhrase = "revealRecoveryPhrase",
  createSiteConnectionRequest = "createSiteConnectionRequest",
  openPopup = "openPopup",
  ping = "ping",
  listAccounts = "listAccounts",
  getSelectedAccount = "getSelectedAccount",
  selectAccount = "selectAccount",
  createAccount = "createAccount",
  deleteAccount = "deleteAccount",
  updateAccount = "updateAccount",
  listNetworks = "listNetworks",
  getSelectedNetwork = "getSelectedNetwork",
  createNetwork = "createNetwork",
  updateNetwork = "updateNetwork",
  deleteNetwork = "deleteNetwork",
  selectNetwork = "selectNetwork",
  listSites = "listSites",
  getSiteConnectionRequests = "getSiteConnectionRequests",
  approveSite = "approveSite",
  denySite = "denySite",
  deleteSite = "deleteSite",
}

export interface Network {
  id: string;
  name: string;
  server: string;
  options?: NetworkOptions
}

export interface NetworkOptions {
  supportsNFTokenMethods: boolean;
}

export interface CreateNetworkRequest {
  name: string;
  server: string;
  options?: NetworkOptions;
}

export interface DeleteNetworkRequest {
  id: string;
}

export interface UpdateNetworkRequest {
  id: string;
  network: Partial<Network>;
}

export interface SelectNetworkRequest {
  id: string;
}

export interface Account {
  id: string;
  name: string;
  address: string;
  derivationPath?: string;
}

export interface CreateAccountRequest {
  name: string;
  derivationPath?: string;
  secret?: string;
}

export interface DeleteAccountRequest {
  id: string;
}

export interface UpdateAccountRequest {
  id: string;
  account: Partial<Account>;
}

export interface SelectAccountRequest {
  id: string;
}

export interface Site {
  origin: string;
  allowedAccounts: string[];
}

export interface DeleteSiteRequest {
  origin: string;
}

export interface SiteConnectionRequest {
  origin?: string;
}

export type SiteConnectionStatus = "connected" | "pending" | "created";

export interface UnlockRequest {
  password: string;
}

export interface SetupRecoveryPhraseRequest {
  password: string;
  secretRecoveryPhrase: string;
}

export interface RevealRecoveryPhraseRequest {
  password: string;
}
