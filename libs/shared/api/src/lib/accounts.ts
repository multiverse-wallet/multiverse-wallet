import { API } from "./api";
import { Resource } from "./resource";
import { Wallet } from "xrpl";
import { Vault } from "./vault";
import { v4 as uuid } from "uuid";
import { Account, CreateAccountRequest, DeleteAccountRequest, RPCRequest, RPCRequestMethod, SelectAccountRequest, UpdateAccountRequest } from "@multiverse-wallet/multiverse";

export interface AccountsState {
  selectedAccount?: Account;
  accounts: Account[];
  derivationPathIndex: number;
}

export class AccountsResource {
  public resource = new Resource<AccountsState>(AccountsResource.name, {
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
  }
  async listAccounts(req: RPCRequest<void>) {
    return { result: this.resource.state?.accounts || [] };
  }
  async getSelectedAccount(req: RPCRequest<void>) {
    return { result: this.resource.state?.selectedAccount };
  }
  async selectAccount(req: RPCRequest<SelectAccountRequest>) {
    this.resource.state!.selectedAccount = this.resource.state?.accounts.find(
      (account) => account.id == req.data.id
    );
    await this.resource.saveToStorage();
    this.api.notifyUpdate();
    return { result: this.resource.state?.selectedAccount };
  }
  async createAccount(req: RPCRequest<CreateAccountRequest>) {
    let wallet: Wallet;
    if (req.data.derivationPath) {
      wallet = Wallet.fromMnemonic(
        this.vault.resource.state!.decryptedSecretRecoveryPhrase,
        {
          derivationPath: req.data.derivationPath,
        }
      );
      this.resource.state!.accounts.push({
        id: uuid(),
        name: req.data.name,
        address: wallet.classicAddress,
        derivationPath: req.data.derivationPath,
      });
    } else if (req.data.secret) {
      wallet = Wallet.fromSecret(req.data.secret);
      this.resource.state!.accounts.push({
        id: uuid(),
        name: req.data.name,
        address: wallet.classicAddress,
      });
    } else {
      const derivationIndex = this.resource.state?.derivationPathIndex || 0;
      const derivationPath = derivationPathFromIndex(derivationIndex);
      this.resource.state!.derivationPathIndex = derivationIndex + 1;
      wallet = Wallet.fromMnemonic(
        this.vault.resource.state!.decryptedSecretRecoveryPhrase,
        {
          derivationPath,
        }
      );
      this.resource.state!.accounts.push({
        id: uuid(),
        name: req.data.name,
        address: wallet.classicAddress,
        derivationPath,
      });
    }
    await this.resource.saveToStorage();
    this.api.notifyUpdate();
    // Add the account...
    return { result: true };
  }
  async updateAccount(req: RPCRequest<UpdateAccountRequest>) {
    this.resource.state!.accounts = this.resource.state!.accounts.map(
      (acc) => {
        if (acc.id === req.data.id) {
          acc.name = req.data.account.name!
        }
        return acc
      }
    );
    await this.resource.saveToStorage();
    this.api.notifyUpdate();
    return { result: true };
  }
  async deleteAccount(req: RPCRequest<DeleteAccountRequest>) {
    this.resource.state!.accounts = this.resource.state!.accounts.filter(
      (acc) => acc.id !== req.data.id
    );
    await this.resource.saveToStorage();
    this.api.notifyUpdate();
    return { result: true };
  }
}

function derivationPathFromIndex(index: number) {
  return `m/44'/144'/0'/0'/${index}`;
}
