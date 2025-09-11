// components/features/product-variation/ProductAttributeOption.tsx
import React from "react";

import { ProductPriceRange } from "@/components/features/product/display/ProductPrice";
import {
  ThemedButton,
  ThemedText,
  ThemedXStack,
} from "@/components/ui/themed-components";
import { THEME_OPTION, THEME_OPTION_SELECTED } from "@/config/app";
import { PriceBook } from "@/domain/pricing/PriceBook";
import type { ProductVariation, Term } from "@/domain/product";

type Props = {
  term: Term;
  label: string;
  isSelected: boolean;
  disabled?: boolean;
  productVariations: ProductVariation[];
  onPress?: () => void;
};

export const ProductAttributeOption = React.memo(
  ({
    isSelected,
    productVariations,
    label,
    disabled = false,
    onPress,
  }: Props) => {
    const productPriceRange =
      productVariations.length > 0
        ? PriceBook.getProductPriceRange(
            productVariations.map((v) => v.priceBook)
          )
        : null;

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
