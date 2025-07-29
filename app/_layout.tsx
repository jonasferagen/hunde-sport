import { BottomBar } from '@/components/menu/BottomBar';
import { SideBar } from '@/components/menu/SideBar';
import { AppToast } from '@/components/ui/AppToast';
import {
  LayoutProvider,
  SearchProvider,
  ShoppingCartProvider
} from '@/contexts';
import { queryClient } from '@/lib/queryClient';
import appConfig from '@/tamagui/tamagui.config';
import { PortalProvider } from '@tamagui/portal';
import { ToastProvider, ToastViewport } from '@tamagui/toast';
import { QueryClientProvider } from '@tanstack/react-query';

import React, { JSX } from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider, Theme } from 'tamagui';


const RootLayout = (): JSX.Element =>
  <QueryClientProvider client={queryClient}>
    <TamaguiProvider config={appConfig}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Theme name="light">
          <PortalProvider>
            <SafeAreaProvider>
              <ToastProvider>
                <AppToast />
                <ToastViewport
                  multipleToasts={false}
                  bottom={0}
                  left={0}
                  position="absolute"
                  height="50"
                  width="100%"
                />
                <ShoppingCartProvider>
                  <SearchProvider>
                    <LayoutProvider>
                      <SideBar />
                      <BottomBar />
                    </LayoutProvider>
                  </SearchProvider>
                </ShoppingCartProvider>
              </ToastProvider>
            </SafeAreaProvider>
          </PortalProvider>
        </Theme>
      </GestureHandlerRootView>
    </TamaguiProvider>
  </QueryClientProvider >

export default RootLayout;
