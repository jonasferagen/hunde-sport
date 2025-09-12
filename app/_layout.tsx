import * as Sentry from "@sentry/react-native";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { enableFreeze, enableScreens } from "react-native-screens";
import { PortalProvider, TamaguiProvider } from "tamagui";

import { ModalHost } from "@/components/features/product-variation/ModalHost";
import { AppToastProvider } from "@/contexts";
import { usePlayStoreUpdates } from "@/hooks/usePlayStoreUpdates";
import { queryClient } from "@/lib/api/queryClient";
import appConfig from "@/tamagui/tamagui.config";

Sentry.init({
  dsn: "https://b7fe570697a6a8f88822825ef7d9462f@o4509876451606528.ingest.de.sentry.io/4509909104722000",

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

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

enableScreens(true);
enableFreeze(true);

const RootLayout = () => {
  usePlayStoreUpdates({
    checkOnStart: true,
    checkOnForeground: true,
    immediate: false,
  });
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <TamaguiProvider config={appConfig}>
            <PortalProvider shouldAddRootHost>
              <AppToastProvider>
                <ModalHost />
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen
                    name="(app)"
                    options={{
                      contentStyle: { backgroundColor: "transparent" },
                    }}
                  />
                </Stack>
              </AppToastProvider>
            </PortalProvider>
          </TamaguiProvider>
        </SafeAreaView>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};

export default Sentry.wrap(RootLayout);
