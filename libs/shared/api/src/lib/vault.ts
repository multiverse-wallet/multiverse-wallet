import { encrypt, decrypt } from "@metamask/browser-passworder";
import {
  RevealRecoveryPhraseRequest,
  RPCRequest,
  SetupRecoveryPhraseRequest,
} from "@multiverse-wallet/multiverse";
import { API } from "./api";
import { Resource } from "./resource";

const SESSION_TIMEOUT = 3_600_000;

interface VaultState {
  unlockTime?: number;
  encryptedSecretRecoveryPhrase?: any;
  decryptedSecretRecoveryPhrase?: any;
}

export class Vault {
  public resource = new Resource<VaultState>(Vault.name, {
    unlockTime: 0,
    encryptedSecretRecoveryPhrase: undefined,
    decryptedSecretRecoveryPhrase: undefined,
  });
  constructor(private api: API) {
    setInterval(() => {
      this.resource.loadFromStorage().then(() => {
        if (
          !!this.resource.state?.decryptedSecretRecoveryPhrase &&
          Date.now() > this.resource.state!.unlockTime! + SESSION_TIMEOUT
        ) {
          console.log(
            "locking due to session timeout",
            Date.now(),
            this.resource.state!.unlockTime! + SESSION_TIMEOUT
          );
          this.lock();
        }
      });
    }, 1000);
    api.rpcMethodRegistry.set("unlock", (r) => this.unlock(r.data.password));
    api.rpcMethodRegistry.set("lock", (r) => this.lock());
    api.rpcMethodRegistry.set("isLocked", (r) => this.isLocked());
    api.rpcMethodRegistry.set("hasCompletedSetup", (r) =>
      this.hasCompletedSetup()
    );
    api.rpcMethodRegistry.set("setupRecoveryPhrase", (r) =>
      this.setupRecoveryPhrase(r)
    );
    api.rpcMethodRegistry.set("revealRecoveryPhrase", (r) =>
      this.revealRecoveryPhrase(r)
    );
  }
  async unlock(password: string) {
    try {
      const d = await decrypt<string>(
        password,
        this.resource.state?.encryptedSecretRecoveryPhrase!
      );
      this.resource.state!.decryptedSecretRecoveryPhrase = d;
      this.resource.state!.unlockTime = Date.now();
      await this.resource.saveToStorage();
      this.api.notifyUpdate();
      return { result: { unlocked: true } };
    } catch (e: any) {
      return { error: e.message };
    }
  }
  async lock() {
    this.resource.state!.decryptedSecretRecoveryPhrase = undefined;
    this.resource.saveToStorage();
    this.api.notifyUpdate();
    return { result: true };
  }
  async isLocked() {
    return { result: !this.resource.state!.decryptedSecretRecoveryPhrase };
  }
  async hasCompletedSetup() {
    return { result: !!this.resource.state?.encryptedSecretRecoveryPhrase };
  }

  async setupRecoveryPhrase(request: RPCRequest<SetupRecoveryPhraseRequest>) {
    try {
      const e = await encrypt(
        request.data.password,
        request.data.secretRecoveryPhrase
      );
      this.resource.state!.encryptedSecretRecoveryPhrase = e;
      this.unlock(request.data.password);
      await this.resource.saveToStorage();
      this.api.notifyUpdate();
    } catch (e: any) {
      return { error: e.message };
    }
    return { result: true };
  }

  async revealRecoveryPhrase(req: RPCRequest<RevealRecoveryPhraseRequest>) {
    try {
      const secretRecoveryPhrase = await decrypt<string>(
        req.data.password,
        this.resource.state?.encryptedSecretRecoveryPhrase!
      );
      return { result: secretRecoveryPhrase };
    } catch (e: any) {
      return { error: e.message };
    }
  }
}
