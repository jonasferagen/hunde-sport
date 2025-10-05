// components/features/product-variation/ProductAttributeOption.tsx
import React from "react";

import { ProductPrice } from "@/components/features/product/ui/ProductPrice";
import { ThemedButton, ThemedText, ThemedXStack } from "@/components/ui/themed";
import { THEME_OPTION, THEME_OPTION_SELECTED } from "@/config/app";
import type { ProductVariation, Term } from "@/domain/product";

type ProductAttributeOptionProps = {
  term: Term;
  label: string;
  isSelected: boolean;
  disabled?: boolean;
  productVariations: ProductVariation[];
  onPress?: () => void;
};

export const ProductAttributeOption = React.memo(
  function ProductAttributeOption({
    isSelected,
    productVariations,
    label,
    disabled = false,
    onPress,
  }: ProductAttributeOptionProps) {
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
            <ProductPrice productVariations={productVariations} />
          </ThemedXStack>
        </ThemedButton>
      </ThemedXStack>
    );
  },
);

ProductAttributeOption.displayName = "ProductAttributeOption";
