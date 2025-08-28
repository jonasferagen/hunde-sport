// components/ProductVariationSelect.tsx

import React from "react";
import { H3 } from "tamagui";

import {
  ThemedButton,
  ThemedText,
  ThemedXStack,
  ThemedYStack,
} from "@/components/ui";
import { THEME_OPTION, THEME_OPTION_SELECTED } from "@/config/app";
import type { ProductPrices } from "@/domain/pricing";
import { getProductPriceRange } from "@/domain/pricing";
import {
  buildVariationSelection,
  intersect,
  VariationSelection,
} from "@/domain/Product/helpers/variationSelection";
import { ProductVariation } from "@/domain/Product/ProductVariation";
import { VariableProduct } from "@/domain/Product/VariableProduct";
import { useProductVariations } from "@/hooks/data/Product";

import { ProductPriceRange } from "../product/display";

export type OnSelectPayload = {
  selection: VariationSelection;
  selectedVariation?: ProductVariation;
};

type Props = {
  variableProduct: VariableProduct;
  onSelect?: (payload: OnSelectPayload) => void;
};

export function ProductVariationSelect({ variableProduct, onSelect }: Props) {
  const { isLoading, items: productVariations } =
    useProductVariations(variableProduct);

  // ID → variation
  const byId = React.useMemo(() => {
    const m = new Map<number, ProductVariation>();
    for (const v of productVariations) m.set(v.id, v);
    return m;
  }, [productVariations]);

  const priceRangeForIds = React.useCallback(
    (ids: number[]) => {
      const prices: ProductPrices[] = ids
        .map((id) => byId.get(id)?.prices)
        .filter(Boolean) as ProductPrices[];
      if (prices.length === 0) return undefined;
      return getProductPriceRange(prices);
    },
    [byId]
  );

  if (isLoading) return null;

  return (
    <VariationSelectLogic
      variableProduct={variableProduct}
      byId={byId}
      priceRangeForIds={priceRangeForIds}
      onSelect={onSelect}
    />
  );
}

function VariationSelectLogic({
  variableProduct,
  byId,
  priceRangeForIds,
  onSelect,
}: {
  variableProduct: VariableProduct;
  byId: Map<number, ProductVariation>;
  priceRangeForIds: (
    ids: number[]
  ) => ReturnType<typeof getProductPriceRange> | undefined;
  onSelect?: Props["onSelect"];
}) {
  // selection state = VariationSelection
  const [selection, setSelection] = React.useState<VariationSelection>(() =>
    buildVariationSelection(variableProduct, new Map())
  );

  const select = React.useCallback(
    (attrKey: string, termKey: string | null) => {
      setSelection((prev) => {
        const current = new Map(
          Array.from(prev.entries()).map(([k, v]) => [k, v.selected])
        );
        current.set(attrKey, termKey);
        return buildVariationSelection(variableProduct, current);
      });
    },
    [variableProduct]
  );

  // candidate IDs = intersection of selected terms
  const candidateIds = React.useMemo(() => {
    let ids: Set<number> | null = null;
    for (const state of selection.values()) {
      if (!state.selected) continue;
      const subset = new Set(state.variantsByTerm.get(state.selected) ?? []);
      ids = ids ? intersect(ids, subset) : subset;
      if (ids.size === 0) break;
    }
    if (!ids) return variableProduct.variants.map((v) => v.key);
    return [...ids];
  }, [selection, variableProduct]);

  const selectedVariation =
    candidateIds.length === 1 ? byId.get(candidateIds[0]) : undefined;

  const onSelectRef = React.useRef(onSelect);
  React.useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  React.useEffect(() => {
    onSelectRef.current?.({
      selection,
      selectedVariation,
    });
  }, [selection, selectedVariation, candidateIds]);

  // View: iterate attributes directly
  return (
    <ThemedXStack split ai="flex-start" gap="$2">
      {Array.from(selection.entries()).map(([attrKey, state]) => {
        const attrLabel =
          variableProduct.attributes.get(attrKey)?.label ?? attrKey;

        return (
          <ThemedYStack key={attrKey} f={1}>
            <H3 tt="capitalize" size="$6" mb="$1">
              {attrLabel}
            </H3>
            <ThemedYStack w="100%" gap="$2">
              {Array.from(state.variantsByTerm.entries()).map(
                ([termKey, variantIds]) => {
                  const termLabel =
                    variableProduct.terms.get(termKey)?.label ?? termKey;
                  const enabled = variantIds.length > 0;
                  const isSelected = state.selected === termKey;
                  const onPress = enabled
                    ? () => select(attrKey, isSelected ? null : termKey)
                    : undefined;
                  const price = priceRangeForIds(variantIds) ?? undefined;

                  return (
                    <ThemedXStack
                      key={`${attrKey}:${termKey}`}
                      ai="center"
                      gap="$2"
                      theme={isSelected ? THEME_OPTION_SELECTED : THEME_OPTION}
                    >
                      <ThemedButton
                        size="$4"
                        bw={2}
                        aria-label={termLabel}
                        onPress={onPress}
                        disabled={!enabled}
                      >
                        <ThemedXStack f={1} split>
                          <ThemedXStack gap="$1">
                            <ThemedText>{termLabel}</ThemedText>
                          </ThemedXStack>
                          {price ? (
                            <ProductPriceRange productPriceRange={price} />
                          ) : null}
                        </ThemedXStack>
                      </ThemedButton>
                    </ThemedXStack>
                  );
                }
              )}
            </ThemedYStack>
          </ThemedYStack>
        );
      })}
    </ThemedXStack>
  );
}
