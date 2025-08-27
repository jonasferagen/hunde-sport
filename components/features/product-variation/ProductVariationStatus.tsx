import React from "react";

import { ThemedText, ThemedXStack } from "@/components/ui";
import { TermSelection } from "@/stores/useProductVariationStore";

type Props = React.ComponentProps<typeof ThemedText> & {
  storeSelection: TermSelection;
};

export const ProductVariationStatus: React.FC<Props> = ({
  storeSelection,
  ...textProps
}) => {
  return (
    <ThemedXStack gap="$2">
      {Array.from(storeSelection.entries()).map(([taxonomyName, term]) => (
        <ThemedXStack key={taxonomyName} gap="$1">
          <ThemedText fos="$3" tt="capitalize" height="auto" {...textProps}>
            {term ? `${term.taxonomy.label}:` : ""}
          </ThemedText>
          <ThemedText bold fos="$4" tt="capitalize" {...textProps}>
            {term?.label ?? ""}
          </ThemedText>
        </ThemedXStack>
      ))}
    </ThemedXStack>
  );
};
