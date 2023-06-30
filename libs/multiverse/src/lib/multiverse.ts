import { EventEmitter } from 'events';
import { ITransport, WindowTransport } from './transport';
import {
  Account,
  APIEvent,
  CreateAccountRequest,
  CreateNetworkRequest,
  DeleteAccountRequest,
  DeleteNetworkRequest,
  DeleteSiteRequest,
  GetTransactionRequest,
  Network,
  PublicRPCRequestMethod,
  RevealRecoveryPhraseRequest,
  RPCRequestMethod,
  SelectAccountRequest,
  SelectNetworkRequest,
  SetupRecoveryPhraseRequest,
  Site,
  SiteConnectionRequest,
  UnlockRequest,
  UpdateAccountRequest,
  UpdateNetworkRequest,
  Transaction,
  SignAndSubmitTransactionRequest,
  Settings,
  CancelTransactionRequest,
  NFT,
  CreateNFTokenRequest,
  DeleteNFTokenRequest,
} from './types';

export class BaseClient {
  protected transport = new WindowTransport();

  setTransport(transport: ITransport) {
    this.transport = transport;
  }

  on(eventName: APIEvent, cb: (data: any) => void): () => void {
    this.transport.on(eventName, cb);
    return () => this.transport.off(eventName, cb);
  }
}

export class PublicAPI extends BaseClient {
  async isActive(timeoutMs = 1000) {
    try {
      return await this.transport.makeRPC<void, boolean>(
        {
          method: PublicRPCRequestMethod.ping,
        },
        { timeoutMs }
      );
    } catch (e) {
      return false;
    }
  }
  async isConnected() {
    return this.transport.makeRPC<void, boolean>({
      method: PublicRPCRequestMethod.isConnected,
    });
  }
  async connect(): Promise<boolean> {
    return await this.transport.makeRPC<void, boolean>({
      method: PublicRPCRequestMethod.connect,
    });
  }
  async disconnect(): Promise<void> {
    await this.transport.makeRPC<void, void>({
      method: PublicRPCRequestMethod.disconnect,
    });
  }
  async getAccount(): Promise<Account | undefined> {
    return await this.transport.makeRPC<void, Account | undefined>({
      method: PublicRPCRequestMethod.getAccount,
    });
  }
  async getNetwork(): Promise<Network | undefined> {
    return await this.transport.makeRPC<void, Network | undefined>({
      method: PublicRPCRequestMethod.getNetwork,
    });
  }
  async requestTransaction(transaction: any): Promise<string> {
    return await this.transport.makeRPC<any, string>({
      method: PublicRPCRequestMethod.requestTransaction,
      data: transaction,
    });
  }
  async getTransaction(transactionId: string) {
    return this.transport.makeRPC<GetTransactionRequest, Transaction>({
      method: PublicRPCRequestMethod.getTransaction,
      data: {
        id: transactionId,
      },
    });
  }
  async getSettings() {
    return this.transport.makeRPC<void, Settings>({
      method: PublicRPCRequestMethod.getSettings,
    });
  }
  async updateSettings(settings: Partial<Settings>) {
    return this.transport.makeRPC<Partial<Settings>, Settings>({
      method: PublicRPCRequestMethod.updateSettings,
      data: settings,
    });
  }
}

export class InternalAPI extends PublicAPI {
  async lock() {
    await this.transport.makeRPC({
      method: RPCRequestMethod.lock,
    });
  }

  async unlock(password: string) {
    return await this.transport.makeRPC<UnlockRequest, void>({
      method: RPCRequestMethod.unlock,
      data: { password },
    });
  }

  async isLocked() {
    return await this.transport.makeRPC<void, boolean>({
      method: RPCRequestMethod.isLocked,
    });
  }

  async hasCompletedSetup() {
    return await this.transport.makeRPC<void, boolean>({
      method: RPCRequestMethod.hasCompletedSetup,
    });
  }

  async setupRecoveryPhrase(data: SetupRecoveryPhraseRequest) {
    return await this.transport.makeRPC<SetupRecoveryPhraseRequest, boolean>({
      method: RPCRequestMethod.setupRecoveryPhrase,
      data,
    });
  }

  async revealRecoveryPhrase(password: string) {
    return await this.transport.makeRPC<RevealRecoveryPhraseRequest, string>({
      method: RPCRequestMethod.revealRecoveryPhrase,
      data: { password },
    });
  }
  async listAccounts() {
    return this.transport.makeRPC<void, Account[]>({
      method: RPCRequestMethod.listAccounts,
    });
  }
  async getSelectedAccount() {
    return this.transport.makeRPC<void, Account>({
      method: RPCRequestMethod.getSelectedAccount,
    });
  }
  async selectAccount(id: string) {
    return this.transport.makeRPC<SelectAccountRequest, Account>({
      method: RPCRequestMethod.selectAccount,
      data: { id },
    });
  }
  async createAccount(req: CreateAccountRequest) {
    return this.transport.makeRPC<CreateAccountRequest, Account>({
      method: RPCRequestMethod.createAccount,
      data: req,
    });
  }
  async deleteAccount(id: string) {
    return this.transport.makeRPC<DeleteAccountRequest, void>({
      method: RPCRequestMethod.deleteAccount,
      data: { id },
    });
  }
  async updateAccount(id: string, account: Partial<Account>) {
    return this.transport.makeRPC<UpdateAccountRequest, void>({
      method: RPCRequestMethod.updateAccount,
      data: {
        id,
        account,
      },
    });
  }
  async listNetworks() {
    return this.transport.makeRPC<void, Network[]>({
      method: RPCRequestMethod.listNetworks,
    });
  }
  async getSelectedNetwork() {
    return this.transport.makeRPC<void, Network>({
      method: RPCRequestMethod.getSelectedNetwork,
    });
  }
  async selectNetwork(id: string) {
    return this.transport.makeRPC<SelectNetworkRequest, Network>({
      method: RPCRequestMethod.selectNetwork,
      data: { id },
    });
  }
  async createNetwork(req: CreateNetworkRequest) {
    return this.transport.makeRPC<CreateAccountRequest, Account>({
      method: RPCRequestMethod.createNetwork,
      data: req,
    });
  }
  async deleteNetwork(id: string) {
    return this.transport.makeRPC<DeleteNetworkRequest, void>({
      method: RPCRequestMethod.deleteNetwork,
      data: { id },
    });
  }
  async updateNetwork(id: string, network: Partial<Network>) {
    return this.transport.makeRPC<UpdateNetworkRequest, void>({
      method: RPCRequestMethod.updateNetwork,
      data: { id, network },
    });
  }
  async listSites() {
    return this.transport.makeRPC<void, Site[]>({
      method: RPCRequestMethod.listSites,
    });
  }

  async getSiteConnectionRequests() {
    return this.transport.makeRPC<void, SiteConnectionRequest[]>({
      method: RPCRequestMethod.getSiteConnectionRequests,
    });
  }

  async approveSite(site: Site) {
    return this.transport.makeRPC<Site, boolean>({
      method: RPCRequestMethod.approveSite,
      data: site,
    });
  }

  async deleteSite(data: DeleteSiteRequest) {
    return this.transport.makeRPC<DeleteSiteRequest, boolean>({
      method: RPCRequestMethod.deleteSite,
      data,
    });
  }

  async denySite(data: SiteConnectionRequest) {
    return this.transport.makeRPC<SiteConnectionRequest, boolean>({
      method: RPCRequestMethod.denySite,
      data,
    });
  }

  async getApiLogs() {
    return this.transport.makeRPC<void, any[]>({
      method: RPCRequestMethod.getApiLogs,
    });
  }

  async clearApiLogs() {
    return this.transport.makeRPC<void, void>({
      method: RPCRequestMethod.clearApiLogs,
    });
  }
  async signAndSubmitTransaction(transactionId: string) {
    return this.transport.makeRPC<SignAndSubmitTransactionRequest, string>({
      method: RPCRequestMethod.signAndSubmitTransaction,
      data: {
        id: transactionId,
      },
    });
  }
  async cancelTransaction(transactionId: string) {
    return this.transport.makeRPC<CancelTransactionRequest, string>({
      method: RPCRequestMethod.cancelTransaction,
      data: {
        id: transactionId,
      },
    });
  }
  async listTransactions() {
    return this.transport.makeRPC<void, Transaction[]>({
      method: RPCRequestMethod.listTransactions,
    });
  }
  async clearTransactionHistory() {
    return this.transport.makeRPC<void, Transaction[]>({
      method: RPCRequestMethod.clearTransactionHistory,
    });
  }
  async closePopup() {
    return this.transport.makeRPC<void, void>({
      method: RPCRequestMethod.closePopup,
    });
  }
  async createNFToken(data: CreateNFTokenRequest) {
    return this.transport.makeRPC<CreateNFTokenRequest, NFT>({
      method: RPCRequestMethod.createNFToken,
      data,
    });
  }
  async listNFTokens() {
    return this.transport.makeRPC<void, NFT[]>({
      method: RPCRequestMethod.listNFTokens,
    });
  }
  async deleteNFToken(id: string) {
    return this.transport.makeRPC<DeleteNFTokenRequest, void>({
      method: RPCRequestMethod.deleteNFToken,
      data: { id },
    });
  }
}

export default new PublicAPI();
