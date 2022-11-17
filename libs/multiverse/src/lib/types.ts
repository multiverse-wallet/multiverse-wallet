export enum RPCRequestMethod {
  lock = 'lock',
  unlock = 'unlock',
  isLocked = 'isLocked',
  hasCompletedSetup = 'hasCompletedSetup',
  setupRecoveryPhrase = 'setupRecoveryPhrase',
  revealRecoveryPhrase = 'revealRecoveryPhrase',
  createSiteConnectionRequest = 'createSiteConnectionRequest',
  openPopup = 'openPopup',
  closePopup = 'closePopup',
  listAccounts = 'listAccounts',
  getSelectedAccount = 'getSelectedAccount',
  selectAccount = 'selectAccount',
  createAccount = 'createAccount',
  deleteAccount = 'deleteAccount',
  updateAccount = 'updateAccount',
  listNetworks = 'listNetworks',
  getSelectedNetwork = 'getSelectedNetwork',
  createNetwork = 'createNetwork',
  updateNetwork = 'updateNetwork',
  deleteNetwork = 'deleteNetwork',
  selectNetwork = 'selectNetwork',
  listSites = 'listSites',
  getSiteConnectionRequests = 'getSiteConnectionRequests',
  approveSite = 'approveSite',
  denySite = 'denySite',
  deleteSite = 'deleteSite',
  getApiLogs = 'getApiLogs',
  clearApiLogs = 'clearApiLogs',
  signAndSubmitTransaction = 'signAndSubmitTransaction',
  cancelTransaction = 'cancelTransaction',
  listTransactions = 'listTransactions',
  clearTransactionHistory = 'clearTransactionHistory',
  listCollections = 'listCollections',
  createCollection = 'createCollection',
  createNFToken = 'createNFToken',
}

export enum PublicRPCRequestMethod {
  ping = 'ping',
  isConnected = 'isConnected',
  connect = 'connect',
  disconnect = 'disconnect',
  getAccount = 'getAccount',
  getNetwork = 'getNetwork',
  requestTransaction = 'requestTransaction',
  getTransaction = 'getTransaction',
  getSettings = 'getSettings',
  updateSettings = 'updateSettings',
}

export enum APIEvents {
  update = 'update',
  connectionChanged = 'connectionChanged',
  accountChanged = 'accountChanged',
  networkChanged = 'networkChanged',
  transactionStatusChanged = 'transactionStatusChanged',
}

export type APIEvent = keyof typeof APIEvents;

export const MULTIVERSE_EVENT = 'MULTIVERSE_EVENT';
export const MULTIVERSE_RPC_REQUEST = 'MULTIVERSE_RPC_REQUEST';
export const MULTIVERSE_RPC_RESPONSE = 'MULTIVERSE_RPC_RESPONSE';

export interface Network {
  id: string;
  name: string;
  server: string;
  options?: NetworkOptions;
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
  encryptedSecret?: string;
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

export type SiteConnectionStatus = 'connected' | 'pending' | 'created';

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

export interface GetTransactionRequest {
  id: string;
}

export interface SignAndSubmitTransactionRequest {
  id: string;
}

export interface CancelTransactionRequest {
  id: string;
}

export interface Transaction {
  id: string;
  txJson: any;
  txHash?: any;
  origin: string;
  status: TransactionStatus;
  lastUpdate: number;
  createdAt: number;
  errorMessage?: string;
  rawTxResponse?: any;
}

export type TransactionStatus =
  | 'pending'
  | 'cancelled'
  | 'submitted'
  | 'failed'
  | 'validated';

export interface Settings {
  emailAddress?: string;
  feedbackOptIn?: boolean;
  exchangeRateCurrency?: string;
  ipfsGateway?: string;
}

export interface CreateCollectionRequest {
  name: string;
}
