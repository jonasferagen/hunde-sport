import { BottomBar } from '@/components/menu/BottomBar';
import { SideBar } from '@/components/menu/SideBar';
import { AppToast } from '@/components/ui/AppToast';
import {
  CategoryProvider,
  LayoutProvider,
  SearchProvider,
  ShoppingCartProvider
} from '@/contexts';
import { queryClient } from '@/lib/queryClient';
import appConfig from '@/tamagui/tamagui.config';
import { PortalProvider } from '@tamagui/portal';
import { ToastProvider, ToastViewport } from '@tamagui/toast';
import { QueryClientProvider } from '@tanstack/react-query';

import { useCategories } from '@/hooks/data/Category';
import { useCategoryStore } from '@/stores/CategoryStore';
import React, { JSX, useEffect } from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider, Theme } from 'tamagui';

const AppSetup = ({ children }: { children: React.ReactNode }) => {
  const { items, isLoading } = useCategories({ autoload: true });
  const { setCategories, setIsLoading } = useCategoryStore();

  useEffect(() => {
    setCategories(items);
  }, [items, setCategories]);

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading]);

  return <>{children}</>;
};

const RootLayout = (): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppSetup>
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
                    <CategoryProvider categoryId={0}>
                      <ShoppingCartProvider>
                        <SearchProvider>
                          <LayoutProvider>
                            <SideBar />
                            <BottomBar />
                          </LayoutProvider>
                        </SearchProvider>
                      </ShoppingCartProvider>
                    </CategoryProvider>
                  </ToastProvider>
                </SafeAreaProvider>
              </PortalProvider>
            </Theme>
          </GestureHandlerRootView>
        </TamaguiProvider>
      </AppSetup>
    </QueryClientProvider >
  );
}

export default RootLayout;
