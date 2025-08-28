// components/ProductVariationSelect.tsx

import React from "react";
import { H3 } from "tamagui";

import { ThemedXStack, ThemedYStack } from "@/components/ui";
import { useVariableProductInfo } from "@/domain/pricing";
import { ProductVariation } from "@/domain/Product/ProductVariation";
import {
  createVariationSelectionBuilder,
  intersect,
  VariationSelection,
} from "@/domain/Product/Purchasable";
import { VariableProduct } from "@/domain/Product/VariableProduct";

import { ProductAttributeOption } from "./ProductAttributeOption";

/* ------------------------- Context (in-file) ------------------------- */

type InfoCtx = ReturnType<typeof useVariableProductInfo>;
const VariableProductInfoContext = React.createContext<InfoCtx | null>(null);

export function VariableProductInfoProvider({
  variableProduct,
  children,
}: {
  variableProduct: VariableProduct;
  children: React.ReactNode;
}) {
  const info = useVariableProductInfo(variableProduct);
  if (info.isLoading) return null; // or a skeleton
  return (
    <VariableProductInfoContext.Provider value={info}>
      {children}
    </VariableProductInfoContext.Provider>
  );
}

export function useVariableProductInfoCtx(): InfoCtx {
  const ctx = React.useContext(VariableProductInfoContext);
  if (!ctx)
    throw new Error(
      "useVariableProductInfoCtx must be used inside VariableProductInfoProvider"
    );
  return ctx;
}

/* ------------------------- Public component ------------------------- */

export type OnSelectPayload = {
  selection: VariationSelection;
  selectedVariation?: ProductVariation;
};

type Props = {
  variableProduct: VariableProduct;
  onSelect?: (payload: OnSelectPayload) => void;
};

export function ProductVariationSelect({ variableProduct, onSelect }: Props) {
  return (
    <VariableProductInfoProvider variableProduct={variableProduct}>
      <VariationSelectLogic
        variableProduct={variableProduct}
        onSelect={onSelect}
      />
    </VariableProductInfoProvider>
  );
}

/* ------------------------- Logic ------------------------- */

function VariationSelectLogic({
  variableProduct,
  onSelect,
}: {
  variableProduct: VariableProduct;
  onSelect?: Props["onSelect"];
}) {
  const { byId } = useVariableProductInfoCtx();

  const selBuilder = React.useMemo(
    () => createVariationSelectionBuilder(variableProduct),
    [variableProduct]
  );

  const [selection, setSelection] = React.useState<VariationSelection>(() =>
    selBuilder(new Map())
  );

  const select = React.useCallback(
    (attrKey: string, termKey: string | null) => {
      setSelection((prev) => {
        const current = new Map(
          Array.from(prev.entries()).map(([k, v]) => [k, v.selected])
        );
        current.set(attrKey, termKey);
        return selBuilder(current);
      });
    },
    [selBuilder]
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

  // stable onSelect
  const onSelectRef = React.useRef(onSelect);
  React.useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  // notify only on real change
  const lastSigRef = React.useRef("");
  React.useEffect(() => {
    const sig = JSON.stringify({
      sel: Array.from(selection.entries()).map(([k, v]) => [k, v.selected]),
      vid: selectedVariation?.id ?? null,
    });
    if (sig !== lastSigRef.current) {
      lastSigRef.current = sig;
      onSelectRef.current?.({ selection, selectedVariation });
    }
  }, [selection, selectedVariation]);

  // View: iterate attributes directly; options will read pricing from context
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
                  const isSelected = state.selected === termKey;
                  const onPress = () =>
                    select(attrKey, isSelected ? null : termKey);

                  return (
                    <ProductAttributeOption
                      key={`${attrKey}:${termKey}`}
                      attribute={attrKey}
                      term={termKey}
                      isSelected={isSelected}
                      label={termLabel}
                      onPress={onPress}
                      variantIds={variantIds} // price range computed inside option via context
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

/* ------------------------- Note for ProductAttributeOption -------------------------

In ProductAttributeOption.tsx, consume the context to compute price range
"as late as possible":

import { useVariableProductInfoCtx } from "./ProductVariationSelect";

const { priceRangeForIds } = useVariableProductInfoCtx();

const priceRange = React.useMemo(
  () => (variantIds.length ? priceRangeForIds(variantIds) : undefined),
  [variantIds, priceRangeForIds]
);

--------------------------------------------------------------------------- */
