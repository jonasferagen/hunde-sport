import React from "react";

import { ThemedButton, ThemedText, ThemedXStack } from "@/components/ui";
import { THEME_OPTION, THEME_OPTION_SELECTED } from "@/config/app";
import { useVariableProduct } from "@/contexts/VariableProductContext";
import { useVariationSelection } from "@/contexts/VariationSelectionContext";
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
    variationSet,
  }: {
    attribute: string;
    term: string;
    isSelected: boolean;
    label: string;
    onPress?: () => void;
    variationSet: ReadonlySet<number>;
  }) => {
    const { variationSetForTerm, pricesForIds, availabilityForIds } =
      useVariableProduct();
    const { selectedVariation } = useVariationSelection();

    const globalSetForTerm = React.useMemo(
      () => variationSetForTerm(attribute, term),
      [variationSetForTerm, attribute, term]
    );

    const isImpossible = variationSet.size === 0;
    const disabled = isImpossible;

    const effectiveIds =
      variationSet.size > 0
        ? Array.from(variationSet)
        : selectedVariation
          ? [selectedVariation.id]
          : Array.from(globalSetForTerm);

    const prices = pricesForIds(effectiveIds);
    const availabilities = availabilityForIds(effectiveIds);

    const productAvailability = {
      isInStock: availabilities.some((a) => a.isInStock),
      isOnBackOrder: availabilities.some((a) => a.isOnBackOrder),
      isOnSale: availabilities.some((a) => a.isOnSale),
      isPurchasable: availabilities.some((a) => a.isPurchasable),
    };

    const priceRange = prices.length ? getProductPriceRange(prices) : undefined;

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
