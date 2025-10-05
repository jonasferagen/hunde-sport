import type { ExpoConfig } from "@expo/config";

import pkg from "./package.json" assert { type: "json" };

const VERSION = pkg.version as string;
const PROJECT_ID = "aa3dceb9-3292-426e-8e46-ff11539b7122";

const profile = process.env.EAS_BUILD_PROFILE ?? "";

const isDevVariant =
  process.env.APP_VARIANT === "dev" ||
  profile === "development" ||
  profile === "internal-apk-dev";

// IDs for store vs dev
const NAME = isDevVariant ? "Hundesport (Dev)" : "Hundesport";
const SLUG = "hunde-sport";
const SCHEME = isDevVariant ? "hundesport-dev" : "hundesport";
const PACKAGE = isDevVariant
  ? "com.anonymous.hundesport.dev"
  : "com.anonymous.hundesport";

export default (): ExpoConfig => ({
  name: NAME,
  slug: SLUG,
  scheme: SCHEME,
  version: VERSION,
  runtimeVersion: { policy: "fingerprint" },
  updates: {
    enabled: true,
    checkAutomatically: "ON_LOAD",
    fallbackToCacheTimeout: 0,
    url: `https://u.expo.dev/${PROJECT_ID}`,
  },
  jsEngine: "hermes",
  orientation: "portrait",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  platforms: ["android", "ios"],
  android: {
    package: PACKAGE,
    edgeToEdgeEnabled: true,
    softwareKeyboardLayoutMode: "pan",
    adaptiveIcon: {
      foregroundImage: "./src/assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    permissions: ["INTERNET", "ACCESS_NETWORK_STATE", "VIBRATE"],
  },
  ios: {
    bundleIdentifier: "no.hundesport.app",
    supportsTablet: false,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  plugins: [
    "expo-router",
    "expo-font",
    [
      "expo-splash-screen",
      {
        image: "./src/assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
    [
      "@sentry/react-native/expo",
      {
        url: "https://sentry.io/",
        project: "hunde-sport",
        organization: "jonas-feragen-enk",
      },
    ],
  ],
  experiments: { typedRoutes: true },
  extra: { router: {}, eas: { projectId: PROJECT_ID } },
  owner: "jferagen",
});
