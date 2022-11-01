const Environment = require('jest-environment-jsdom');

/**
 * We use this custom environment to work around the fact that TextEncoder
 * and TextDecoder are currently missing from jsdom:
 *
 * https://github.com/jsdom/jsdom/issues/2524
 */
module.exports = class CustomTestEnvironment extends Environment {
  async setup() {
    await super.setup();
    if (typeof this.global.TextEncoder === 'undefined') {
      const { TextEncoder, TextDecoder } = require('util');
      this.global.TextEncoder = TextEncoder;
      this.global.TextDecoder = TextDecoder;
    }
  }
};
