import { Stack } from "expo-router";
// app/_layout.tsx
import { CategoryProvider } from './contexts/CategoryContext';

export default function RootLayout() {
  return (
    <CategoryProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </CategoryProvider>
  );
}
