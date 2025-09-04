// components/features/product-variation/ProductAttributeOption.tsx
import React from "react";

import { ThemedButton, ThemedText, ThemedXStack } from "@/components/ui";
import { THEME_OPTION, THEME_OPTION_SELECTED } from "@/config/app";
import type { Term } from "@/domain/product/helpers/types";

type Props = {
  term: Term;
  label: string;
  isSelected: boolean;
  disabled?: boolean;
  onPress?: () => void;
};

export const ProductAttributeOption = React.memo(
  ({ isSelected, label, disabled = false, onPress }: Props) => {
    return (
      <ThemedXStack
        ai="center"
        gap="$2"
        theme={isSelected ? THEME_OPTION_SELECTED : THEME_OPTION}
      >
        <ThemedButton
          size="$4"
          bw={2}
          aria-label={label}
          aria-pressed={isSelected}
          aria-disabled={disabled}
          disabled={disabled}
          onPress={onPress}
        >
          <ThemedXStack f={1} jc="space-between" gap="$2">
            <ThemedText>{label}</ThemedText>
          </ThemedXStack>
        </ThemedButton>
      </ThemedXStack>
    );
  }
);
ProductAttributeOption.displayName = "ProductAttributeOption";
