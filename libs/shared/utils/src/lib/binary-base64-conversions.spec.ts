/**
 * We don't want to repeat all the test cases for the encoding and decoding logic
 * of the underlying "abab" library here, but it's good to have some basic coverage.
 *
 * See more test fixtures: https://github.com/jsdom/abab/blob/master/test/fixtures.js
 */
import {
  encodeAsBase64,
  decodeBase64,
  InvalidCharacterError,
} from './binary-base64-conversions';

describe('encodeAsBase64()', () => {
  it('should encode the given data as base64', async () => {
    expect(encodeAsBase64('wergerg')).toMatchInlineSnapshot(`"d2VyZ2VyZw=="`);
    expect(encodeAsBase64('12345')).toMatchInlineSnapshot(`"MTIzNDU="`);
  });

  it('should throw an InvalidCharacterError if an invalid character is passed', async () => {
    expect(() => encodeAsBase64('עברית')).toThrowError(InvalidCharacterError);
  });
});

describe('decodeBase64()', () => {
  it('should decode the given base64 to a string', async () => {
    expect(decodeBase64('d2VyZ2VyZw==')).toMatchInlineSnapshot(`"wergerg"`);
    expect(decodeBase64('MTIzNDU=')).toMatchInlineSnapshot(`"12345"`);
  });

  it('should throw an InvalidCharacterError if invalid base64 data is passed', async () => {
    expect(() => decodeBase64('')).toThrowError(InvalidCharacterError);
    expect(() => decodeBase64('abcd=== ')).toThrowError(InvalidCharacterError);
    expect(() => decodeBase64('ab\u00a0cd')).toThrowError(
      InvalidCharacterError
    );
  });
});
