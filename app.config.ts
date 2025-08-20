// app.config.ts
import type { ExpoConfig } from '@expo/config';
import pkg from './package.json' assert { type: 'json' };

const VERSION = pkg.version as string;           // 1.0.1
const RUNTIME = '1.0';                           // bump only on native changes

const PROJECT_ID = 'aa3dceb9-3292-426e-8e46-ff11539b7122';
const NAME = 'Hundesport';
const SLUG = "hunde-sport";
const SCHEME = "hundesport";
const PACKAGE = "com.anonymous.hundesport";

export default (): ExpoConfig => ({
    name: NAME,
    slug: SLUG,
    scheme: SCHEME,
    version: VERSION,
    runtimeVersion: RUNTIME,
    updates: { enabled: true, url: `https://u.expo.dev/${PROJECT_ID}` },
    jsEngine: 'hermes',
    orientation: 'portrait',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
        supportsTablet: true,
        bundleIdentifier: PACKAGE, // set to your real org before App Store release
    },
    android: {
        package: PACKAGE,         // immutable after Play release
        edgeToEdgeEnabled: true,
        softwareKeyboardLayoutMode: 'pan',
        adaptiveIcon: {
            foregroundImage: './assets/images/adaptive-icon.png',
            backgroundColor: '#ffffff',
        },
    },
    web: { bundler: 'metro', output: 'static', favicon: './assets/images/favicon.png' },
    plugins: [
        'expo-router',
        'expo-font',
        ['expo-splash-screen', { image: './assets/images/splash-icon.png', imageWidth: 200, resizeMode: 'contain', backgroundColor: '#ffffff' }],
        'sentry-expo'
    ],
    experiments: { typedRoutes: true },
    extra: { router: {}, eas: { projectId: PROJECT_ID } },
    owner: 'jferagen',
});
