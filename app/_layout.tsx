import { CategoryTree } from '@/components/features/category/CategoryTree';
import { Preloader } from '@/components/preloader/Preloader';
import { StatusMessage } from '@/components/ui/statusmessage/StatusMessage';
import {
  BreadcrumbProvider,
  LayoutProvider,
  PreloaderProvider,
  ShoppingCartProvider,
  StatusProvider,
  ThemeProvider,
  usePreloader,
  useTheme
} from '@/contexts';
import { FONT_FAMILY, FONT_SIZES } from '@/styles';
import { MaterialIcons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { Drawer } from 'expo-router/drawer';
import { JSX, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const CustomDrawerContent = (props: any) => {
  const { theme } = useTheme();

  return (
    <DrawerContentScrollView {...props}>
      <View style={{ alignItems: 'flex-end', paddingRight: 15, paddingTop: 15, paddingBottom: 10 }}>
        <TouchableOpacity onPress={() => props.navigation.closeDrawer()}>
          <MaterialIcons name="close" size={30} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
      <DrawerItemList {...props} />
      <CategoryTree />
    </DrawerContentScrollView>
  );
}

const DrawerLayout = () => {
  const { theme } = useTheme();

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerTitleAlign: 'center',
        headerBackground: () => (
          <LinearGradient
            colors={theme.gradients.primary}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        ),
        headerTitleStyle: {
          color: theme.colors.text,
          fontFamily: FONT_FAMILY.bold,
          fontSize: FONT_SIZES.lg,
        },
        headerTintColor: theme.colors.text,
        headerShadowVisible: false,
        headerTitle: 'HundeSport.no',
      }}>
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: 'Hjem',
        }}
      />
      <Drawer.Screen
        name="_shoppingCart"
        options={{
          title: 'Handlekurv',
        }}
      />
    </Drawer>
  );
}

const AppContent = (): JSX.Element => {
  const { appIsReady } = usePreloader();

  if (!appIsReady) {
    return <Preloader />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} >
      <DrawerLayout />
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