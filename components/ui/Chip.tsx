import type { JSX } from "react";
import type { StackProps } from "tamagui";

import { ThemedText, ThemedXStack } from "@/components/ui/themed";

export const Chip = ({ children, ...props }: StackProps): JSX.Element => {
  const chipContent = (
    <ThemedXStack fs={1} bw={1} bg="$background" p="$3" br="$3" ov="hidden" ai="center" jc="center" gap="$1.5" {...props}>
      <ThemedText fs={1} size="$5" bold>
        {children}
      </ThemedText>
    </ThemedXStack>
  );

  return chipContent;
};
