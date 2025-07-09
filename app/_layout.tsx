import { Stack } from "expo-router";
import { View } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BreadcrumbProvider } from "./contexts/BreadcrumbContext";
import { CategoryProvider } from './contexts/CategoryContext';
import { ProductProvider } from './contexts/ProductContext';
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
        <CategoryProvider>
          <ProductProvider>
            <Layout />
          </ProductProvider>
        </CategoryProvider>
      </BreadcrumbProvider>
    </SafeAreaProvider>
  );
}
