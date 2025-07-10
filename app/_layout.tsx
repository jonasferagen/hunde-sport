import { BreadcrumbProvider } from "@/context/BreadCrumb/BreadcrumbProvider";
import { AppStyles } from "@/styles/AppStyles";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

function Layout() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[AppStyles.appContainer, { marginTop: insets.top }]}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      />
    </View>
  );
}

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
      },
    },
  }));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider style={{ backgroundColor: '#00f' }}>
        <QueryClientProvider client={queryClient}>
          <BreadcrumbProvider>
            <Layout />
          </BreadcrumbProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView >
  );
}
