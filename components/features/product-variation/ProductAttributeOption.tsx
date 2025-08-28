import React from "react";

import { ThemedButton, ThemedText, ThemedXStack } from "@/components/ui";
import { THEME_OPTION, THEME_OPTION_SELECTED } from "@/config/app";

import { ProductPriceRange } from "../product/display/ProductPrice";

export const ProductAttributeOption = React.memo(
  ({
    attribute,
    term,
    isSelected,
    label,
    onPress,
    disabled,
    price,
  }: {
    attribute: string;
    term: string;
    isSelected: boolean;
    label: string;
    disabled: boolean;
    onPress?: () => void;
    price?: any;
  }) => {
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
            {price ? <ProductPriceRange productPriceRange={price} /> : null}
          </ThemedXStack>
        </ThemedButton>
      </ThemedXStack>
    );
  }
);
ProductAttributeOption.displayName = "ProductAttributeOption";
