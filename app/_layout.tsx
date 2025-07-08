import { Stack } from "expo-router";
import { View } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
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
        }}
      />
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <CategoryProvider>
        <ProductProvider>
          <Layout />
        </ProductProvider>
      </CategoryProvider>
    </SafeAreaProvider>
  );
}
