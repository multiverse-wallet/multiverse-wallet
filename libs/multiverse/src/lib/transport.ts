import { v4 as uuid } from "uuid";
import { RPCRequestMethod } from "./types";

export const EXTENSION_ORIGIN = "chrome-extension://meffidapinofigdlekbgllkbdfgnihgd";

export interface RPCRequest<T> {
  id: string;
  method: RPCRequestMethod;
  data: T;
  origin: string;
}

export interface RPCResponse<T> {
  result?: T;
  error?: string;
}

export const MULTIVERSE_EVENT_TYPE = "MULTIVERSE";

export interface RPCTransportOptions {
  timeoutMs: number;
}

export const defaultRPCTransportOptions: RPCTransportOptions = {
  timeoutMs: 10_000,
};

export interface ITransport {
  makeRPCCall<Req, Res>(
    request: Partial<RPCRequest<Req>>,
    options: RPCTransportOptions
  ): Promise<Res>;
  subscribe(eventName: string, cb: (data: any) => void): () => void;
}

export class WindowTransport implements ITransport {
  async makeRPCCall<Req, Res>(
    request: Partial<RPCRequest<Req>>,
    options: RPCTransportOptions = defaultRPCTransportOptions
  ): Promise<Res> {
    return new Promise((resolve, reject) => {
      request.id = request.id || uuid();
      let hasResolved = false;
      const handleResponse = (event: Event) => {
        hasResolved = true;
        const { result, error } = (event as CustomEvent).detail;
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
          type: "MULTIVERSE",
          request,
        },
        "*"
      );
      setTimeout(() => {
        if (hasResolved) return;
        reject(new Error("timed out waiting for a response"));
        window.removeEventListener(request.id!, handleResponse);
      }, options.timeoutMs);
    });
  }
  subscribe(eventName: string, cb: (data: any) => void): () => void {
    window.addEventListener(eventName, cb);
    return () => window.removeEventListener(eventName, cb);
  }
}

export class BrowserRuntimeTransport implements ITransport {
  private requests: { [x: string]: any } = {};
  private port = chrome?.runtime?.connect({ name: EXTENSION_ORIGIN });
  constructor() {
    this.port.onMessage.addListener(({ id, result, error }) => {
      if (!!id && !!this.requests[id]) {
        this.requests[id]?.resolve({ result, error });
        delete this.requests[id];
      }
    });
  }
  async makeRPCCall<Req, Res>(
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
            reject(error);
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
  subscribe(eventName: string, cb: (data: any) => void): () => void {
    const handler = (data: any) => {
      if (data.type === eventName) {
        cb(data);
      }
    };
    this.port.onMessage.addListener(handler);
    return () => this.port.onMessage.removeListener(handler);
  }
}
