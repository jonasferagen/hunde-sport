import React from "react";

import { ThemedButton, ThemedText, ThemedXStack } from "@/components/ui";
import { THEME_OPTION, THEME_OPTION_SELECTED } from "@/config/app";
import { useVariableProduct } from "@/contexts/VariableProductContext";
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
    variationIds,
    fallbackVariationId,
  }: {
    attribute: string;
    term: string;
    isSelected: boolean;
    label: string;
    onPress?: () => void;
    variationIds: number[];
    fallbackVariationId: number;
  }) => {
    const effectiveIds =
      variationIds.length > 0
        ? variationIds
        : fallbackVariationId
          ? [fallbackVariationId]
          : [];

    const { pricesForIds, availabilityForIds } = useVariableProduct();

    const prices = pricesForIds(effectiveIds);
    const availabilities = availabilityForIds(effectiveIds);

    const productAvailability = {
      isInStock: availabilities.some((a) => a.isInStock), // fix
      isOnBackOrder: availabilities.some((a) => a.isOnBackOrder),
      isOnSale: availabilities.some((a) => a.isOnSale),
      isPurchasable: availabilities.some((a) => a.isPurchasable),
    };

    // derive min/max if needed
    const priceRange = prices.length ? getProductPriceRange(prices) : undefined;
    const disabled = variationIds.length === 0; // ||
    //  !productAvailability.isPurchasable ||
    //  !priceRange;

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
