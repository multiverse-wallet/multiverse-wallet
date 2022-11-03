/**
 * To help with developing the apps we want to be able to serve them to ourselves like
 * any other react apps.
 *
 * In this context the relevant browser extension storage APIs will not be available,
 * but we can make use of localStorage as a close approximation.
 */
const IS_RUNNING_IN_CHROME_EXTENSION = !!window.chrome?.tabs;

type MessagePayload =
  | {
      type: 'getSmartContractTransactionPayloadJsonString';
    }
  | {
      type: 'batchListBytesReady';
      data: any;
    }
  | {
      type: 'selectedIdentityChange';
      data: {
        address: string;
        displayName: string;
      };
    };

export async function sendMessageToCurrentTab(
  messagePayload: MessagePayload
): Promise<any> {
  return new Promise((resolve) => {
    if (!IS_RUNNING_IN_CHROME_EXTENSION) {
      return resolve(undefined);
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id!, messagePayload, resolve);
    });
  });
}
