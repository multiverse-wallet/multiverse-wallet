import {
  RPCRequest,
  RPCRequestMethod,
  RPCResponse,
  Site,
  SiteConnectionRequest,
  DeleteSiteRequest,
  SiteConnectionStatus,
  PublicRPCRequestMethod,
  APIEvents,
} from '@multiverse-wallet/multiverse';
import { API } from './api';
import { PublicMethod, WhitelistedMethod } from './decorators';
import { State } from './resource';

export interface SitesState {
  connectionRequests: SiteConnectionRequest[];
  sites: Site[];
}

export class SitesResource {
  public state = new State<SitesState>(SitesResource.name, {
    connectionRequests: [],
    sites: [],
  });
  constructor(private api: API) {
    api.rpcMethodRegistry.set(RPCRequestMethod.listSites, (r) =>
      this.listSites(r)
    );
    api.rpcMethodRegistry.set(
      RPCRequestMethod.createSiteConnectionRequest,
      (r) => this.createSiteConnectionRequest(r)
    );
    api.rpcMethodRegistry.set(RPCRequestMethod.getSiteConnectionRequests, (r) =>
      this.getSiteConnectionRequests()
    );
    api.rpcMethodRegistry.set(RPCRequestMethod.approveSite, (r) =>
      this.approveSite(r)
    );
    api.rpcMethodRegistry.set(RPCRequestMethod.deleteSite, (r) =>
      this.deleteSite(r)
    );
    api.rpcMethodRegistry.set(RPCRequestMethod.denySite, (r) =>
      this.denySite(r)
    );
    api.rpcMethodRegistry.set(PublicRPCRequestMethod.isConnected, (r) =>
      this.isConnected(r)
    );
    api.rpcMethodRegistry.set(PublicRPCRequestMethod.connect, (r) =>
      this.connect(r)
    );
    api.rpcMethodRegistry.set(PublicRPCRequestMethod.disconnect, (r) =>
      this.disconnect(r)
    );
  }
  async listSites(_: RPCRequest<any>) {
    const { sites } = await this.state.fetch();
    return { result: sites };
  }
  @PublicMethod()
  @WhitelistedMethod()
  async createSiteConnectionRequest(
    req: RPCRequest<void>
  ): Promise<RPCResponse<SiteConnectionStatus>> {
    const { connectionRequests, sites } = await this.state.fetch();
    const findExistingRequest = connectionRequests.find(
      (site) => site.origin === req.origin
    );
    if (findExistingRequest) {
      return { result: 'pending' };
    }
    const findExistingSite = sites.find((site) => site.origin === req.origin);
    if (findExistingSite) {
      return { result: 'connected' };
    }
    await this.state.fetchAndUpdate(async (state) => {
      state.connectionRequests.push({
        origin: req.origin,
      });
      return state;
    });
    return { result: 'created' };
  }
  async getSiteConnectionRequests() {
    const { connectionRequests } = await this.state.fetch();
    return { result: connectionRequests };
  }
  async approveSite(req: RPCRequest<Site>) {
    if (!req.data?.origin || !req.data?.allowedAccounts?.length) {
      return { error: 'origin and allowedAccounts are required properties' };
    }
    const { sites } = await this.state.fetch();
    if (sites.some((site) => site.origin === req.data.origin)) {
      return { error: 'site already connected' };
    }
    await this.state.fetchAndUpdate(async (state) => {
      state.sites.push(req.data);
      state.connectionRequests = state.connectionRequests.filter(
        (site) => site.origin !== req.data.origin
      );
      return state;
    });
    this.api.emit(APIEvents.connectionChanged);
    this.api.emit(APIEvents.update);
    return { result: true };
  }
  async deleteSite(req: RPCRequest<DeleteSiteRequest>) {
    await this.state.fetchAndUpdate(async (state) => {
      state.sites =
        state.sites.filter((site) => site.origin !== req.data.origin) || [];
      return state;
    });
    this.api.emit(APIEvents.connectionChanged);
    this.api.emit(APIEvents.update);
    return { result: true };
  }
  async denySite(req: RPCRequest<SiteConnectionRequest>) {
    await this.state.fetchAndUpdate(async (state) => {
      state.connectionRequests =
        state.connectionRequests.filter(
          (site) => site.origin !== req.data.origin
        ) || [];
      return state;
    });
    this.api.emit(APIEvents.connectionChanged);
    this.api.emit(APIEvents.update);
    return { result: true };
  }
  @PublicMethod()
  @WhitelistedMethod()
  async isConnected(req: RPCRequest<void>): Promise<RPCResponse<boolean>> {
    const { sites } = await this.state.fetch();
    const { selectedAccount } = await this.api.accounts.state.fetch();
    const site = sites.find((site) => site.origin === req.origin);
    const isSiteAndAccountConnected = site?.allowedAccounts.some(
      (allowedAccount) => {
        return allowedAccount === selectedAccount?.id;
      }
    );
    if (isSiteAndAccountConnected) {
      return { result: true };
    }
    return { result: false };
  }
  @PublicMethod()
  @WhitelistedMethod()
  async connect(req: RPCRequest<void>): Promise<RPCResponse<boolean>> {
    const siteConnectionReq = await this.createSiteConnectionRequest(req);
    if (siteConnectionReq.result !== 'connected') {
      await this.api.extension.openPopup({
        id: req.id,
        origin: req.origin,
        method: RPCRequestMethod.openPopup,
        data: { path: '/popup/connect' },
      });
      return { result: true };
    }
    return {
      error:
        'connection already exists, please disconnect and reconnect to amend connected accounts',
    };
  }
  @PublicMethod()
  async disconnect(req: RPCRequest<void>): Promise<RPCResponse<boolean>> {
    return await this.deleteSite({
      id: req.id,
      origin: req.origin,
      method: RPCRequestMethod.deleteSite,
      data: {
        origin: req.origin,
      },
    });
  }
}
