import { CategoryTree } from '@/components/features/category/CategoryTree';
import { Header, Sidebar } from '@/components/layout';
import { Preloader } from '@/components/preloader/Preloader';
import { StatusMessage } from '@/components/ui/statusmessage/StatusMessage';
import { BreadcrumbProvider, LayoutProvider, PreloaderProvider, ShoppingCartProvider, StatusProvider, ThemeProvider, usePreloader } from '@/contexts';
import { MaterialIcons } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { DrawerActions, NavigationContainer, NavigationIndependentTree, useNavigation } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Tabs } from 'expo-router';
import { JSX, useState } from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Drawer = createDrawerNavigator();

const TabsLayout = () => (
  <Tabs
    screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
    }}>
    <Tabs.Screen
      name="index"
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="home" size={size} color={color} />
        ),
      }}
    />
    <Tabs.Screen
      name="search"
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="search" size={size} color={color} />
        ),
      }}
    />
    <Tabs.Screen
      name="shoppingCart"
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="shopping-cart" size={size} color={color} />
        ),
      }}
    />
    <Tabs.Screen
      name="menu"
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="menu" size={size} color={color} />
        ),
      }}
      listeners={({ navigation }) => ({
        tabPress: (e) => {
          e.preventDefault();
          navigation.getParent()?.dispatch(DrawerActions.toggleDrawer());
        },
      })}
    />
    <Tabs.Screen name="product" options={{ href: null }} />
    <Tabs.Screen name="category" options={{ href: null }} />
    <Tabs.Screen name="checkout" options={{ href: null }} />
  </Tabs>
);

const CustomDrawerContent = (props) => {
  const navigation = useNavigation();

  const handleSelectCategory = (category) => {
    navigation.navigate('category', { id: category.id, name: category.name });
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <CategoryTree onSelect={handleSelectCategory} />
    </DrawerContentScrollView>
  );
}

const DrawerLayout = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    screenOptions={{
      header: () => <Header title="hunde-sport.no" />,
    }}>
    <Drawer.Screen name="Hjem" component={TabsLayout} />
    <Drawer.Screen
      name="ShoppingCart"
      component={TabsLayout}
      initialParams={{ screen: 'shoppingCart' }}
    />
    {/* The following screens are for navigation purposes and won't appear in the drawer */}
    <Drawer.Screen name="category" component={TabsLayout} options={{ drawerItemStyle: { height: 0 } }} />
    <Drawer.Screen name="product" component={TabsLayout} options={{ drawerItemStyle: { height: 0 } }} />
  </Drawer.Navigator>
);

const AppContent = (): JSX.Element => {
  const { appIsReady } = usePreloader();

  if (!appIsReady) {
    return <Preloader />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} >
      <NavigationIndependentTree>
        <NavigationContainer>
          <DrawerLayout />
        </NavigationContainer>
      </NavigationIndependentTree>
      <Sidebar />
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