/**
 * To help with developing the apps we want to be able to serve them to ourselves like
 * any other react apps.
 *
 * In this context the relevant chrome extension storage APIs will not be available,
 * but we can make use of localStorage as a close approximation.
 */
const IS_RUNNING_IN_CHROME_EXTENSION = Boolean(chrome?.storage);

export async function getFromStorage<T>(key: string): Promise<T> {
  if (!IS_RUNNING_IN_CHROME_EXTENSION) {
    const data = localStorage.getItem(key);
    if (!data) {
      throw new Error('Not found');
    }
    return JSON.parse(data);
  }
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, (result) => {
      const data = result[key];
      if (!data) {
        return reject(new Error('Not found'));
      }
      return resolve(data);
    });
  });
}

export async function setInStorage<T>(key: string, value: T): Promise<void> {
  if (!IS_RUNNING_IN_CHROME_EXTENSION) {
    localStorage.setItem(key, JSON.stringify(value));
    return;
  }
  return new Promise((resolve) => {
    chrome.storage.local.set({ [key]: value }, resolve);
  });
}

export async function deleteInStorage(key: string): Promise<void> {
  if (!IS_RUNNING_IN_CHROME_EXTENSION) {
    localStorage.removeItem(key);
    return;
  }
  return new Promise((resolve) => {
    chrome.storage.local.remove(key, resolve);
  });
}
