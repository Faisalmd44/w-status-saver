// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.server = config.server || {};
const originalEnhanceMiddleware = config.server.enhanceMiddleware;

config.server.enhanceMiddleware = (middleware, server) => {
  const enhanced = originalEnhanceMiddleware
    ? originalEnhanceMiddleware(middleware, server)
    : middleware;

  return (req, res, next) => {
    // Behind Cloud Run / reverse proxy, align req.headers.host with req.headers.origin or x-forwarded-host
    // so Expo's CorsMiddleware recognizes requests as same-origin.
    if (req.headers && req.headers.origin) {
      try {
        const originUrl = new URL(req.headers.origin);
        if (originUrl.host) {
          req.headers.host = originUrl.host;
        }
      } catch {
        // Ignore malformed origin
      }
    } else if (req.headers && req.headers['x-forwarded-host']) {
      req.headers.host = Array.isArray(req.headers['x-forwarded-host'])
        ? req.headers['x-forwarded-host'][0]
        : req.headers['x-forwarded-host'];
    }

    return enhanced(req, res, next);
  };
};

module.exports = config;
