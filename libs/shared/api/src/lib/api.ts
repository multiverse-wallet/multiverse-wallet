import { EventEmitter } from "events";
import { Vault } from "./vault";
import { AccountsResource } from "./accounts";
import { NetworksResource } from "./networks";
import { SitesResource } from "./sites";
import { EXTENSION_ORIGIN, RPCRequest, RPCResponse } from "@multiverse-wallet/multiverse";
import { ExtensionOriginOnly } from "./decorators";

export const MULTIVERSE_EVENT_TYPE = "MULTIVERSE";

export class API extends EventEmitter {
  public rpcMethodRegistry = new Map<
    string,
    (req: RPCRequest<any>) => Promise<RPCResponse<any>>
  >();
  public vault = new Vault(this);
  public accounts = new AccountsResource(this, this.vault);
  public sites = new SitesResource(this);
  public networks = new NetworksResource(this);
  public extension = new ExtensionAPI(this);

  constructor() {
    super();
    this.rpcMethodRegistry.set("ping", this.ping);
  }

  async call(req: RPCRequest<any>): Promise<RPCResponse<any>> {
    const rpcMethod = this.rpcMethodRegistry.get(req.method);
    if (!rpcMethod) {
      return {
        error: `method ${req.method} not implemented`,
      };
    }
    if (!this.checkPermissions(req)) {
      return {
        error: `site with origin ${req.origin} calling ${req.method} has insufficient permissions, please reconnect and request further permissions (id:${req.id})`,
      };
    }
    return rpcMethod(req);
  }

  async ping(): Promise<RPCResponse<boolean>> {
    return { result: true };
  }

  checkPermissions(req: RPCRequest<any>): boolean {
    // Contains a whitelist of methods to allow prior to
    // connecting the site, i.e. the required methods
    // that need to be called to allow a request.
    const whitelistedMethods = [
      "ping",
      "createSiteConnectionRequest",
      "openPopup",
    ];
    if (whitelistedMethods.includes(req.method)) {
      return true;
    }
    if (req.origin === EXTENSION_ORIGIN) {
      // Allow all requests from the extension.
      return true;
    }
    // Check there is an entry for the origin and method.
    return this.sites.containsOrigin(req.origin);
  }

  notifyUpdate() {
    this.emit("update");
  }

  onUpdate(cb: () => void) {
    this.on("update", () => cb());
  }
}

export interface OpenPopupRequest {
  path: string;
  height?: number;
  width?: number;
}

export class ExtensionAPI {
  constructor(private api: API) {
    api.rpcMethodRegistry.set("openPopup", (r) => this.openPopup(r));
  }
  async openPopup(
    req: RPCRequest<OpenPopupRequest>
  ): Promise<RPCResponse<boolean>> {
    chrome.windows
      .create({
        type: "popup",
        url: `index.html/#${req.data.path}?requestId=${req.id}`,
        height: req.data.height || 600,
        width: req.data.width || 500,
      })
      .then((window: any) => {
      });
    return { result: true };
  }
}
