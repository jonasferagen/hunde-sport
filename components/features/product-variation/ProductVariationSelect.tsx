// components/ProductVariationSelect.tsx

import React from "react";
import { H3 } from "tamagui";

import { ThemedXStack, ThemedYStack } from "@/components/ui";
import type { ProductPrices } from "@/domain/pricing";
import { getProductPriceRange } from "@/domain/pricing";
import { ProductVariation } from "@/domain/Product/ProductVariation";
import {
  buildVariationSelection,
  intersect,
  VariationSelection,
} from "@/domain/Product/Purchasable";
import { VariableProduct } from "@/domain/Product/VariableProduct";
import { useProductVariations } from "@/hooks/data/Product";

import { ProductAttributeOption } from "./ProductAttributeOption";

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
                  const onPress = () =>
                    select(attrKey, isSelected ? null : termKey);

                  const price = priceRangeForIds(variantIds) ?? undefined;

                  return (
                    <ProductAttributeOption
                      key={`${attrKey}:${termKey}`}
                      attribute={attrKey}
                      term={termKey}
                      isSelected={isSelected}
                      enabled={enabled}
                      label={termLabel}
                      onPress={onPress}
                      price={price}
                    />
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
