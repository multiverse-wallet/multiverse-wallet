import { API } from "./api";
import { getFromStorage, setInStorage } from "./storage";

export class Resource<T> {
  public state?: T;
  constructor(
    public storageKey: string,
    public defaultState: T,
  ) {
    this.loadFromStorage();
  }
  async saveToStorage() {
    await setInStorage(this.storageKey, this.state);
  }
  async loadFromStorage() {
    console.log(`loading state from storage at key ${this.storageKey} for`, this);
    this.state = await getFromStorage<T>(this.storageKey).catch(
      () => {
        console.log(`no state found, initializing from default state for`, this);
        return this.defaultState
      }
    );
    await this.saveToStorage();
  }
}
