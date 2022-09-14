const CONTENT_PORT_NAME = "content";

class Content {
  constructor() {
    let port = chrome?.runtime?.connect({ name: CONTENT_PORT_NAME });
    port?.onDisconnect.addListener(() => {
      port = chrome?.runtime?.connect({ name: CONTENT_PORT_NAME });
    });
    port?.onMessage?.addListener((detail: any) => {
      window.dispatchEvent(
        new CustomEvent(detail?.id || detail?.type, {
          detail,
        })
      );
    });
    window?.addEventListener(
      "message",
      (event) => {
        if (event.source != window) {
          return;
        }
        if (event?.data?.type === "MULTIVERSE") {
          port?.postMessage({
            ...event?.data?.request,
            origin: window.location.origin,
          });
        }
      },
      false
    );
  }
}

new Content();
