import { shuffleArray } from './shuffle-array';

describe('shuffleArray()', () => {
  it('should shuffle the items in the given array, returning a new copy of the array', async () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const shuffledArr = shuffleArray(arr);

    // New copy of the array
    expect(shuffledArr).not.toEqual(arr);

    // It shouldn't still have items in the same order as before
    expect(arr.every((item, i) => item === shuffledArr[i])).toBe(false);
  });
});
