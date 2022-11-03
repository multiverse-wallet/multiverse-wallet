import { delay } from './delay';

describe('delay()', () => {
  beforeEach(() => {
    jest.useFakeTimers('legacy');
  });

  it('should resolve after the given number of milliseconds have elapsed', async () => {
    const delayInMs = 1000;
    const thenHandler = jest.fn();
    const catchHandler = jest.fn();

    const promise = delay(delayInMs);
    promise.then(thenHandler);
    promise.catch(catchHandler);

    expect(setTimeout).toHaveBeenCalledTimes(1);

    // None of the timeout time elapsed yet
    expect(thenHandler).toHaveBeenCalledTimes(0);
    expect(catchHandler).toHaveBeenCalledTimes(0);

    // Workaround for Jest not being able to support fake timers and Promises properly: https://stackoverflow.com/a/51132058
    Promise.resolve().then(() => jest.advanceTimersByTime(delayInMs));

    await promise;

    // Full timeout time elapsed, should resolve and not reject
    expect(thenHandler).toHaveBeenCalledTimes(1);
    expect(catchHandler).toHaveBeenCalledTimes(0);
  });
});
