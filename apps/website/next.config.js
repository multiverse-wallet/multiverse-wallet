const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.js',
  unstable_flexsearch: true,
  unstable_staticImage: true,
});

module.exports = withNextra({
  i18n: {
    locales: ['en-US'],
    defaultLocale: 'en-US',
  },
  redirects: () => {
    return [
      {
        source: '/docs',
        destination: '/docs/getting-started',
        statusCode: 301,
      },
      {
        source: '/changelog',
        destination: '/docs/changelog',
        statusCode: 301,
      },
      {
        source: '/change-log',
        destination: '/docs/changelog',
        statusCode: 301,
      },
      {
        source: '/docs',
        destination: '/docs/getting-started',
        statusCode: 302,
      },
    ];
  },
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.tsx?$/,
      use: [options.defaultLoaders.babel],
    });
    config.resolve = {
      ...config.resolve,
      fallback: {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
        https: false,
        net: false,
        tls: false,
      },
    };
    return config;
  },
});
