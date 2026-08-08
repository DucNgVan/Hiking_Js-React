const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Optimize file watching to prevent EMFILE errors on macOS
config.watcher = {
  ...config.watcher,
  healthCheck: {
    enabled: true,
  },
};

module.exports = config;
