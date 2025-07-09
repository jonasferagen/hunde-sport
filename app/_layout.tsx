import { Stack } from "expo-router";
import { View } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BreadcrumbProvider } from "./contexts/BreadcrumbContext/BreadcrumbProvider";
import { ProductProvider } from './contexts/Product/ProductContext';
import { ProductCategoryProvider } from './contexts/ProductCategory/ProductCategoryContext';
import { AppStyles } from "./theme";


function Layout() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[AppStyles.container, { marginTop: insets.top }]}>
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
  return (
    <SafeAreaProvider>
      <BreadcrumbProvider>
        <ProductCategoryProvider>
          <ProductProvider>
            <Layout />
          </ProductProvider>
        </ProductCategoryProvider>
      </BreadcrumbProvider>
    </SafeAreaProvider>
  );
}
