import { Stack } from "expo-router";
// app/_layout.tsx
import { CategoryProvider } from './contexts/CategoryContext';
import { ProductProvider } from './contexts/ProductContext';

export default function RootLayout() {
  return (
    <CategoryProvider>
      <ProductProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </ProductProvider>
    </CategoryProvider> 
  );
}
