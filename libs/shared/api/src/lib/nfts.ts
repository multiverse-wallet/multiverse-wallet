import {
  CreateCollectionRequest,
  RPCRequest,
  RPCRequestMethod,
} from '@multiverse-wallet/multiverse';
import { API } from './api';
import { State } from './resource';
import { create } from 'ipfs-http-client';

export interface NFTState {
  collections: NFTCollection[];
}

export interface NFTCollection {
  nfTokenTaxon: number;
  name: string;
}

export class NFTResource {
  public state = new State<NFTState>(NFTResource.name, {
    collections: [],
  });
  constructor(private api: API) {
    api.rpcMethodRegistry.set(RPCRequestMethod.createCollection, (r) =>
      this.createCollection(r)
    );
    // api.rpcMethodRegistry.set(RPCRequestMethod.createNFToken, (r) =>
    //   this.createNFToken(r)
    // );
  }
  async createCollection(req: RPCRequest<CreateCollectionRequest>) {
    const newState = await this.state.fetchAndUpdate(async (state) => {
      return {
        ...state,
        collections: state.collections.concat({
          nfTokenTaxon: state.collections.length + 1,
          name: req.data.name,
        }),
      };
    });
    return { result: newState.collections[newState.collections.length - 1] };
  }
}
