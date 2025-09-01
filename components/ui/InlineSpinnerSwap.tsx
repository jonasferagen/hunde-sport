// components/ui/InlineSpinnerSwap.tsx
import React from "react";

import { ThemedSpinner, ThemedText, ThemedXStack } from "@/components/ui";

type Props = {
  loading: boolean;
  children: React.ReactNode; // usually text
  textProps?: React.ComponentProps<typeof ThemedText>;
};

export function InlineSpinnerSwap({ loading, children, textProps }: Props) {
  return (
    <ThemedXStack ai="center" pos="relative">
      {/* Reserve the same width with invisible text while loading */}
      <ThemedText tabular o={loading ? 0 : 1} {...textProps}>
        {children}
      </ThemedText>
      {loading && (
        <ThemedXStack pos="absolute" r="$3" ai="center" jc="center">
          <ThemedSpinner />
        </ThemedXStack>
      )}
    </ThemedXStack>
  );
}
