// bootstrap/index.ts
import * as Sentry from "@sentry/react-native";
import { Image, PixelRatio } from "react-native";
import { consoleTransport } from "react-native-logs";

import { BASE_URL, SENTRY_DSN } from "@/config/app";
import { StoreImage } from "@/domain/StoreImage";
import { configureApiClient } from "@/lib/api/apiClient";
import { configureDprProvider } from "@/lib/image/dpr";
import { configureLogger } from "@/lib/logger";
// Logger
configureLogger({
  severity: __DEV__ ? "debug" : "info",
  transport: consoleTransport,
  enabled: true,
});

// DPR provider for scaling helpers
configureDprProvider(() => PixelRatio.get());

// Intrinsic image size provider
StoreImage.configureImageSizeProvider(
  (uri) =>
    new Promise((resolve, reject) =>
      Image.getSize(uri, (w, h) => resolve({ width: w, height: h }), reject)
    )
);

// API client (env-specific settings live here)
configureApiClient({
  baseURL: BASE_URL,
  timeoutMs: 15_000,
  enableLogging: __DEV__,
  // getAuthToken: async () => yourTokenStore.get()  // optional
});

Sentry.init({
  dsn: SENTRY_DSN,

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],
});