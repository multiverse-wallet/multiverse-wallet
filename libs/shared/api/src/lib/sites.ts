import {
  RPCRequest,
  RPCRequestMethod,
  RPCResponse,
  Site,
  SiteConnectionRequest,
  DeleteSiteRequest,
  SiteConnectionStatus,
} from "@multiverse-wallet/multiverse";
import { API } from "./api";
import { Resource } from "./resource";

export interface SitesState {
  connectionRequests: SiteConnectionRequest[];
  sites: Site[];
}

export class SitesResource {
  public resource = new Resource<SitesState>(SitesResource.name, {
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
  }

  async listSites(_: RPCRequest<any>) {
    return { result: this.resource.state?.sites || [] };
  }

  async createSiteConnectionRequest(
    req: RPCRequest<void>
  ): Promise<RPCResponse<SiteConnectionStatus>> {
    this.resource.state!.connectionRequests =
      this.resource.state?.connectionRequests || [];
    const findExistingRequest = this.resource.state!.connectionRequests.find(
      (site) => site.origin === req.origin
    );
    if (!!findExistingRequest) {
      return { result: "pending" };
    }
    const findExistingSite = this.resource.state!.sites.find(
      (site) => site.origin === req.origin
    );
    if (!!findExistingSite) {
      return { result: "connected" };
    }
    if (!findExistingRequest) {
      this.resource.state!.connectionRequests.push({
        origin: req.origin,
      });
    }
    await this.resource.saveToStorage();
    return { result: "created" };
  }

  async getSiteConnectionRequests() {
    return { result: this.resource.state?.connectionRequests || [] };
  }

  async approveSite(req: RPCRequest<Site>) {
    if (!req.data?.origin || !req.data?.allowedAccounts?.length) {
      return { error: "origin and allowedAccounts are required properties" };
    }
    if (
      this.resource.state?.sites.some((site) => site.origin === req.data.origin)
    ) {
      return { error: "site already connected" };
    }
    this.resource.state!.sites.push(req.data);
    this.resource.state!.connectionRequests =
      this.resource.state!.connectionRequests.filter(
        (site) => site.origin !== req.data.origin
      );
    await this.resource.saveToStorage();
    this.api.notifyUpdate();
    return { result: true };
  }

  async deleteSite(req: RPCRequest<DeleteSiteRequest>) {
    this.resource.state!.sites =
      this.resource.state?.sites.filter(
        (site) => site.origin !== req.data.origin
      ) || [];
    await this.resource.saveToStorage();
    this.api.notifyUpdate();
    return { result: true };
  }

  async denySite(req: RPCRequest<SiteConnectionRequest>) {
    this.resource.state!.connectionRequests =
      this.resource.state?.connectionRequests.filter(
        (site) => site.origin !== req.data.origin
      ) || [];
    await this.resource.saveToStorage();
    this.api.notifyUpdate();
    return { result: true };
  }

  containsOrigin(origin: string) {
    return (
      this.resource.state?.sites?.some((site) => {
        return site.origin === origin;
      }) || false
    );
  }
}
