import { EventEmitter } from 'events';
import { Vault } from './vault';
import { AccountsResource } from './accounts';
import { NetworksResource } from './networks';
import { SitesResource } from './sites';
import {
  RPCRequest,
  RPCRequestMethod,
  RPCResponse,
} from '@multiverse-wallet/multiverse';
import {
  isPublicMethod,
  isWhitelistedMethod,
  PublicMethod,
  WhitelistedMethod,
} from './decorators';
import { LogResource } from './log';
import { TransactionsResource } from './transactions';
import { SettingsResource } from './settings';

export const EXTENSION_ORIGIN = `chrome-extension://${
  chrome?.runtime?.id || ''
}`;

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
  public log = new LogResource(this);
  public transactions = new TransactionsResource(this);
  public settings = new SettingsResource(this);

  constructor() {
    super();
    this.rpcMethodRegistry.set('ping', this.ping);
  }

  override emit(
    eventName: string | symbol,
    data?: any,
    filterAllowedOrigins?: string[]
  ) {
    this.accounts.getAllowedOrigins().then((allowedOrigins: string[]) => {
      if (filterAllowedOrigins) {
        allowedOrigins = allowedOrigins.filter((o) =>
          filterAllowedOrigins.includes(o)
        );
      }
      super.emit(eventName, data, allowedOrigins);
    });
    return true;
  }

  async call(req: RPCRequest<any>): Promise<RPCResponse<any>> {
    const rpcMethod = this.rpcMethodRegistry.get(req.method);
    if (!rpcMethod) {
      return {
        error: `method ${req.method} not implemented`,
      };
    }
    if (
      chrome.runtime &&
      req.origin !== EXTENSION_ORIGIN &&
      !isPublicMethod(req.method)
    ) {
      return {
        error: `method ${req.method} not public`,
      };
    }
    if (isWhitelistedMethod(req.method)) {
      return rpcMethod(req);
    }
    if (!(await this.checkPermissions(req))) {
      return {
        error: `site with origin ${req.origin} calling ${req.method} has insufficient permissions, please reconnect and request further permissions (id:${req.id})`,
      };
    }
    if (req.origin !== EXTENSION_ORIGIN) {
      await this.log.pushApiLogs(req.method, req.origin);
    }
    return rpcMethod(req);
  }

  @PublicMethod()
  @WhitelistedMethod()
  async ping(): Promise<RPCResponse<boolean>> {
    return { result: true };
  }

  async checkPermissions(req: RPCRequest<any>): Promise<boolean> {
    if (req.origin === EXTENSION_ORIGIN) {
      // Allow all requests from the extension.
      return true;
    }
    const allowedOrigins = await this.accounts.getAllowedOrigins()!;
    // Check there is an entry for the origin and method.
    return allowedOrigins.includes(req.origin);
  }
}

export interface OpenPopupRequest {
  path: string;
  height?: number;
  width?: number;
}

export class ExtensionAPI {
  constructor(private api: API) {
    api.rpcMethodRegistry.set(RPCRequestMethod.openPopup, (r) =>
      this.openPopup(r)
    );
    api.rpcMethodRegistry.set(RPCRequestMethod.closePopup, () =>
      this.closePopup()
    );
  }
  async openPopup(
    req: RPCRequest<OpenPopupRequest>
  ): Promise<RPCResponse<boolean>> {
    await chrome.windows.create({
      type: 'popup',
      url: `index.html/#${req.data.path}?requestId=${req.id}`,
      height: req.data.height || 600,
      width: req.data.width || 400,
    });
    return { result: true };
  }
  async closePopup() {
    if (chrome.windows) {
      const currentWindow = await chrome.windows.getCurrent();
      if (currentWindow.type === 'popup') {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        chrome.windows.remove(currentWindow.id!);
        return { result: true };
      }
    }
    return { result: false };
  }
}
