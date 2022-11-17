import {
  APIEvents,
  PublicRPCRequestMethod,
  RPCRequest,
  RPCResponse,
  Settings,
} from '@multiverse-wallet/multiverse';
import { API } from './api';
import { State } from './resource';

const defaultIpfsGateway = 'dweb.link';

export class SettingsResource {
  public state = new State<Settings>(SettingsResource.name, {
    ipfsGateway: defaultIpfsGateway,
  });
  constructor(private api: API) {
    api.rpcMethodRegistry.set(PublicRPCRequestMethod.getSettings, (r) =>
      this.getSettings()
    );
    api.rpcMethodRegistry.set(PublicRPCRequestMethod.updateSettings, (r) =>
      this.updateSettings(r)
    );
  }
  async getSettings(): Promise<RPCResponse<Settings>> {
    const settings = await this.state.fetch();
    return { result: settings };
  }
  async updateSettings(
    req: RPCRequest<Partial<Settings>>
  ): Promise<RPCResponse<Settings>> {
    const settings = await this.state.fetchAndUpdate(async (settings) => {
      return {
        ...settings,
        ...req.data,
      };
    });
    this.api.emit(APIEvents.update);
    return { result: settings };
  }
}
