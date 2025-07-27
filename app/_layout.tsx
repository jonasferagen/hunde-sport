import { AppToast } from '@/components/ui/AppToast';
import {
  LayoutProvider,
  OrderProvider,
  SearchProvider,
  ShoppingCartProvider
} from '@/contexts';
import appConfig from '@/tamagui/tamagui.config';
import { PortalProvider } from '@tamagui/portal';

import { ToastProvider, ToastViewport } from '@tamagui/toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot } from 'expo-router';
import React, { JSX, memo, useState } from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider, Theme } from 'tamagui';



const AppProviders = memo(({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
      },
    },
  }));

  return (
    <TamaguiProvider config={appConfig}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Theme name="light">
          <PortalProvider shouldAddRootHost={true}>
            <SafeAreaProvider>
              <ToastProvider>
                <ToastViewport
                  multipleToasts={false}
                  flexDirection="column"
                  justifyContent='space-between'
                  position="absolute"
                  bottom={60}
                  left={0}
                  padding="$2"
                  gap="$2"
                />

                <QueryClientProvider client={queryClient}>
                  <OrderProvider>
                    <ShoppingCartProvider>
                      <SearchProvider>
                        <LayoutProvider>

                          <AppToast />
                          {children}
                        </LayoutProvider>
                      </SearchProvider>
                    </ShoppingCartProvider>
                  </OrderProvider>
                </QueryClientProvider >
              </ToastProvider>
            </SafeAreaProvider >
          </PortalProvider>
        </Theme>
      </GestureHandlerRootView>
    </TamaguiProvider>
  );
});
const AppContent = memo((): JSX.Element => {
  return (
    <Slot />
  );
});

export default function RootLayout() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}