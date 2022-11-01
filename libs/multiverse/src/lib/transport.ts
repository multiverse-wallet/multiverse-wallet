import { EventEmitter } from "events";
import { v4 as uuid } from "uuid";
import {
  MULTIVERSE_EVENT,
  MULTIVERSE_RPC_REQUEST,
  MULTIVERSE_RPC_RESPONSE,
  PublicRPCRequestMethod,
} from "./types";

export interface RPCRequest<T> {
  id: string;
  method: string;
  data: T;
  origin: string;
}

export interface RPCResponse<T> {
  result?: T;
  error?: string;
}

export interface RPCTransportOptions {
  timeoutMs: number;
}

export const defaultRPCTransportOptions: RPCTransportOptions = {
  timeoutMs: 10_000,
};

export interface ITransport extends EventEmitter {
  makeRPC<Req, Res>(
    request: Partial<RPCRequest<Req>>,
    options: RPCTransportOptions
  ): Promise<Res>;
}

export class WindowTransport extends EventEmitter implements ITransport {
  constructor() {
    super();
    if (typeof window !== "undefined") {
      window.addEventListener(MULTIVERSE_EVENT, (event: any) => {
        this.emit(event.detail.type, event.detail.data);
      });
    }
  }
  async makeRPC<Req, Res>(
    request: Partial<RPCRequest<Req>>,
    options: RPCTransportOptions = defaultRPCTransportOptions
  ): Promise<Res> {
    return new Promise((resolve, reject) => {
      request.id = request.id || uuid();
      let hasResolved = false;
      const handleResponse = (event: Event) => {
        console.log("window transport received", event);
        hasResolved = true;
        const { type, result, error } = (event as CustomEvent).detail;
        switch (type) {
          case MULTIVERSE_RPC_RESPONSE:
            if (error) {
              reject(new Error(error));
            } else {
              resolve(result);
            }
            window.removeEventListener(request.id!, handleResponse);
            break;
        }
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
        window.removeEventListener(request.id!, handleResponse);
      };
      window.addEventListener(request.id, handleResponse);
      window.postMessage(
        {
          type: MULTIVERSE_RPC_REQUEST,
          request,
        },
        undefined
      );
      setTimeout(() => {
        if (hasResolved) return;
        reject(new Error("timed out waiting for a response"));
        window.removeEventListener(request.id!, handleResponse);
      }, options.timeoutMs);
    });
  }
}

export class BrowserRuntimeTransport
  extends EventEmitter
  implements ITransport
{
  private requests: { [x: string]: any } = {};
  private port = chrome?.runtime?.connect({ name: "browser" });
  constructor() {
    super();
    this.port.onMessage.addListener((message: any) => {
      console.log("browser transport received", message);
      const { type, id, result, error, event } = message;
      switch (type) {
        case MULTIVERSE_EVENT:
          this.emit(event?.type, event);
          break;
        case MULTIVERSE_RPC_RESPONSE:
          if (!!id && !!this.requests[id]) {
            this.requests[id]?.resolve({ result, error });
            delete this.requests[id];
          }
          break;
      }
    });
    this.port.onDisconnect.addListener(() => {
      this.port = chrome?.runtime?.connect();
    });
  }
  async makeRPC<Req, Res>(
    request: Partial<RPCRequest<Req>>,
    options: RPCTransportOptions = defaultRPCTransportOptions
  ): Promise<Res> {
    request.id = request.id || uuid();
    let hasResolved = false;
    const p = new Promise<Res>((resolve, reject) => {
      this.requests[request.id!] = {
        resolve: ({ result, error }: any) => {
          hasResolved = true;
          if (error) {
            reject(new Error(error));
          } else {
            resolve(result);
          }
        },
        reject,
      };
    });
    this.port?.postMessage(request);
    setTimeout(() => {
      if (hasResolved) return;
      this.requests[request.id!]?.reject(
        new Error("timed out waiting for a response")
      );
    }, options.timeoutMs);
    return p;
  }
}
