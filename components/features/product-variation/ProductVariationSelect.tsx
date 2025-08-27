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
import { ProductAttributeTerm as Term } from "@/domain/Product/ProductAttribute";
import { ProductAttributeHelper } from "@/domain/Product/ProductAttributeHelper";
import {
  TermOption,
  TermOptionGroup,
  useGroups,
  useVariableProductStore,
} from "@/stores/useProductVariationStore";
import type { ProductAttributeTaxonomy as Taxonomy } from "@/types";

import { ProductPriceRange } from "../product/display/ProductPrice";

export function ProductVariationSelect() {
  const { options, selection, select, priceRangeForIds } =
    useVariableProductStore(
      useShallow((s) => ({
        options: s.options,
        selection: s.selection,
        select: s.select,
        priceRangeForIds: s.priceRangeForIds,
      }))
    );

  // add enabled flags based on current selection
  const flagged = React.useMemo(
    () => ProductAttributeHelper.withEnabled(options, selection),
    [options, selection]
  );

  // ordered unique taxonomies (objects with name + label)
  const taxonomies: Taxonomy[] = React.useMemo(() => {
    const seen = new Set<string>();
    const out: Taxonomy[] = [];
    for (const o of flagged) {
      const t = o.term.taxonomy;
      if (!seen.has(t.name)) {
        seen.add(t.name);
        out.push(t);
      }
    }
    return out;
  }, [flagged]);

  if (taxonomies.length === 0) return null;

  return (
    <ThemedXStack split ai="flex-start" gap="$2">
      {taxonomies.map((taxonomy) => {
        const selected = selection.get(taxonomy.name) ?? null;
        const optionsInTax = flagged.filter(
          (o) =>
            o.term.taxonomy.name === taxonomy.name && o.variationIds.length > 0
        );

        return (
          <ThemedYStack key={taxonomy.name} f={1}>
            <H3 tt="capitalize" size="$6" mb="$1">
              {taxonomy.label} {/* <-- real label */}
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
                    key={`${taxonomy.name}:${term.slug}`}
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
