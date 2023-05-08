import {
  APIEvents,
  CreateNFTokenRequest,
  DeleteNFTokenRequest,
  NFT,
  RPCRequest,
  RPCRequestMethod,
} from '@multiverse-wallet/multiverse';
import { API } from './api';
import { State } from './resource';
import { v4 as uuid } from 'uuid';

export interface NFTState {
  nfts: NFT[];
}

export class NFTResource {
  public state = new State<NFTState>(NFTResource.name, {
    nfts: [],
  });
  constructor(private api: API) {
    api.rpcMethodRegistry.set(RPCRequestMethod.createNFToken, (r) =>
      this.createNFToken(r)
    );
    api.rpcMethodRegistry.set(RPCRequestMethod.deleteNFToken, (r) =>
      this.deleteNFToken(r)
    );
    api.rpcMethodRegistry.set(RPCRequestMethod.listNFTokens, () =>
      this.listNFTokens()
    );
  }
  async createNFToken(req: RPCRequest<CreateNFTokenRequest>) {
    const id = uuid();
    const token = {
      ...req.data,
      id,
      minted: false,
    };
    await this.state.fetchAndUpdate(async (state) => {
      state.nfts.push(token);
      return state;
    });
    this.api.emit(APIEvents.update);
    return { result: token };
  }
  async deleteNFToken(req: RPCRequest<DeleteNFTokenRequest>) {
    await this.state.fetchAndUpdate(async (state) => {
      state.nfts = state.nfts.filter((n) => n.id !== req.data.id);
      return state;
    });
    this.api.emit(APIEvents.update);
    return { result: true };
  }
  async listNFTokens() {
    const { nfts } = await this.state.fetch();
    return { result: nfts };
  }
}
