import { API } from './api';
import { State } from './resource';
import { Wallet } from 'xrpl';
import { Vault } from './vault';
import { v4 as uuid } from 'uuid';
import {
  Account,
  APIEvents,
  CreateAccountRequest,
  DeleteAccountRequest,
  PublicRPCRequestMethod,
  RPCRequest,
  RPCRequestMethod,
  RPCResponse,
  SelectAccountRequest,
  UpdateAccountRequest,
} from '@multiverse-wallet/multiverse';
import { PublicMethod } from './decorators';

export interface AccountsState {
  selectedAccount?: Account;
  accounts: Account[];
  derivationPathIndex: number;
}

export class AccountsResource {
  public state = new State<AccountsState>(AccountsResource.name, {
    selectedAccount: undefined,
    accounts: [],
    derivationPathIndex: 0,
  });
  constructor(private api: API, private vault: Vault) {
    api.rpcMethodRegistry.set(RPCRequestMethod.listAccounts, (r) =>
      this.listAccounts(r)
    );
    api.rpcMethodRegistry.set(RPCRequestMethod.getSelectedAccount, (r) =>
      this.getSelectedAccount(r)
    );
    api.rpcMethodRegistry.set(RPCRequestMethod.selectAccount, (r) =>
      this.selectAccount(r)
    );
    api.rpcMethodRegistry.set(RPCRequestMethod.createAccount, (r) =>
      this.createAccount(r)
    );
    api.rpcMethodRegistry.set(RPCRequestMethod.updateAccount, (r) =>
      this.updateAccount(r)
    );
    api.rpcMethodRegistry.set(RPCRequestMethod.deleteAccount, (r) =>
      this.deleteAccount(r)
    );
    api.rpcMethodRegistry.set(PublicRPCRequestMethod.getAccount, (r) =>
      this.getAccount(r)
    );
  }
  async getCurrentWallet(): Promise<Wallet> {
    const { selectedAccount } = await this.state.fetch();
    const { decryptedSecretRecoveryPhrase } = this.api.vault;
    if (!decryptedSecretRecoveryPhrase) {
      throw new Error('wallet should be locked!');
    }
    if (selectedAccount?.derivationPath) {
      return Wallet.fromMnemonic(decryptedSecretRecoveryPhrase, {
        derivationPath: selectedAccount?.derivationPath,
      });
    }
    if (selectedAccount?.encryptedSecret) {
      const secret = await this.vault.decryptSecret(
        selectedAccount.encryptedSecret
      );
      return Wallet.fromSecret(secret);
    }
    throw new Error('unable to instantiate Wallet');
  }
  async listAccounts(req: RPCRequest<void>) {
    const { accounts } = await this.state.fetch();
    return { result: accounts };
  }
  async getSelectedAccount(req: RPCRequest<void>) {
    const { selectedAccount } = await this.state.fetch();
    return { result: selectedAccount };
  }
  async selectAccount(req: RPCRequest<SelectAccountRequest>) {
    await this.state.fetchAndUpdate(async (state) => {
      state.selectedAccount = state.accounts.find(
        (account) => account.id == req.data.id
      );
      return state;
    });
    const { selectedAccount } = await this.state.fetch();
    this.api.emit(APIEvents.update);
    this.api.emit(APIEvents.accountChanged, selectedAccount);
    return { result: selectedAccount };
  }
  async createAccount(req: RPCRequest<CreateAccountRequest>) {
    const { decryptedSecretRecoveryPhrase } = this.vault;
    if (!decryptedSecretRecoveryPhrase) {
      throw new Error('wallet locked!');
    }
    const newAccountId = uuid();
    if (req.data.derivationPath) {
      const wallet = Wallet.fromMnemonic(decryptedSecretRecoveryPhrase, {
        derivationPath: req.data.derivationPath,
      });
      await this.state.fetchAndUpdate(async (state) => {
        state.accounts.push({
          id: newAccountId,
          name: req.data.name,
          address: wallet.classicAddress,
          derivationPath: req.data.derivationPath,
        });
        return state;
      });
    } else if (req.data.secret) {
      const encryptedSecret = await this.vault.encryptSecret(req.data.secret);
      const wallet = Wallet.fromSecret(req.data.secret);
      await this.state.fetchAndUpdate(async (state) => {
        state.accounts.push({
          id: newAccountId,
          name: req.data.name,
          address: wallet.classicAddress,
          encryptedSecret,
        });
        return state;
      });
    } else {
      await this.state.fetchAndUpdate(async (state) => {
        const { derivationPathIndex } = state;
        const derivationPath = derivationPathFromIndex(derivationPathIndex);
        state.derivationPathIndex = derivationPathIndex + 1;
        const wallet = Wallet.fromMnemonic(decryptedSecretRecoveryPhrase, {
          derivationPath,
        });
        state.accounts.push({
          id: newAccountId,
          name: req.data.name,
          address: wallet.classicAddress,
          derivationPath,
        });
        return state;
      });
    }
    this.api.emit(APIEvents.update);
    return { result: newAccountId };
  }
  async updateAccount(req: RPCRequest<UpdateAccountRequest>) {
    await this.state.fetchAndUpdate(async (state: AccountsState) => {
      return {
        ...state,
        accounts: state.accounts.map((account) => {
          if (account.id === req.data.id) {
            account.name = req.data.account.name!;
          }
          return account;
        }),
      };
    });
    this.api.emit(APIEvents.update);
    return { result: true };
  }
  async deleteAccount(req: RPCRequest<DeleteAccountRequest>) {
    await this.state.fetchAndUpdate(async (state) => {
      return {
        ...state,
        accounts: state.accounts.filter(
          (account) => account.id !== req.data.id
        ),
      };
    });
    this.api.emit(APIEvents.update);
    return { result: true };
  }
  @PublicMethod()
  async getAccount(
    req: RPCRequest<void>
  ): Promise<RPCResponse<Account | undefined>> {
    const { selectedAccount } = await this.state.fetch();
    return { result: selectedAccount };
  }
  async getAllowedOrigins() {
    const { sites } = await this.api.sites.state.fetch();
    const { selectedAccount } = await this.state.fetch();
    return sites
      .filter((site) => site.allowedAccounts.includes(selectedAccount!.id))
      .map((site) => site.origin);
  }
}

function derivationPathFromIndex(index: number) {
  return `m/44'/144'/0'/0'/${index}`;
}
