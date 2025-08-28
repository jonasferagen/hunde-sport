// ProductVariationSelect.tsx
import React from "react";
import { H3 } from "tamagui";
import { useShallow } from "zustand/react/shallow";

import {
  ThemedButton,
  ThemedText,
  ThemedXStack,
  ThemedYStack,
} from "@/components/ui/themed-components";
import { THEME_OPTION, THEME_OPTION_SELECTED } from "@/config/app";
import { ProductAttributeHelper } from "@/domain/Product/ProductAttributeHelper";
import { useVariableProductStore } from "@/stores/useProductVariationStore";

import { ProductPriceRange } from "../product/display/ProductPrice";

export function ProductVariationSelect() {
  const { product, options, selection, select, priceRangeForIds } =
    useVariableProductStore(
      useShallow((s) => ({
        product: s.product,
        options: s.options,
        selection: s.selection,
        select: s.select,
        priceRangeForIds: s.priceRangeForIds,
      }))
    );

  const flagged = React.useMemo(
    () => ProductAttributeHelper.withEnabled(options, selection),
    [options, selection]
  );

  const taxonomies = React.useMemo(
    () => Array.from((product?.taxonomies ?? new Map()).values()),
    [product]
  );
  if (!product) return null;
  return (
    <ThemedXStack split ai="flex-start" gap="$2">
      {taxonomies.map((tax) => {
        const selected = selection.get(tax.name) ?? null;
        const optionsInTax = flagged.filter(
          (o) => o.term.taxonomy.name === tax.name && o.variationIds.length > 0
        );

        return (
          <ThemedYStack key={tax.name} f={1}>
            <H3 tt="capitalize" size="$6" mb="$1">
              {tax.label}
            </H3>
            <ThemedYStack w="100%" gap="$2">
              {optionsInTax.map((opt) => {
                const { term, enabled = true } = opt;
                const isSelected =
                  !!selected &&
                  selected.slug === term.slug &&
                  selected.taxonomy.name === term.taxonomy.name;

                const onPress = enabled
                  ? () => select(term.taxonomy.name, isSelected ? null : term)
                  : undefined;

                const price = priceRangeForIds(opt.variationIds) ?? undefined;

                return (
                  <ThemedXStack
                    key={`${tax.name}:${term.slug}`}
                    ai="center"
                    gap="$2"
                    theme={isSelected ? THEME_OPTION_SELECTED : THEME_OPTION}
                  >
                    <ThemedButton
                      size="$4"
                      bw={2}
                      aria-label={term.label}
                      onPress={onPress}
                      disabled={!enabled}
                    >
                      <ThemedXStack f={1} split>
                        <ThemedXStack gap="$1">
                          <ThemedText>{term.label}</ThemedText>
                        </ThemedXStack>
                        {price ? (
                          <ProductPriceRange productPriceRange={price} />
                        ) : null}
                      </ThemedXStack>
                    </ThemedButton>
                  </ThemedXStack>
                );
              })}
            </ThemedYStack>
          </ThemedYStack>
        );
      })}
    </ThemedXStack>
  );
}
