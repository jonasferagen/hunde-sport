import {
  LayoutProvider,
  ShoppingCartProvider,
  StatusProvider,
} from '@/contexts';
import appConfig from '@/tamagui/tamagui.config';
import { PortalProvider } from '@tamagui/portal';
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
      <Theme name="light">
        <PortalProvider>
          <SafeAreaProvider>
            <QueryClientProvider client={queryClient}>
              <StatusProvider>
                <ShoppingCartProvider>
                  <LayoutProvider>
                    {children}
                  </LayoutProvider>
                </ShoppingCartProvider>
              </StatusProvider>
            </QueryClientProvider >
          </SafeAreaProvider >
        </PortalProvider>
      </Theme>
    </TamaguiProvider>
  );
});
const AppContent = memo((): JSX.Element => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }} >
      <Slot />
    </GestureHandlerRootView>
  );
});

export default function RootLayout() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}