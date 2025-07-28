import { SideBar } from '@/components/menu/SideBar';
import { AppToast } from '@/components/ui/AppToast';
import {
  LayoutProvider,
  OrderProvider,
  SearchProvider,
  ShoppingCartProvider
} from '@/contexts';
import { queryClient } from '@/lib/queryClient';
import appConfig from '@/tamagui/tamagui.config';
import { PortalProvider } from '@tamagui/portal';
import { ToastProvider, ToastViewport } from '@tamagui/toast';
import { QueryClientProvider } from '@tanstack/react-query';
import { Slot } from 'expo-router';

import React, { JSX, memo } from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider, Theme } from 'tamagui';

const AppProviders = memo(({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider config={appConfig}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Theme name="light">
            <PortalProvider shouldAddRootHost={true}>
              <SafeAreaProvider>
                <ToastProvider>
                  <ToastViewport multipleToasts={false}
                    position="absolute"
                    flexDirection="column-reverse"
                    bottom={80}
                    right="$2"
                  />
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
                </ToastProvider>
              </SafeAreaProvider>
            </PortalProvider>
          </Theme>
        </GestureHandlerRootView>
      </TamaguiProvider>
    </QueryClientProvider>
  );
});
const AppContent = memo((): JSX.Element => {
  return (<SideBar>
    <Slot />
  </SideBar>);
});

export default function RootLayout() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}