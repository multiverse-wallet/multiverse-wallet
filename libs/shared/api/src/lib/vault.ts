import { encrypt, decrypt, generateSalt } from '@metamask/browser-passworder';
import {
  APIEvents,
  RevealRecoveryPhraseRequest,
  RPCRequest,
  RPCRequestMethod,
  SetupRecoveryPhraseRequest,
} from '@multiverse-wallet/multiverse';
import { API } from './api';
import { State } from './resource';
import * as bip39 from 'bip39';
import { randomBytes } from 'crypto';

const SESSION_TIMEOUT = 3_600_000;
const DEFAULT_ACCOUNT_NAME = 'Account 1';

interface VaultState {
  salt: string;
  encryptedSecretRecoveryPhrase?: any;
}

export class Vault {
  public state = new State<VaultState>(Vault.name, {
    salt: generateRandomSalt(),
    encryptedSecretRecoveryPhrase: undefined,
  });
  public decryptedSecretRecoveryPhrase?: string;
  public unlockTime?: number;
  constructor(private api: API) {
    setInterval(async () => {
      if (
        !!this.decryptedSecretRecoveryPhrase &&
        !!this.unlockTime &&
        Date.now() > this.unlockTime + SESSION_TIMEOUT
      ) {
        this.lock();
      }
    }, 1000);
    api.rpcMethodRegistry.set('unlock', (r) => this.unlock(r.data.password));
    api.rpcMethodRegistry.set('lock', (r) => this.lock());
    api.rpcMethodRegistry.set('isLocked', (r) => this.isLocked());
    api.rpcMethodRegistry.set('hasCompletedSetup', (r) =>
      this.hasCompletedSetup()
    );
    api.rpcMethodRegistry.set('setupRecoveryPhrase', (r) =>
      this.setupRecoveryPhrase(r)
    );
    api.rpcMethodRegistry.set('revealRecoveryPhrase', (r) =>
      this.revealRecoveryPhrase(r)
    );
  }
  async salt(value: string): Promise<string> {
    const { salt } = await this.state.fetch();
    if (salt) {
      return salt + value;
    }
    return value;
  }
  async unlock(password: string) {
    try {
      await this.state.fetchAndUpdate(async (state) => {
        const { encryptedSecretRecoveryPhrase } = state;
        const decryptedSecretRecoveryPhrase = await decrypt<string>(
          await this.salt(password),
          encryptedSecretRecoveryPhrase
        );
        this.decryptedSecretRecoveryPhrase = decryptedSecretRecoveryPhrase;
        this.unlockTime = Date.now();
        return state;
      });
      this.api.emit(APIEvents.update);
      return { result: { unlocked: true } };
    } catch (e: any) {
      return { error: e.message };
    }
  }
  async lock() {
    this.decryptedSecretRecoveryPhrase = undefined;
    this.unlockTime = undefined;
    this.api.emit(APIEvents.update);
    return { result: true };
  }
  async isLocked() {
    return {
      result: !this.decryptedSecretRecoveryPhrase && !this.unlockTime,
    };
  }
  async hasCompletedSetup() {
    const { encryptedSecretRecoveryPhrase } = await this.state.fetch();
    return { result: !!encryptedSecretRecoveryPhrase };
  }

  async setupRecoveryPhrase(request: RPCRequest<SetupRecoveryPhraseRequest>) {
    const { encryptedSecretRecoveryPhrase } = await this.state.fetch();
    if (encryptedSecretRecoveryPhrase) {
      return { error: 'recovery phrase already set' };
    }
    if (!bip39.validateMnemonic(request.data.secretRecoveryPhrase)) {
      return { error: 'invalid mnemonic' };
    }
    try {
      await this.state.fetchAndUpdate(async (state) => {
        const encryptedSecretRecoveryPhrase = await encrypt(
          await this.salt(request.data.password),
          request.data.secretRecoveryPhrase
        );
        state.encryptedSecretRecoveryPhrase = encryptedSecretRecoveryPhrase;
        await this.unlock(request.data.password);
        return state;
      });
      const { result: accountId } = await this.api.accounts.createAccount({
        method: RPCRequestMethod.createAccount,
        data: { name: DEFAULT_ACCOUNT_NAME },
        origin: 'self',
      });
      await this.api.accounts.selectAccount({
        method: RPCRequestMethod.selectAccount,
        data: { id: accountId },
        origin: 'self',
      });
      this.api.emit(APIEvents.update);
      return { result: true };
    } catch (e: any) {
      return { error: e.message };
    }
  }
  async revealRecoveryPhrase(req: RPCRequest<RevealRecoveryPhraseRequest>) {
    const { encryptedSecretRecoveryPhrase } = await this.state.fetch();
    try {
      const secretRecoveryPhrase = await decrypt<string>(
        req.data.password,
        encryptedSecretRecoveryPhrase
      );
      return { result: secretRecoveryPhrase };
    } catch (e: any) {
      return { error: e.message };
    }
  }
  async encryptSecret(value: string): Promise<string> {
    if (!this.decryptedSecretRecoveryPhrase) {
      return Promise.reject('failed to encrypt value, vault is locked');
    }
    return await encrypt(
      await this.salt(this.decryptedSecretRecoveryPhrase),
      value
    );
  }
  async decryptSecret(value: string): Promise<string> {
    if (!this.decryptedSecretRecoveryPhrase) {
      return Promise.reject('failed to decrypt value, vault is locked');
    }
    return await decrypt(
      await this.salt(this.decryptedSecretRecoveryPhrase),
      value
    );
  }
}

function generateRandomSalt(): string {
  return randomBytes(64).toString('hex');
}
