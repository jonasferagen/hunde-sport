// PageView.tsx
// Memoized backdrop so PageView re-renders don't recompute gradient math
import { useIsFocused } from "@react-navigation/native";
import React from "react";
import type { YStackProps } from "tamagui";

import { BottomInsetSpacer } from "@/components/menu/CustomBottomBar";
import { ThemedLinearGradient, ThemedYStack } from "@/components/ui";

const PageBackdrop = React.memo(function PageBackdrop({
  token = "background",
}: {
  token?: string;
}) {
  return <ThemedLinearGradient token={token} />;
});

type PageViewProps = YStackProps & {
  withGradient?: boolean;
  gradientToken?: string;
};

export const PageView = React.memo(function PageView({
  children,
  withGradient = false,
  gradientToken = "background",
  ...stackProps
}: PageViewProps) {
  const isFocused = useIsFocused();

  return (
    <ThemedYStack
      f={1}
      gap="none"
      style={{ opacity: isFocused ? 1 : 0 }}
      {...stackProps}
    >
      {withGradient ? <PageBackdrop token={gradientToken} /> : null}
      {children}
      <BottomInsetSpacer />
    </ThemedYStack>
  );
});

//
