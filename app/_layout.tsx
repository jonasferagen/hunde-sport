import { DebugView } from '@/components/debug/DebugView';
import { ModalHost } from '@/components/features/product/purchase/ModalHost';
import {
  AppToastProvider,
  DebugProvider,
  ProductCategoryProvider,
  SearchProvider
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
              <DebugProvider>
                <ProductCategoryProvider>
                  <AppToastProvider>
                    <PortalProvider>
                      <ModalHost />
                      <SearchProvider>
                        <Stack screenOptions={{ headerShown: false }}>
                          <Stack.Screen name="(app)" />
                        </Stack>
                        <DebugView />
                      </SearchProvider>
                    </PortalProvider>
                  </AppToastProvider>
                </ProductCategoryProvider>
              </DebugProvider>
            </Theme>
          </TamaguiProvider>
        </SafeAreaView>
      </GestureHandlerRootView>
    </QueryClientProvider >
  );
};

export default RootLayout;
