// components/ProductVariationSelect.tsx

import { H3 } from "tamagui";

import { ProductAttributeOption } from "@/components/features/product-variation/ProductAttributeOption";
import { ThemedXStack, ThemedYStack } from "@/components/ui";
import { useVariableProduct } from "@/contexts/VariableProductContext";

export function ProductVariationSelect() {
  const { variableProduct } = useVariableProduct();
  const { attributes } = variableProduct;

  return (
    <ThemedXStack split ai="flex-start" gap="$2">
      {Array.from(attributes).map(([_attrKey, attribute]) => {
        return (
          <>
            <ThemedYStack f={1}>
              <H3 tt="capitalize" size="$6" mb="$1">
                {attribute.label}
              </H3>
            </ThemedYStack>

            <ThemedYStack w="100%" gap="$2">
              {variableProduct
                .getTermsByAttribute(attribute.key)
                .map((term) => {
                  const variations = variableProduct.getVariationsByTerm(
                    term.key
                  );

                  return (
                    <ProductAttributeOption
                      key={`${term.key}`}
                      attribute={attribute.key}
                      term={term.key}
                      label={term.label}
                      isSelected={false}
                      variations={variations}
                      // onPress left undefined until you wire selection
                    />
                  );
                })}
            </ThemedYStack>
          </>
        );
      })}
    </ThemedXStack>
  );
}
