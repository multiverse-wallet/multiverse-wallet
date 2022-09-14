/**
 * Randomizes the order of the items in a given array, returning
 * a new copy of the array.
 */
export function shuffleArray<T>(arr: T[]): T[] {
  const newArr = [...arr] as T[];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // Destructuring assignment FTW!
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}
