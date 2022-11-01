import { getFromStorage, setInStorage } from "./storage";

export class State<T> {
  constructor(public storageKey: string, public defaultState: T) {}
  async save(state: T): Promise<T> {
    await setInStorage(this.storageKey, state);
    return state
  }
  async fetch(): Promise<T> {
    return await getFromStorage<T>(this.storageKey).catch(() => {
      return this.defaultState;
    });
  }
  async fetchAndUpdate(updateFn: (t: T) => Promise<T>) {
    const existing = await this.fetch();
    const updated = await updateFn(existing);
    return await this.save(updated);
  }
}
