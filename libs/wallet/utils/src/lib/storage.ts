/**
 * To help with developing the apps we want to be able to serve them to ourselves like
 * any other react apps.
 *
 * In this context the relevant browser extension storage APIs will not be available,
 * but we can make use of localStorage as a close approximation.
 */
const IS_RUNNING_IN_CHROME_EXTENSION = !!window.chrome?.storage;

export async function getFromStorage(key: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!IS_RUNNING_IN_CHROME_EXTENSION) {
      const data = localStorage.getItem(key);
      if (!data) {
        return reject('Not found');
      }
      return resolve(data);
    }

    chrome.storage.local.get([key], (result) => {
      const data = result[key];
      if (!data) {
        return reject('Not found');
      }
      return resolve(data);
    });
  });
}

export async function setInStorage(key: string, value: string): Promise<void> {
  return new Promise((resolve) => {
    if (!IS_RUNNING_IN_CHROME_EXTENSION) {
      localStorage.setItem(key, value);
      return resolve();
    }

    chrome.storage.local.set({ [key]: value }, () => {
      return resolve();
    });
  });
}

export async function deleteInStorage(key: string): Promise<void> {
  return new Promise((resolve) => {
    if (!IS_RUNNING_IN_CHROME_EXTENSION) {
      localStorage.removeItem(key);
      return resolve();
    }

    chrome.storage.local.remove(key, () => {
      return resolve();
    });
  });
}
