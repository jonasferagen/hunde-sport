import { ModalHost } from '@/components/features/product/purchase/ModalHost';
import { AppToastProvider } from '@/contexts';
import { queryClient } from '@/lib/queryClient';
import appConfig from '@/tamagui/tamagui.config';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { enableFreeze, enableScreens } from 'react-native-screens';
import { PortalProvider, TamaguiProvider } from 'tamagui';


enableScreens(true);
enableFreeze(true);


const RootLayout = () => {
  // useFonts
  const [fontsLoaded] = useFonts({
    Inter: require('@/assets/fonts/Inter/Inter-Regular.ttf'),
    'Inter-Bold': require('@/assets/fonts/Inter/Inter-Bold.ttf'),
    Montserrat: require('@/assets/fonts/Montserrat/Montserrat-Regular.ttf'),
    'Montserrat-Bold': require('@/assets/fonts/Montserrat/Montserrat-Bold.ttf'),
  });


  if (!fontsLoaded) return null;
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <TamaguiProvider config={appConfig}>
            <PortalProvider>
              <AppToastProvider>
                <ModalHost />
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(app)" />
                </Stack>
              </AppToastProvider>
            </PortalProvider>
          </TamaguiProvider>
        </SafeAreaView>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};

export default RootLayout;
