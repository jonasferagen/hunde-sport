import { Stack } from "expo-router";
import { StyleSheet } from "react-native";

import { routes } from "@/config/routes";
import { useCanonicalBackHandler } from "@/hooks/useCanonicalNavigation";

const screenOptions = { headerShown: false } as const;

// stable style object
const CONTENT = StyleSheet.create({
  transparent: { backgroundColor: "transparent" },
});

// build one options object per route (no JSX literals later)
const ROUTE_OPTIONS: Record<string, { title: string; contentStyle: any }> = {};
for (const r of Object.values(routes)) {
  ROUTE_OPTIONS[r.name] = {
    title: r.label,
    contentStyle: CONTENT.transparent,
  } as const;
}

export default function ShopLayout() {
  useCanonicalBackHandler();

  return (
    <>
      <Stack screenOptions={screenOptions}>
        {Object.values(routes).map((route) => (
          <Stack.Screen
            key={route.name}
            name={route.name}
            options={ROUTE_OPTIONS[route.name]} // stable reference
          />
        ))}
      </Stack>
    </>
  );
}
