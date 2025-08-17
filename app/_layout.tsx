import {
  AppToastProvider
} from '@/contexts';
import { queryClient } from '@/lib/queryClient';
import { appConfig } from '@/tamagui/tamagui.config';

import { PortalProvider } from '@tamagui/portal';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { JSX } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TamaguiProvider, Theme } from 'tamagui';


const RootLayout = (): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <TamaguiProvider config={appConfig}>
            <Theme name="light">
              <AppToastProvider>
                <PortalProvider>
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(app)" />
                  </Stack>
                </PortalProvider>
              </AppToastProvider>
            </Theme>
          </TamaguiProvider>
        </SafeAreaView>
      </GestureHandlerRootView>
    </QueryClientProvider >
  );
};

export default RootLayout;
