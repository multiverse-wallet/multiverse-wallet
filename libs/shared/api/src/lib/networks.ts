import {
  CreateNetworkRequest,
  DeleteNetworkRequest,
  Network,
  RPCRequest,
  RPCRequestMethod,
  SelectNetworkRequest,
  UpdateAccountRequest,
  UpdateNetworkRequest,
} from "@multiverse-wallet/multiverse";
import { API } from "./api";
import { Resource } from "./resource";
import { v4 as uuid } from "uuid";

export interface NetworksState {
  selectedNetwork: Network;
  networks: Network[];
}

export class NetworksResource {
  public resource = new Resource<NetworksState>(NetworksResource.name, {
    selectedNetwork: {
      id: "1",
      name: "mainnet",
      server: "wss://s1.ripple.com",
    },
    networks: [
      {
        id: "1",
        name: "mainnet",
        server: "wss://s1.ripple.com",
      },
      {
        id: "2",
        name: "testnet",
        server: "wss://s.altnet.rippletest.net",
      },
      {
        id: "3",
        name: "devnet",
        server: "wss://s.devnet.rippletest.net",
      },
    ],
  });
  constructor(private api: API) {
    api.rpcMethodRegistry.set("listNetworks", (r) => this.listNetworks(r));
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
  }
  async listNetworks(req: RPCRequest<void>) {
    return { result: this.resource.state?.networks || [] };
  }
  async getSelectedNetwork(req: RPCRequest<void>) {
    return { result: this.resource.state?.selectedNetwork };
  }
  async createNetwork(req: RPCRequest<CreateNetworkRequest>) {
    const newNetwork = {
      ...req.data,
      id: uuid(),
    };
    this.resource.state?.networks.push(newNetwork);
    await this.resource.saveToStorage();
    this.api.notifyUpdate();
    return { result: newNetwork };
  }
  async updateNetwork(req: RPCRequest<UpdateNetworkRequest>) {
    this.resource.state!.networks = this.resource.state!.networks.map((net) => {
      if (net.id === req.data.id) {
        return {
          ...net,
          ...req.data.network,
        };
      }
      return net;
    });
    await this.resource.saveToStorage();
    this.api.notifyUpdate();
    return { result: true };
  }
  async deleteNetwork(req: RPCRequest<DeleteNetworkRequest>) {
    this.resource.state!.networks = this.resource.state!.networks.filter(
      (network) => network.id !== req.data.id
    );
    await this.resource.saveToStorage();
    this.api.notifyUpdate();
    return { result: true };
  }
  async selectNetwork(req: RPCRequest<SelectNetworkRequest>) {
    this.resource.state!.selectedNetwork = this.resource.state?.networks.find(
      (network) => network.id == req.data.id
    )!;
    await this.resource.saveToStorage();
    this.api.notifyUpdate();
    return { result: this.resource.state?.selectedNetwork };
  }
}
