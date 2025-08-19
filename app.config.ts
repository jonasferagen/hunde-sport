// app.config.ts
import type { ExpoConfig } from '@expo/config';
import pkg from './package.json' assert { type: 'json' };

const VERSION = pkg.version as string; // single source of truth

export default (): ExpoConfig => ({
    name: 'hunde-sport.no',
    slug: 'hunde-sport',
    version: VERSION,
    runtimeVersion: VERSION,       // bare requires a string
    updates: { enabled: true, url: 'https://u.expo.dev/aa3dceb9-3292-426e-8e46-ff11539b7122' },
    jsEngine: 'hermes',
    orientation: 'portrait',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: { supportsTablet: true, bundleIdentifier: 'com.anonymous.hundesport' },
    android: {
        package: 'com.anonymous.hundesport',
        edgeToEdgeEnabled: true,
        adaptiveIcon: { foregroundImage: './assets/images/adaptive-icon.png', backgroundColor: '#ffffff' }
    },
    web: { bundler: 'metro', output: 'static', favicon: './assets/images/favicon.png' },
    plugins: [
        'expo-router',
        ['expo-splash-screen', { image: './assets/images/splash-icon.png', imageWidth: 200, resizeMode: 'contain', backgroundColor: '#ffffff' }],
        'expo-font'
    ],
    experiments: { typedRoutes: true },
    extra: { router: {}, eas: { projectId: 'aa3dceb9-3292-426e-8e46-ff11539b7122' } },
    owner: 'jferagen',
});
