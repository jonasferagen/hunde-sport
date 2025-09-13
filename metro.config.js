// metro.config.js
const { getSentryExpoConfig } = require("@sentry/react-native/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getSentryExpoConfig(__dirname);

// Be defensive in case resolver/sourceExts are undefined
config.resolver ??= {};
config.resolver.sourceExts ??= [];

// Add 'mjs' only if not already present
if (!config.resolver.sourceExts.includes("mjs")) {
  config.resolver.sourceExts.push("mjs");
}

module.exports = config;
