// Tracking against this issue: https://github.com/nrwl/nx/issues/10405
module.exports = function getRollupOptions(options) {
  return {
    ...options,
    external: [],
    plugins: [
      ...options.plugins,
      require("rollup-plugin-node-globals")(),
      require("rollup-plugin-node-builtins")(),
    ],
  };
};
