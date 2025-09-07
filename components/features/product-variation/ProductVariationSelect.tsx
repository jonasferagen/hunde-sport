// components/ProductVariationSelect.tsx
import { H3 } from "tamagui";

import { ProductAttributeOption } from "@/components/features/product-variation/ProductAttributeOption";
import { ThemedXStack, ThemedYStack } from "@/components/ui";
import { useProductContext } from "@/contexts/ProductContext";
import { getProductPriceRange } from "@/domain/pricing/format";
import { type ProductPrices } from "@/domain/pricing/types";
import type {
  AttributeSelection,
  ProductVariation,
  Term,
  Variation,
} from "@/domain/product/";
import type { VariableProduct } from "@/types";
type Props = {
  onSelect: (attrKey: string, term: Term | undefined) => void;
  attributeSelection: AttributeSelection;
};

export function ProductVariationSelect({
  onSelect,
  attributeSelection,
}: Props) {
  const { product, productVariations } = useProductContext();
  const variableProduct = product as VariableProduct;
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

              const { disabled, availableVariations } = (() => {
                // If no other attribute is selected, term is enabled if it has any variations
                if (!otherSelectedTerm) {
                  return {
                    disabled: termVariations.size === 0,
                    availableVariations: termVariations,
                  };
                }
                // If other attribute is selected, check if there's intersection between variations
                const otherTermVariations = variableProduct.getVariationsByTerm(
                  otherSelectedTerm.key
                );

                // Find intersection: variations that contain both terms
                const sharedVariations = new Set(
                  Array.from(termVariations).filter((variation) =>
                    otherTermVariations.has(variation)
                  )
                );

                return {
                  disabled: sharedVariations.size === 0,
                  availableVariations: sharedVariations,
                };
              })();

              const productPriceRange = findPriceRangeForVariations(
                productVariations,
                availableVariations
              );

              return termVariations.size ? (
                <ProductAttributeOption
                  key={term.key}
                  term={term}
                  label={term.label}
                  isSelected={isSelected}
                  disabled={disabled}
                  productPriceRange={productPriceRange}
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

const findPriceRangeForVariations = (
  productVariations: ReadonlyMap<string, ProductVariation>,
  variations: ReadonlySet<Variation>
) => {
  const prices = Array.from(variations)
    .map((variation) => productVariations.get(variation?.key)?.prices)
    .filter(Boolean) as ProductPrices[];

  return prices.length ? getProductPriceRange(prices) : null;
};
