/**
 * Base64 comes from IETF RFC 4648 (2006).
 *
 * - btoa, the encoder function, stands for binary to ASCII, meaning it converts any binary input into a subset of ASCII (Base64).
 * - atob, the decoder function, converts ASCII (or Base64) to its original binary format.
 */
import { atob, btoa } from 'abab';

// Invent our own InvalidCharacterError
export class InvalidCharacterError extends Error {}

export function encodeAsBase64(stringToEncode: string): string | never {
  const encoded = btoa(stringToEncode);
  /**
   * Per the spec (https://html.spec.whatwg.org/multipage/webappapis.html#atob:dom-windowbase64-btoa-3),
   * btoa will accept strings "containing only characters in the range U+0000 to U+00FF."
   * If passed a string with characters above U+00FF, btoa will return null.
   *
   * When null is returned, the spec calls for throwing a DOMException of type InvalidCharacterError.
   */
  if (!encoded) {
    throw new InvalidCharacterError('Attempted to encode an invalid character');
  }
  return encoded;
}

export function decodeBase64(encodedData: string): string | never {
  const decoded = atob(encodedData);
  /**
   * If atob is passed a string that is not base64-valid, it will return null
   *
   * When null is returned, the spec calls for throwing a DOMException of type InvalidCharacterError.
   */
  if (!decoded) {
    throw new InvalidCharacterError('Attempted to decode invalid base64 data');
  }
  return decoded;
}
