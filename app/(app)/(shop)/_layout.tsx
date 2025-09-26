// app/(app)/(shop)/_layout.tsx
import { StyleSheet } from "react-native";
import { Text } from "tamagui";

import { routes } from "@/config/routes";

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
  //useCanonicalBackHandler();
  return <Text>aaa</Text>;
}
