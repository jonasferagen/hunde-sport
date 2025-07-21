import {
  LayoutProvider,
  ShoppingCartProvider,
  StatusProvider,
  ThemeProvider
} from '@/contexts';


import { config } from '@/config/tamagui.config';
import { PortalProvider } from '@tamagui/portal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot, useNavigationContainerRef } from 'expo-router';
import React, { JSX, memo, useState } from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider, Theme } from 'tamagui';

const AppContent = memo((): JSX.Element => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }} >
      <TamaguiProvider config={config}>
        <Theme name="light">
          <PortalProvider>
            <Slot />
          </PortalProvider>
        </Theme>
      </TamaguiProvider>
    </GestureHandlerRootView>
  );
});



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
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusProvider>
          <ShoppingCartProvider>
            <LayoutProvider>
              <ThemeProvider>
                {children}
              </ThemeProvider>
            </LayoutProvider>
          </ShoppingCartProvider>
        </StatusProvider>
      </QueryClientProvider >
    </SafeAreaProvider >
  );
});

export default function RootLayout() {
  const navigationRef = useNavigationContainerRef();
  //  useNavigationLog(navigationRef);

  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}