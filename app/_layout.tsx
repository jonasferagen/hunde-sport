import { BreadcrumbProvider } from "@/hooks/BreadCrumb/BreadcrumbProvider";
import { CartProvider } from '@/hooks/Cart/CartProvider';
import { StatusProvider, useStatus } from '@/hooks/Status/StatusProvider';
import { AppStyles } from "@/styles/AppStyles";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
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

function StatusMessage() {
  const { message } = useStatus();
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (message) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [message]);

  if (!message) {
    return null;
  }

  return (
    <Animated.View style={[styles.statusContainer, { opacity: fadeAnim }]}>
      <Text style={styles.statusText}>{message}</Text>
    </Animated.View>
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
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusProvider>
            <BreadcrumbProvider>
              <CartProvider>
                <Layout />
              </CartProvider>
            </BreadcrumbProvider>
            <StatusMessage />
          </StatusProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView >
  );
}

const styles = StyleSheet.create({
  statusContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
