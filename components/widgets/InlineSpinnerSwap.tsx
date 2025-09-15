// components/ui/InlineSpinnerSwap.tsx
import React from "react";

import {
  ThemedSpinner,
  ThemedText,
  ThemedXStack,
} from "@/components/ui/themed";

type Props = {
  loading: boolean;
  children?: React.ReactNode; // usually the final text
  textProps?: React.ComponentProps<typeof ThemedText>;
  spinnerScale?: number;
};

export function InlineSpinnerSwap({
  loading,
  children,
  textProps,
  spinnerScale = 0.7,
}: Props) {
  const reserve =
    loading && (children == null || children === "")
      ? "\u00A0" // NBSP reserves the line-height from ThemedText
      : children;

  return (
    <ThemedXStack ai="center" jc="center" pos="relative">
      {/* Reserve height/metrics with hidden text while loading */}
      <ThemedText tabular o={loading ? 0 : 1} {...textProps}>
        {reserve}
      </ThemedText>

      {loading && (
        <ThemedXStack
          pos="absolute"
          t={0}
          l={0}
          r={0}
          b={0}
          ai="center"
          jc="center"
          pointerEvents="none"
        >
          {/* override default absolute on ThemedSpinner so it centers via parent */}
          <ThemedSpinner pos="relative" scale={spinnerScale} />
        </ThemedXStack>
      )}
    </ThemedXStack>
  );
}
