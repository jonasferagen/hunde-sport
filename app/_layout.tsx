import { BottomMenu } from '@/components/layout/BottomMenu';
import { Preloader } from '@/components/preloader/Preloader';
import { StatusMessage } from '@/components/ui/statusmessage/StatusMessage';
import { BreadcrumbProvider, LayoutProvider, PreloaderProvider, ShoppingCartProvider, StatusProvider, ThemeProvider, useLayout, usePreloader, useTheme } from '@/contexts';
import { createAppStyles } from "@/styles/AppStyles";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot } from "expo-router";
import { JSX, useState } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';


const AppContainer = ({ insets, theme, children }: any) => (
  <View style={[createAppStyles(theme).appContainer, { marginTop: insets.top }]}>
    {children}
  </View>
);


const Layout = (): JSX.Element => {
  const { insets } = useLayout();
  const { theme } = useTheme();
  return (
    <AppContainer insets={insets} theme={theme}>
      <Slot />
      <BottomMenu />
    </AppContainer>
  );
}


const AppContent = (): JSX.Element => {
  const { appIsReady } = usePreloader();

  if (!appIsReady) {
    return <Preloader />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} >
      <Layout />
      <StatusMessage />
    </GestureHandlerRootView>
  );
}

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
      },
    },
  }));

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusProvider>
          <BreadcrumbProvider>
            <ShoppingCartProvider>
              <PreloaderProvider>
                <LayoutProvider>
                  <ThemeProvider>
                    {children}
                  </ThemeProvider>
                </LayoutProvider>
              </PreloaderProvider>
            </ShoppingCartProvider>
          </BreadcrumbProvider>
        </StatusProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

export const RootLayout = () => {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}

export default RootLayout;