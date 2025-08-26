import * as SplashScreen from 'expo-splash-screen';
SplashScreen.preventAutoHideAsync().catch(() => { });
import * as Sentry from 'sentry-expo';
import Constants from 'expo-constants';

// optional: tag environments by your EAS profile/variant
const env =
    process.env.APP_VARIANT === 'dev' ? 'dev' :
        Constants?.executionEnvironment === 'storeClient' ? 'production' :
            'internal';

Sentry.init({
    dsn: 'https://<PUBLIC_KEY>@sentry.io/<PROJECT_ID>', // paste your DSN
    enableInExpoDevelopment: true,        // capture in dev too (optional)
    debug: false,                         // set to true while validating
    tracesSampleRate: 0.0,                // start with 0; turn on later if you want perf
    enableAutoSessionTracking: true,
    // The plugin sets release/dist automatically; you can still set environment:
    environment: env,
});

import 'expo-router/entry';
import 'react-native-gesture-handler';
import 'react-native-reanimated';

