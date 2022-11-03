import {
  APIEvents,
  MULTIVERSE_EVENT,
  MULTIVERSE_RPC_REQUEST,
  MULTIVERSE_RPC_RESPONSE,
  RPCRequest,
} from "@multiverse-wallet/multiverse";
import { API, EXTENSION_ORIGIN } from "./api";

const IS_RUNNING_IN_CHROME_EXTENSION = !!chrome?.runtime;

export class Background {
  private api = new API();
  constructor() {
    if (IS_RUNNING_IN_CHROME_EXTENSION) {
      chrome?.runtime?.onConnect?.addListener((port: chrome.runtime.Port) => {
        port.onMessage.addListener(
          (req: RPCRequest<any>, port: chrome.runtime.Port) => {
            console.log(
              `background received rpc request from ${port.sender?.origin}`,
              req
            );
            req.origin = port.sender?.origin as string;
            try {
              this.api.call(req).then(({ result, error }) => {
                console.log(
                  `background sent rpc response to ${port.sender?.origin}`,
                  {
                    id: req.id,
                    result,
                    error,
                  }
                );
                port.postMessage({
                  type: MULTIVERSE_RPC_RESPONSE,
                  id: req.id,
                  result,
                  error,
                });
              });
            } catch (e: any) {
              port.postMessage({
                type: MULTIVERSE_RPC_RESPONSE,
                id: req.id,
                result: undefined,
                error: e.message,
              });
            }
          }
        );
        let currentPort: chrome.runtime.Port | undefined = port;
        registerPortEventListeners(this.api, (event) =>
          currentPort?.postMessage(event)
        );
        port.onDisconnect.addListener(() => {
          currentPort = undefined;
        });
      });
    } else {
      window?.addEventListener(
        "message",
        (event) => {
          if (event.source != window) {
            return;
          }
          if (event?.data?.type === MULTIVERSE_RPC_REQUEST) {
            console.log(`received rpc request from window`, event);
            event.data.request.origin = EXTENSION_ORIGIN;
            try {
              this.api.call(event?.data?.request).then((response) => {
                console.log(`sent rpc response to window`, {
                  id: event?.data?.request?.id,
                  response,
                });
                window.dispatchEvent(
                  new CustomEvent(event?.data?.request?.id, {
                    detail: response,
                  })
                );
              });
            } catch (e: any) {
              window.dispatchEvent(
                new CustomEvent(event?.data?.request?.id, {
                  detail: { result: undefined, error: e.message },
                })
              );
            }
          }
        },
        false
      );
      registerWindowEventListeners(this.api);
    }
  }
}

function registerWindowEventListeners(api: API) {
  Object.values(APIEvents).forEach((apiEventName) => {
    api.on(apiEventName, () => {
      window.dispatchEvent(
        new CustomEvent(MULTIVERSE_EVENT, {
          detail: {
            type: apiEventName,
          },
        })
      );
    });
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function registerPortEventListeners(api: API, cb: (event: any) => void) {
  Object.values(APIEvents).forEach((apiEventName) => {
    api.on(apiEventName, (data, allowedOrigins) => {
      cb({
        type: MULTIVERSE_EVENT,
        event: {
          type: apiEventName,
          data,
          allowedOrigins,
        },
      });
    });
  });
}
