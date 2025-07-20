import {
  LayoutProvider,
  ProductProvider,
  ShoppingCartProvider,
  StatusProvider,
  ThemeProvider
} from '@/contexts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot, useNavigationContainerRef } from 'expo-router';
import React, { JSX, memo, useState } from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const AppContent = memo((): JSX.Element => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }} >
      <Slot />
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
          <ProductProvider>
            <ShoppingCartProvider>
              <LayoutProvider>
                <ThemeProvider>
                  {children}
                </ThemeProvider>
              </LayoutProvider>
            </ShoppingCartProvider>
          </ProductProvider>
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