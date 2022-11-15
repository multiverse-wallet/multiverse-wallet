import {
  APIEvents,
  CreateNetworkRequest,
  DeleteNetworkRequest,
  Network,
  PublicRPCRequestMethod,
  RPCRequest,
  RPCRequestMethod,
  RPCResponse,
  SelectNetworkRequest,
  UpdateAccountRequest,
  UpdateNetworkRequest,
} from '@multiverse-wallet/multiverse';
import { API } from './api';
import { State } from './resource';
import { v4 as uuid } from 'uuid';
import { PublicMethod } from './decorators';

export interface NetworksState {
  selectedNetwork: Network;
  networks: Network[];
}

export class NetworksResource {
  public state = new State<NetworksState>(NetworksResource.name, {
    selectedNetwork: {
      id: '1',
      name: 'mainnet',
      server: 'wss://s1.ripple.com',
    },
    networks: [
      {
        id: '1',
        name: 'mainnet',
        server: 'wss://s1.ripple.com',
      },
      {
        id: '2',
        name: 'testnet',
        server: 'wss://s.altnet.rippletest.net',
      },
      {
        id: '3',
        name: 'devnet',
        server: 'wss://s.devnet.rippletest.net',
      },
    ],
  });
  constructor(private api: API) {
    api.rpcMethodRegistry.set('listNetworks', (r) => this.listNetworks(r));
    api.rpcMethodRegistry.set(RPCRequestMethod.getSelectedNetwork, (r) =>
      this.getSelectedNetwork(r)
    );
    api.rpcMethodRegistry.set(RPCRequestMethod.selectNetwork, (r) =>
      this.selectNetwork(r)
    );
    api.rpcMethodRegistry.set(RPCRequestMethod.createNetwork, (r) =>
      this.createNetwork(r)
    );
    api.rpcMethodRegistry.set(RPCRequestMethod.updateNetwork, (r) =>
      this.updateNetwork(r)
    );
    api.rpcMethodRegistry.set(RPCRequestMethod.deleteNetwork, (r) =>
      this.deleteNetwork(r)
    );
    api.rpcMethodRegistry.set(PublicRPCRequestMethod.getNetwork, (r) =>
      this.getNetwork(r)
    );
  }
  async listNetworks(req: RPCRequest<void>) {
    const { networks } = await this.state.fetch();
    return { result: networks };
  }
  async getSelectedNetwork(req: RPCRequest<void>) {
    const { selectedNetwork } = await this.state.fetch();
    return { result: selectedNetwork };
  }
  async createNetwork(req: RPCRequest<CreateNetworkRequest>) {
    const newNetwork = {
      ...req.data,
      id: uuid(),
    };
    await this.state.fetchAndUpdate(async (state) => {
      state.networks.push(newNetwork);
      return state;
    });
    this.api.emit(APIEvents.update);
    return { result: newNetwork };
  }
  async updateNetwork(req: RPCRequest<UpdateNetworkRequest>) {
    await this.state.fetchAndUpdate(async (state) => {
      state.networks = state.networks.map((net) => {
        if (net.id === req.data.id) {
          return {
            ...net,
            ...req.data.network,
          };
        }
        return net;
      });
      return state;
    });
    this.api.emit(APIEvents.update);
    return { result: true };
  }
  async deleteNetwork(req: RPCRequest<DeleteNetworkRequest>) {
    await this.state.fetchAndUpdate(async (state) => {
      state.networks = state.networks.filter(
        (network) => network.id !== req.data.id
      );
      return state;
    });
    this.api.emit(APIEvents.update);
    return { result: true };
  }
  async selectNetwork(req: RPCRequest<SelectNetworkRequest>) {
    const { selectedNetwork } = await this.state.fetchAndUpdate(
      async (state) => {
        state.selectedNetwork = state.networks.find(
          (network) => network.id == req.data.id
        )!;
        return state;
      }
    );
    this.api.emit(APIEvents.update);
    this.api.emit(APIEvents.networkChanged, selectedNetwork);
    return { result: selectedNetwork };
  }
  @PublicMethod()
  async getNetwork(
    req: RPCRequest<void>
  ): Promise<RPCResponse<Network | undefined>> {
    const { selectedNetwork } = await this.state.fetch();
    return { result: selectedNetwork };
  }
}
