/**
 * To help with developing the apps we want to be able to serve them to ourselves like
 * any other react apps.
 *
 * The way in which navigate between the popup app and home app is different depending
 * on whether or not we are running in the browser or running within the context of the
 * chrome extension.
 */
const IS_RUNNING_IN_CHROME_EXTENSION = !!window.chrome?.storage;

export function navigateExtension(path: string) {
  const url = `/index.html#${path}`;
  if (IS_RUNNING_IN_CHROME_EXTENSION) {
    chrome.tabs.create({
      url: `/index.html#${path}`,
    });
    return;
  }
  window.location.href = url;
}
