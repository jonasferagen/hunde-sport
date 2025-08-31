// components/ProductVariationSelect.tsx

import { H3 } from "tamagui";

import { ThemedXStack, ThemedYStack } from "@/components/ui";

// ProductVariationSelect.tsx

export function ProductCustomizationForm() {
  return (
    <ThemedXStack split ai="flex-start" gap="$2">
      <ThemedYStack f={1}>
        <H3 tt="capitalize" size="$6" mb="$1">
          {"customize"}
        </H3>
      </ThemedYStack>
    </ThemedXStack>
  );
}
