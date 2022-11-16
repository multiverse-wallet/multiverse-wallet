import { APIEvents, RPCRequestMethod } from '@multiverse-wallet/multiverse';
import { API } from './api';
import { State } from './resource';

export interface LogState {
  apiLogs: APILogEntry[];
}

export interface APILogEntry {
  date: number;
  method: string;
  origin: string;
}

export class LogResource {
  public state = new State<LogState>(LogResource.name, {
    apiLogs: [],
  });
  constructor(private api: API) {
    api.rpcMethodRegistry.set(RPCRequestMethod.clearApiLogs, (r) =>
      this.clearApiLogs()
    );
    api.rpcMethodRegistry.set(RPCRequestMethod.getApiLogs, (r) =>
      this.getApiLogs()
    );
  }
  async pushApiLogs(method: string, origin: string) {
    await this.state.fetchAndUpdate(async (state) => {
      // Push the new entry
      state.apiLogs.unshift({ date: Date.now(), method, origin });
      // Expire old entries
      state.apiLogs =
        state!.apiLogs.filter((entry) => {
          if (Date.now() > entry.date + 30 * 86_400_000) {
            // Filter out entries older than 30 days.
            return false;
          }
          return true;
        }) || [];
      // Restrict to 1000 entries.
      state.apiLogs = state.apiLogs.slice(0, 1000);
      return state;
    });
  }
  async clearApiLogs() {
    await this.state.fetchAndUpdate(async (state) => {
      state.apiLogs = [];
      return state;
    });
    this.api.emit(APIEvents.update);
    return { result: true };
  }
  async getApiLogs() {
    const { apiLogs } = await this.state.fetch();
    return { result: apiLogs };
  }
}
