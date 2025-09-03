import React from "react";

import { ThemedButton, ThemedText, ThemedXStack } from "@/components/ui";
import { THEME_OPTION, THEME_OPTION_SELECTED } from "@/config/app";
import type { Variation } from "@/domain/product/helpers/types";

type Props = {
  attribute: string;
  term: string;
  isSelected: boolean;
  label: string;
  onPress?: () => void;
  variations: Variation[];
};

export const ProductAttributeOption = React.memo(
  ({ attribute, term, isSelected, label, onPress, variations }: Props) => {
    const isImpossible = variations.length === 0;
    const disabled = isImpossible;

    return (
      <ThemedXStack
        key={`${attribute}:${term}`}
        ai="center"
        gap="$2"
        theme={isSelected ? THEME_OPTION_SELECTED : THEME_OPTION}
      >
        <ThemedButton
          size="$4"
          bw={2}
          aria-label={label}
          aria-pressed={isSelected}
          onPress={onPress}
          disabled={disabled}
        >
          <ThemedXStack f={1} split>
            <ThemedXStack gap="$1">
              <ThemedText>{label}</ThemedText>
            </ThemedXStack>
            <ThemedXStack gap="$1">
              <ThemedText>{label}</ThemedText>
            </ThemedXStack>
          </ThemedXStack>
        </ThemedButton>
      </ThemedXStack>
    );
  }
);
ProductAttributeOption.displayName = "ProductAttributeOption";
