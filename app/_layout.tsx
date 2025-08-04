import {
  AppToastProvider,
  ProductCategoryProvider,
  SearchProvider,
  ShoppingCartProvider,
} from '@/contexts';
import { CartProvider } from '@/contexts/CartContext';
import { queryClient } from '@/lib/queryClient';
import appConfig from '@/tamagui/tamagui.config';
import { PortalProvider } from '@tamagui/portal';
import { QueryClientProvider } from '@tanstack/react-query';
import { Slot } from 'expo-router';
import { JSX } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider, Theme } from 'tamagui';

const RootLayout = (): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <TamaguiProvider config={appConfig}>
          <SafeAreaProvider>
            <PortalProvider>
              <Theme name="light">
                <CartProvider>
                  <AppToastProvider>
                    <ProductCategoryProvider>
                      <ShoppingCartProvider>
                        <SearchProvider>
                          <Slot />
                        </SearchProvider>
                      </ShoppingCartProvider>
                    </ProductCategoryProvider>
                  </AppToastProvider>
                </CartProvider>
              </Theme>
            </PortalProvider>
          </SafeAreaProvider>
        </TamaguiProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};

export default RootLayout;
