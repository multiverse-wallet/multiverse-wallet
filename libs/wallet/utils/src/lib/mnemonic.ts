import * as bip39 from 'bip39';

export function generateMnemonic() {
  // Generate a random mnemonic (uses crypto.randomBytes under the hood), defaults to 128-bits of entropy
  return bip39.generateMnemonic();
}
