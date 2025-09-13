// PageView.tsx
import { useIsFocused } from "@react-navigation/native";
import React from "react";
import type { YStackProps } from "tamagui";

import { BottomBarInset } from "@/components/chrome/BottomBarInset";
import { ThemedYStack } from "@/components/ui/themed";

export const PageView = React.memo(function PageView({ children, ...stackProps }: YStackProps) {
  const isFocused = useIsFocused();

  return (
    <ThemedYStack f={1} gap="none" style={{ opacity: isFocused ? 1 : 0 }} {...stackProps}>
      {children}
      <BottomBarInset />
    </ThemedYStack>
  );
});
