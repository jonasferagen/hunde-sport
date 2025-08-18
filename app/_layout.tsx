import { ModalHost } from '@/components/features/product/purchase/ModalHost';
import { AppToastProvider } from '@/contexts';
import { queryClient } from '@/lib/queryClient';
import { useModalStore } from '@/stores/modalStore';
import { appConfig } from '@/tamagui/tamagui.config';

import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import React, { JSX } from 'react';
import { Freeze } from 'react-freeze';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { enableFreeze, enableScreens } from 'react-native-screens';
import { PortalProvider, TamaguiProvider } from 'tamagui';

enableScreens(true);
enableFreeze(false);


const RootLayout = (): JSX.Element => {
  const { open, position, snapPoints } = useModalStore(s => ({
    open: s.open,
    position: s.position,
    snapPoints: s.snapPoints,
  }));
  const lastIdx = Math.max(0, snapPoints.length - 1);
  const modalActive = open || position !== lastIdx;

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <TamaguiProvider config={appConfig}>
            <PortalProvider>
              <AppToastProvider>
                <ModalHost />
                <Freeze freeze={modalActive}>
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(app)" />
                  </Stack>
                </Freeze>
              </AppToastProvider>
            </PortalProvider>
          </TamaguiProvider>
        </SafeAreaView>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};

export default RootLayout;
