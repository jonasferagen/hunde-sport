// PageBody.tsx
import React from "react";
import { ScrollView as GHScrollView } from "react-native-gesture-handler";
import type { YStackProps } from "tamagui";

import { ThemedYStack } from "@/components/ui/themed-components";

type SpaceToken = "$1" | "$2" | "$3" | "$4" | "$5" | "none";

interface PageBodyProps extends YStackProps {
  children: React.ReactNode;
  mode?: "scroll" | "static";
  pad?: SpaceToken; // NEW: horizontal padding
}

export const PageBody = React.forwardRef<GHScrollView, PageBodyProps>(
  function PageBody({ children, mode = "static", ...props }, ref) {
    const content = (
      <ThemedYStack box f={1} mih={0} p="none" gap="none" {...props}>
        {children}
      </ThemedYStack>
    );

    return mode === "scroll" ? (
      <GHScrollView
        ref={ref}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 0, // padding only here in scroll mode
         
        }}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
        // iOS-only; helps prevent diagonal conflict
        directionalLockEnabled
        // optional “quiet” feel:
        bounces={false}
        overScrollMode="never"
        scrollEventThrottle={16}
        showsVerticalScrollIndicator
      >
        {content}
      </GHScrollView>
    ) : (
      content
    );
  }
);
