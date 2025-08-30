import React from "react";

import {
  ThemedYStack,
  ThemedYStackProps,
} from "@/components/ui/themed-components/ThemedStacks";
import { ThemedText } from "@/components/ui/themed-components/ThemedText";

interface DefaultTextContentProps {
  children: React.ReactNode;
  stackProps?: ThemedYStackProps;
}

export const DefaultTextContent = ({
  stackProps,
  children,
}: DefaultTextContentProps) => {
  return (
    <ThemedYStack f={1} jc="center" ai="center" {...stackProps}>
      <ThemedText size="$5" ta="center">
        {children}
      </ThemedText>
    </ThemedYStack>
  );
};
