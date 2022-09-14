import { decodeBase64, encodeAsBase64 } from './binary-base64-conversions';

/**
 * Adapted from: https://dev.to/halan/4-ways-of-symmetric-cryptography-and-javascript-how-to-aes-with-javascript-3o1b
 *
 * Related inspiration: https://www.enpass.io/docs/security-whitepaper-enpass/EnpassSecurityWhitepaper.pdf
 */
const encoder = new TextEncoder();
const decoder = new TextDecoder();

const BYTES_IN_SALT = 16;

const toBase64 = (buffer: ArrayBuffer | ArrayLike<number>): string =>
  encodeAsBase64(String.fromCharCode(...new Uint8Array(buffer)));

const fromBase64 = (buffer: string): Uint8Array =>
  Uint8Array.from(decodeBase64(buffer), (c) => c.charCodeAt(0));

async function pbkdf2(
  password: string | undefined,
  salt: Uint8Array,
  iterations: number,
  length: number,
  hash: string,
  algorithm = 'AES-CBC'
) {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  // We don't need to export our key
  const extractable = false;

  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      /**
       * The type information suggests this isn't permitted but it works and this is how it is
       * used in the article linked above...
       */
      salt: encoder.encode(salt as any),
      iterations,
      hash,
    },
    keyMaterial,
    { name: algorithm, length },
    extractable,
    ['encrypt', 'decrypt']
  );
}

export async function encrypt(
  plainTextToEncrypt: string,
  plainTextPassword: string
) {
  const salt = crypto.getRandomValues(new Uint8Array(BYTES_IN_SALT));
  const iv = crypto.getRandomValues(new Uint8Array(BYTES_IN_SALT));
  const plain_text = encoder.encode(plainTextToEncrypt);
  const key = await pbkdf2(plainTextPassword, salt, 100000, 256, 'SHA-256');

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-CBC', iv },
    key,
    plain_text
  );

  const data = {
    salt: toBase64(salt),
    iv: toBase64(iv),
    encrypted: toBase64(encrypted),
    concatenated: toBase64([...salt, ...iv, ...new Uint8Array(encrypted)]),
  };

  return data.concatenated;
}

export async function decrypt(
  encryptedText: string,
  plainTextPassword: string
) {
  const ivLen = BYTES_IN_SALT;
  const saltLen = BYTES_IN_SALT;

  const encrypted = fromBase64(encryptedText);

  const salt = encrypted.slice(0, saltLen);
  const iv = encrypted.slice(0 + saltLen, saltLen + ivLen);
  const key = await pbkdf2(plainTextPassword, salt, 100000, 256, 'SHA-256');

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-CBC', iv },
    key,
    encrypted.slice(saltLen + ivLen)
  );

  return decoder.decode(decrypted);
}
