import * as Sentry from "@sentry/react-native";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { enableFreeze, enableScreens } from "react-native-screens";
import { PortalProvider, TamaguiProvider } from "tamagui";

import { ModalHost } from "@/components/chrome/ModalHost";
import { AppToastProvider } from "@/contexts";
import { usePlayStoreUpdates } from "@/hooks/usePlayStoreUpdates";
import { queryClient } from "@/lib/api/queryClient";
import appConfig from "@/tamagui/tamagui.config";

enableScreens(true);
enableFreeze(true);

const flexStyle = { flex: 1 };
const screenOptions = { headerShown: false };
const RootLayout = () => {
  usePlayStoreUpdates({
    checkOnStart: true,
    checkOnForeground: true,
    immediate: false,
  });
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={flexStyle}>
        <SafeAreaView style={flexStyle}>
          <TamaguiProvider config={appConfig}>
            <PortalProvider shouldAddRootHost>
              <AppToastProvider>
                <ModalHost />
                <Stack
                  screenOptions={screenOptions}
                  initialRouteName="(preloader)/index"
                >
                  <Stack.Screen name="(preloader)/index" />
                  <Stack.Screen name="(app)" />
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
