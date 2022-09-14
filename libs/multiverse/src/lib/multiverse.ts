import { ITransport, WindowTransport } from "./transport";
import {
  Account,
  CreateAccountRequest,
  CreateNetworkRequest,
  DeleteAccountRequest,
  DeleteNetworkRequest,
  DeleteSiteRequest,
  Network,
  RevealRecoveryPhraseRequest,
  RPCRequestMethod,
  SelectAccountRequest,
  SelectNetworkRequest,
  SetupRecoveryPhraseRequest,
  Site,
  SiteConnectionRequest,
  SiteConnectionStatus,
  UnlockRequest,
  UpdateAccountRequest,
  UpdateNetworkRequest,
} from "./types";

export class MultiverseClientAPI {
  public transport = new WindowTransport();

  setTransport(transport: ITransport) {
    this.transport = transport;
  }

  onUpdate(cb: () => void) {
    return this.transport.subscribe("MULTIVERSE_UPDATE", cb);
  }

  async lock() {
    await this.transport.makeRPCCall({
      method: RPCRequestMethod.lock,
    });
  }

  async unlock(password: string) {
    return await this.transport.makeRPCCall<UnlockRequest, void>({
      method: RPCRequestMethod.unlock,
      data: { password },
    });
  }

  async isLocked() {
    return await this.transport.makeRPCCall<void, boolean>({
      method: RPCRequestMethod.isLocked,
    });
  }

  async hasCompletedSetup() {
    return await this.transport.makeRPCCall<void, boolean>({
      method: RPCRequestMethod.hasCompletedSetup,
    });
  }

  async setupRecoveryPhrase(data: SetupRecoveryPhraseRequest) {
    return await this.transport.makeRPCCall<
      SetupRecoveryPhraseRequest,
      boolean
    >({
      method: RPCRequestMethod.setupRecoveryPhrase,
      data,
    });
  }

  async revealRecoveryPhrase(password: string) {
    return await this.transport.makeRPCCall<
      RevealRecoveryPhraseRequest,
      string
    >({
      method: RPCRequestMethod.revealRecoveryPhrase,
      data: { password },
    });
  }

  async connect(): Promise<SiteConnectionStatus> {
    const connectionStatus = await this.transport.makeRPCCall<
      SiteConnectionRequest,
      SiteConnectionStatus
    >({
      method: RPCRequestMethod.createSiteConnectionRequest,
    });
    if (connectionStatus === "connected" || connectionStatus === "pending") {
      return connectionStatus;
    }
    await this.transport.makeRPCCall({
      method: RPCRequestMethod.openPopup,
      data: { path: "/popup/connect" },
    });
    return connectionStatus;
  }
  async ping() {
    return this.transport.makeRPCCall<void, boolean>({
      method: RPCRequestMethod.ping,
    });
  }
  async listAccounts() {
    return this.transport.makeRPCCall<void, Account[]>({
      method: RPCRequestMethod.listAccounts,
    });
  }
  async getSelectedAccount() {
    return this.transport.makeRPCCall<void, Account>({
      method: RPCRequestMethod.getSelectedAccount,
    });
  }
  async selectAccount(id: string) {
    return this.transport.makeRPCCall<SelectAccountRequest, Account>({
      method: RPCRequestMethod.selectAccount,
      data: { id },
    });
  }
  async createAccount(req: CreateAccountRequest) {
    return this.transport.makeRPCCall<CreateAccountRequest, Account>({
      method: RPCRequestMethod.createAccount,
      data: req,
    });
  }
  async deleteAccount(id: string) {
    return this.transport.makeRPCCall<DeleteAccountRequest, void>({
      method: RPCRequestMethod.deleteAccount,
      data: { id },
    });
  }
  async updateAccount(id: string, account: Partial<Account>) {
    return this.transport.makeRPCCall<UpdateAccountRequest, void>({
      method: RPCRequestMethod.updateAccount,
      data: {
        id,
        account,
      },
    });
  }
  async listNetworks() {
    return this.transport.makeRPCCall<void, Network[]>({
      method: RPCRequestMethod.listNetworks,
    });
  }
  async getSelectedNetwork() {
    return this.transport.makeRPCCall<void, Network>({
      method: RPCRequestMethod.getSelectedNetwork,
    });
  }
  async selectNetwork(id: string) {
    return this.transport.makeRPCCall<SelectNetworkRequest, Network>({
      method: RPCRequestMethod.selectNetwork,
      data: { id },
    });
  }
  async createNetwork(req: CreateNetworkRequest) {
    return this.transport.makeRPCCall<CreateAccountRequest, Account>({
      method: RPCRequestMethod.createNetwork,
      data: req,
    });
  }
  async deleteNetwork(id: string) {
    return this.transport.makeRPCCall<DeleteNetworkRequest, void>({
      method: RPCRequestMethod.deleteNetwork,
      data: { id },
    });
  }
  async updateNetwork(id: string, network: Partial<Network>) {
    return this.transport.makeRPCCall<UpdateNetworkRequest, void>({
      method: RPCRequestMethod.updateNetwork,
      data: { id, network },
    });
  }
  async listSites() {
    return this.transport.makeRPCCall<void, Site[]>({
      method: RPCRequestMethod.listSites,
    });
  }

  async getSiteConnectionRequests() {
    return this.transport.makeRPCCall<void, SiteConnectionRequest[]>({
      method: RPCRequestMethod.getSiteConnectionRequests,
    });
  }

  async approveSite(site: Site) {
    return this.transport.makeRPCCall<Site, boolean>({
      method: RPCRequestMethod.approveSite,
      data: site,
    });
  }

  async deleteSite(data: DeleteSiteRequest) {
    return this.transport.makeRPCCall<DeleteSiteRequest, boolean>({
      method: RPCRequestMethod.deleteSite,
      data,
    });
  }

  async denySite(data: SiteConnectionRequest) {
    return this.transport.makeRPCCall<SiteConnectionRequest, boolean>({
      method: RPCRequestMethod.denySite,
      data,
    });
  }
}

export default new MultiverseClientAPI();
