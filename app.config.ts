import type { ExpoConfig } from '@expo/config';
import pkg from './package.json' assert { type: 'json' };

const VERSION = pkg.version as string;
const RUNTIME = '1.0';
const PROJECT_ID = 'aa3dceb9-3292-426e-8e46-ff11539b7122';

// Decide variant: dev when APP_VARIANT=dev or when using the "internal-apk-dev" profile
const profile = process.env.EAS_BUILD_PROFILE;
const isDevVariant = process.env.APP_VARIANT === 'dev' || profile === 'internal-apk-dev';

// IDs for store vs dev
const NAME = isDevVariant ? 'Hundesport (Dev)' : 'Hundesport';
const SLUG = 'hunde-sport';
const SCHEME = isDevVariant ? 'hundesport-dev' : 'hundesport';
const PACKAGE = isDevVariant ? 'com.anonymous.hundesport.dev' : 'com.anonymous.hundesport';

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
        bundleIdentifier: PACKAGE, // iOS will also be ".dev" when dev variant
    },
    android: {
        package: PACKAGE,
        edgeToEdgeEnabled: true,
        softwareKeyboardLayoutMode: 'pan',
        adaptiveIcon: {
            foregroundImage: './assets/images/adaptive-icon.png',
            backgroundColor: '#ffffff',
        },
        permissions: [
            'INTERNET',
            'ACCESS_NETWORK_STATE',
            'VIBRATE',
        ],
    },
    web: { bundler: 'metro', output: 'static', favicon: './assets/images/favicon.png' },
    plugins: [
        'expo-router',
        'expo-font',
        ['expo-splash-screen', {
            image: './assets/images/splash-icon.png',
            imageWidth: 200,
            resizeMode: 'contain',
            backgroundColor: '#ffffff'
        }],
    ],
    experiments: { typedRoutes: true },
    extra: { router: {}, eas: { projectId: PROJECT_ID } },
    owner: 'jferagen',
});
