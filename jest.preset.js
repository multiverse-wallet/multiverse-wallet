const path = require('path');
const nxPreset = require('@nrwl/jest/preset').default;

module.exports = {
  ...nxPreset,
  setupFiles: [path.resolve('tools/utils/jsdom-polyfills.js')],
};
