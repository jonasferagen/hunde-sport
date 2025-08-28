import React from "react";

import { ThemedButton, ThemedText, ThemedXStack } from "@/components/ui";
import { THEME_OPTION, THEME_OPTION_SELECTED } from "@/config/app";
import { useVariableProductInfoCtx } from "@/contexts/VariableProductInfoContext";
import { getProductPriceRange } from "@/domain/pricing";

import {
  ProductAvailabilityStatus,
  ProductPriceRange,
} from "../product/display";

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
    const { pricesForIds, availabilityForIds } = useVariableProductInfoCtx();

    const prices = pricesForIds(variantIds);
    const availabilities = availabilityForIds(variantIds);

    const productAvailability = {
      isInStock: availabilities.some((a) => a.isPurchasable),
      isOnBackOrder: availabilities.some((a) => a.isOnBackOrder),
      isOnSale: availabilities.some((a) => a.isOnSale),
      isPurchasable: availabilities.some((a) => a.isPurchasable),
    };

    // derive min/max if needed
    const priceRange = prices.length ? getProductPriceRange(prices) : undefined;
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
              <ProductAvailabilityStatus
                productAvailability={productAvailability}
                short
              />
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
