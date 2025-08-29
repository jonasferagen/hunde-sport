// components/ProductVariationSelect.tsx

import { H3 } from "tamagui";

import { ThemedXStack, ThemedYStack } from "@/components/ui";
import { useVariableProduct } from "@/contexts/VariableProductContext";
import { useVariationSelection } from "@/contexts/VariationSelectionContext";

// ProductVariationSelect.tsx
import { ProductAttributeOption } from "./ProductAttributeOption";

export function ProductVariationSelect() {
  const { variableProduct } = useVariableProduct();
  const { selectionView, select } = useVariationSelection();

  return (
    <ThemedXStack split ai="flex-start" gap="$2">
      {variableProduct.attributeOrder.map((attrKey) => {
        const attr = variableProduct.attributes.get(attrKey);
        const label = attr?.label ?? attrKey;

        const state = selectionView.get(attrKey);
        if (!state) return null;

        return (
          <ThemedYStack key={attrKey} f={1}>
            <H3 tt="capitalize" size="$6" mb="$1">
              {label}
            </H3>
            <ThemedYStack w="100%" gap="$2">
              {Array.from(state.variationSetByTerm.entries()).map(
                ([termKey, variationSet]) => {
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
                      variationSet={variationSet} // <-- pass Set
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
