import BottomMenu from '@/components/layout/BottomMenu';
import Preloader from '@/components/preloader/Preloader';
import StatusMessage from '@/components/ui/StatusMessage';
import { BreadcrumbProvider } from '@/hooks/Breadcrumbs/BreadcrumbContext';
import { PreloaderProvider, usePreloader } from '@/hooks/Preloader/PreloaderProvider';
import { ShoppingCartProvider } from '@/hooks/ShoppingCart/ShoppingCartProvider';
import { StatusProvider } from '@/hooks/Status/StatusProvider';
import { AppStyles } from "@/styles/AppStyles";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useState } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function Layout() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[AppStyles.appContainer, { marginTop: insets.top, justifyContent: 'space-between', flex: 1 }]}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      />
      <BottomMenu />
    </View>
  );
}

function AppContent() {
  const { appIsReady } = usePreloader();

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return <Preloader />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Layout />
      <StatusMessage />
    </GestureHandlerRootView>
  );
}

export const RootLayout = () => {
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
            <ShoppingCartProvider>
              <PreloaderProvider>
                <AppContent />
              </PreloaderProvider>
            </ShoppingCartProvider>
          </BreadcrumbProvider>
        </StatusProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

export default RootLayout;