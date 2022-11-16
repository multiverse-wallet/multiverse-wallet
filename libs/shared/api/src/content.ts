import {
  MULTIVERSE_EVENT,
  MULTIVERSE_RPC_REQUEST,
  MULTIVERSE_RPC_RESPONSE,
} from '@multiverse-wallet/multiverse';

const CONTENT_PORT_NAME = 'content';

class Content {
  private port: chrome.runtime.Port | undefined;
  constructor() {
    window?.addEventListener(
      'message',
      (event) => {
        if (event.source != window) {
          return;
        }
        switch (event?.data?.type) {
          case MULTIVERSE_RPC_REQUEST:
            console.log('content.js received rpc request', event?.data);
            if (!this.port) {
              this.connectPort();
            }
            this.port?.postMessage({
              type: MULTIVERSE_RPC_REQUEST,
              ...event?.data?.request,
              origin: window.location.origin,
            });
            break;
        }
      },
      false
    );
  }
  connectPort() {
    this.port = chrome?.runtime?.connect({ name: CONTENT_PORT_NAME });
    this.port.onMessage.addListener((message: any) => {
      switch (message?.type) {
        case MULTIVERSE_RPC_RESPONSE:
          console.log('content.js sent rpc response', message);
          window.dispatchEvent(
            new CustomEvent(message?.id || message?.type, {
              detail: message,
            })
          );
          break;
        case MULTIVERSE_EVENT:
          console.log('content.js sent event', message, window.origin);
          if (!message?.event?.allowedOrigins?.includes(window.origin)) {
            message.event.data = undefined;
          }
          window.dispatchEvent(
            new CustomEvent(message?.type, {
              detail: {
                ...message?.event,
              },
            })
          );
          break;
      }
    });
    this.port.onDisconnect.addListener(() => {
      this.connectPort();
    });
  }
}

new Content();
