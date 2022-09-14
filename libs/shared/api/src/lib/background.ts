import { EXTENSION_ORIGIN, RPCRequest } from "@multiverse-wallet/multiverse";
import { API } from "@multiverse-wallet/shared/api";

const IS_RUNNING_IN_CHROME_EXTENSION = !!chrome?.runtime;

export class Background {
  private api = new API();

  constructor() {
    if (IS_RUNNING_IN_CHROME_EXTENSION) {
      chrome?.runtime?.onConnect?.addListener((port: chrome.runtime.Port) => {
        console.log(
          `connection opened from ${port.sender?.origin}`,
        );
        port.onMessage.addListener(
          (req: RPCRequest<any>, port: chrome.runtime.Port) => {
            console.log(
              `received rpc request from ${port.sender?.origin}`,
              req
            );
            req.origin = port.sender?.origin!;
            try {
              this.api.call(req).then(({ result, error }) => {
                console.log(`sent rpc response to ${port.sender?.origin}`, {
                  id: req.id,
                  result,
                  error,
                });
                port.postMessage({ id: req.id, result, error });
              });
            } catch (e: any) {
              port.postMessage({
                id: req.id,
                result: undefined,
                error: e.message,
              });
            }
          }
        );
        let currentPort: chrome.runtime.Port | null = port;
        // Setup update notifications
        this.api.onUpdate(() => {
          currentPort?.postMessage({
            type: "MULTIVERSE_UPDATE",
            result: null,
            error: null,
          });
        });
        port.onDisconnect.addListener(() => {
          currentPort = null;
        });
      });
    } else {
      window?.addEventListener(
        "message",
        (event) => {
          if (event.source != window) {
            return;
          }
          if (event?.data?.type === "MULTIVERSE") {
            console.log(
              `received rpc request from window`,
              event?.data?.request
            );
            event.data.request.origin = EXTENSION_ORIGIN;
            try {
              this.api.call(event?.data?.request).then(({ result, error }) => {
                console.log(`sent rpc response to window`, {
                  id: event?.data?.request?.id,
                  result,
                  error,
                });
                window.dispatchEvent(
                  new CustomEvent(event?.data?.request?.id, {
                    detail: { result, error },
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
      // Setup update notifications
      this.api.onUpdate(() => {
        window.dispatchEvent(new CustomEvent("MULTIVERSE_UPDATE"));
      });
    }
  }
}
