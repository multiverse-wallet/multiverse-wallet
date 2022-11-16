/* eslint-disable @typescript-eslint/no-var-requires */
const getWebpackConfig = require('@nrwl/react/plugins/webpack');
const { IgnorePlugin, ProvidePlugin } = require('webpack');

module.exports = (config) => {
  config = getWebpackConfig(config);

  config.node = config.node || {};
  config.node.global = true;

  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    buffer: require.resolve('buffer'),
    https: false,
    net: false,
    tls: false,
    url: false,
  };

  // Remove the non-English word-lists from the bip39 library used for mnemonic generation
  config.plugins.push(
    new IgnorePlugin({
      resourceRegExp: /^\.\/wordlists\/(?!english)/,
      contextRegExp: /bip39\/src$/,
    })
  );

  config.plugins.push(
    new ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    })
  );

  config.optimization.runtimeChunk = false;

  return config;
};
