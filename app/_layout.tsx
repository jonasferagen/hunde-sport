import { Prof } from '@/lib/debug/prof';
import { queryClient } from '@/lib/queryClient';
import { appConfig } from '@/tamagui/tamagui.config';

import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { JSX } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { enableFreeze } from 'react-native-screens';
import { TamaguiProvider } from 'tamagui';

enableFreeze(true);



const RootLayout = (): JSX.Element => {

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <TamaguiProvider config={appConfig}>
            <Prof id="stack">
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(app)" />
              </Stack>
            </Prof>
          </TamaguiProvider>
        </SafeAreaView>
      </GestureHandlerRootView>
    </QueryClientProvider >
  );
};

export default RootLayout;
