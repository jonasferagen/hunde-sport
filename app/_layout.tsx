import { Preloader } from '@/components/preloader/Preloader';
import {
  BreadcrumbProvider,
  LayoutProvider,
  PreloaderProvider,
  ProductProvider,
  ShoppingCartProvider,
  StatusProvider,
  ThemeProvider,
  usePreloaderContext
} from '@/contexts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot } from 'expo-router';
import { JSX, useState } from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const AppContent = (): JSX.Element => {
  const { appIsReady } = usePreloaderContext();

  if (!appIsReady) {
    return <Preloader />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} >
      <Slot />
    </GestureHandlerRootView>
  );
}

const AppProviders = ({ children }: { children: React.ReactNode }) => {
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
          <BreadcrumbProvider>
            <ProductProvider>
              <ShoppingCartProvider>
                <PreloaderProvider>
                  <LayoutProvider>
                    <ThemeProvider>
                      {children}
                    </ThemeProvider>
                  </LayoutProvider>
                </PreloaderProvider>
              </ShoppingCartProvider>
            </ProductProvider>
          </BreadcrumbProvider>
        </StatusProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}