import {
  LayoutProvider,
  ShoppingCartProvider,
  StatusProvider,
  ThemeProvider
} from '@/contexts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot, useNavigationContainerRef } from 'expo-router';
import React, { JSX, memo, useState } from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MD3LightTheme, PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const AppContent = memo((): JSX.Element => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }} >
      <Slot />
    </GestureHandlerRootView>
  );
});

const PaperProviderWrapper = ({ children }: { children: React.ReactNode }) => {

  const paperTheme = {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
    },
  };

  return <PaperProvider theme={paperTheme}>{children}</PaperProvider>;
}

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
                <PaperProviderWrapper>
                  {children}
                </PaperProviderWrapper>
              </ThemeProvider>
            </LayoutProvider>
          </ShoppingCartProvider>
        </StatusProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
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