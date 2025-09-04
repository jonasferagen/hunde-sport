// components/ProductVariationSelect.tsx
import { H3 } from "tamagui";

import { ProductAttributeOption } from "@/components/features/product-variation/ProductAttributeOption";
import { ThemedXStack, ThemedYStack } from "@/components/ui";
import { useVariableProduct } from "@/contexts/VariableProductContext";
import type { AttributeSelection, Term } from "@/domain/product/helpers/types";

type Props = {
  onSelect: (attrKey: string, term: Term | undefined) => void;
  attributeSelection: AttributeSelection;
};

export function ProductVariationSelect({
  onSelect,
  attributeSelection,
}: Props) {
  const { variableProduct } = useVariableProduct();

  return (
    <ThemedXStack split ai="flex-start" gap="$2">
      {[...variableProduct.attributes].map(([attrKey, attribute]) => {
        const terms = variableProduct.getTermsByAttribute(attrKey);
        const { selectedTerm, otherSelectedTerm } =
          attributeSelection.current(attrKey);

        return (
          <ThemedYStack key={attrKey} f={1} gap="$2">
            <H3 tt="capitalize" size="$6" mb="$1">
              {attribute.label}
            </H3>
            {Array.from(terms).map((term: Term) => {
              const isSelected = selectedTerm?.key === term.key;
              const termVariations = variableProduct.getVariationsByTerm(
                term.key
              );

              const disabled = (() => {
                // If no other attribute is selected, term is enabled if it has any variations
                if (!otherSelectedTerm) {
                  return termVariations.size === 0;
                }
                // If other attribute is selected, check if there's intersection between variations
                const otherTermVariations = variableProduct.getVariationsByTerm(
                  otherSelectedTerm.key
                );
                // Find intersection: variations that contain both terms
                const hasSharedVariations = Array.from(termVariations).some(
                  (variation) => otherTermVariations.has(variation)
                );
                return !hasSharedVariations;
              })();

              return termVariations.size ? (
                <ProductAttributeOption
                  key={term.key}
                  term={term}
                  label={term.label}
                  isSelected={isSelected}
                  disabled={disabled}
                  onPress={() =>
                    onSelect(attrKey, isSelected ? undefined : term)
                  } // Toggle active term
                />
              ) : null;
            })}
          </ThemedYStack>
        );
      })}
    </ThemedXStack>
  );
}
