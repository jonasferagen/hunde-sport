import React from "react";

import { ThemedButton, ThemedText, ThemedXStack } from "@/components/ui";
import { THEME_OPTION, THEME_OPTION_SELECTED } from "@/config/app";

import { ProductPriceRange } from "../product/display";
import { useVariableProductInfoCtx } from "./ProductVariationSelect";

export const ProductAttributeOption = React.memo(
  ({
    attribute,
    term,
    isSelected,
    label,
    onPress,
    variantIds,
  }: {
    attribute: string;
    term: string;
    isSelected: boolean;
    label: string;
    onPress?: () => void;
    variantIds: number[];
  }) => {
    const { priceRangeForIds } = useVariableProductInfoCtx();

    const priceRange = React.useMemo(
      () => (variantIds.length ? priceRangeForIds(variantIds) : undefined),
      [variantIds, priceRangeForIds]
    );

    const disabled = !priceRange;
    if (!priceRange) {
      return null;
    }

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
              {priceRange && (
                <ProductPriceRange productPriceRange={priceRange} />
              )}
            </ThemedXStack>
          </ThemedXStack>
        </ThemedButton>
      </ThemedXStack>
    );
  }
);
ProductAttributeOption.displayName = "ProductAttributeOption";
