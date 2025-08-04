import { AppToast } from '@/components/ui/AppToast';
import {
  CategoryProvider,
  SearchProvider,
  ShoppingCartProvider,
} from '@/contexts';
import { queryClient } from '@/lib/queryClient';
import appConfig from '@/tamagui/tamagui.config';
import { PortalProvider } from '@tamagui/portal';
import { ToastProvider, ToastViewport } from '@tamagui/toast';
import { QueryClientProvider } from '@tanstack/react-query';
import { Slot } from 'expo-router';
import { JSX } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider, Theme } from 'tamagui';

const RootLayout = (): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider config={appConfig}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <PortalProvider>
              <Theme name="light">
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
                  <CategoryProvider>
                    <ShoppingCartProvider>
                      <SearchProvider>
                        <Slot />
                      </SearchProvider>
                    </ShoppingCartProvider>
                  </CategoryProvider>
                </ToastProvider>
              </Theme>
            </PortalProvider>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </TamaguiProvider>
    </QueryClientProvider>
  );
};

export default RootLayout;
