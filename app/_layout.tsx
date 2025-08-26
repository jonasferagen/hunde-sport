import { ModalHost } from '@/components/features/product/purchase/ModalHost';

import { AppToastProvider } from '@/contexts';
import { usePlayStoreUpdates } from '@/hooks/usePlayStoreUpdates';
import { queryClient } from '@/lib/queryClient';
import appConfig from '@/tamagui/tamagui.config';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { enableFreeze, enableScreens } from 'react-native-screens';
import { PortalProvider, TamaguiProvider } from 'tamagui';


enableScreens(true);
enableFreeze(true);

const RootLayout = () => {
  usePlayStoreUpdates({ checkOnStart: true, checkOnForeground: true, immediate: false });
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <TamaguiProvider config={appConfig}>
            <PortalProvider shouldAddRootHost>
              <AppToastProvider>
                <ModalHost />
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(app)" options={{ contentStyle: { backgroundColor: "transparent" } }} />
                </Stack>
              </AppToastProvider>
            </PortalProvider>
          </TamaguiProvider>
        </SafeAreaView>
      </GestureHandlerRootView>
    </QueryClientProvider >
  );
};

export default RootLayout;
