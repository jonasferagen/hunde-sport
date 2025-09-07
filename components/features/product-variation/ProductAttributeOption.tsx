// components/features/product-variation/ProductAttributeOption.tsx
import React from "react";

import { ProductPriceRange } from "@/components/features/product/display/ProductPrice";
import { ThemedButton, ThemedText, ThemedXStack } from "@/components/ui";
import { THEME_OPTION, THEME_OPTION_SELECTED } from "@/config/app";
import type { ProductPriceRange as ProductPriceRangeT } from "@/domain/pricing/types";
import type { Term } from "@/domain/product";
type Props = {
  term: Term;
  label: string;
  isSelected: boolean;
  disabled?: boolean;
  productPriceRange: ProductPriceRangeT | null;
  onPress?: () => void;
};

export const ProductAttributeOption = React.memo(
  ({
    isSelected,
    productPriceRange,
    label,
    disabled = false,
    onPress,
  }: Props) => {
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
            {productPriceRange && (
              <ProductPriceRange productPriceRange={productPriceRange} />
            )}
          </ThemedXStack>
        </ThemedButton>
      </ThemedXStack>
    );
  }
);
ProductAttributeOption.displayName = "ProductAttributeOption";
