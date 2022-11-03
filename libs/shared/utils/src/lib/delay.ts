/**
 * Simple utility to wrap setTimeout with a Promise so that we can do:
 *
 * ```ts
 * await delay(1000);
 * ```
 *
 * in async functions, for example.
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}
