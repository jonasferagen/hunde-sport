// components/ProductVariationSelect.tsx

import { H3 } from "tamagui";

import { ThemedXStack, ThemedYStack } from "@/components/ui";
import { useVariableProduct } from "@/contexts/VariableProductContext";

// ProductVariationSelect.tsx

export function ProductVariationSelect() {
  const { variableProduct } = useVariableProduct();
  const { attributes, mapped } = variableProduct;

  // const variations = mapped.variationsByTerm;

  return (
    <ThemedXStack split ai="flex-start" gap="$2">
      {Array.from(attributes).map(([attrKey, attribute]) => {
        console.log(attrKey);
        console.log("aaa");
        console.log(mapped.termsByAttribute);
        console.log(mapped.termsByVariation);
        console.log(mapped.variationHasTerms);
        const terms = mapped.termsByAttribute.get(attrKey);

        // console.log(mapped.termsByAttribute);

        return (
          <>
            <ThemedYStack key={attrKey} f={1}>
              <H3 tt="capitalize" size="$6" mb="$1">
                {attribute}
              </H3>
            </ThemedYStack>

            <ThemedYStack w="100%" gap="$2"></ThemedYStack>
          </>
        );
      })}
    </ThemedXStack>
  );
}
/*
      {Array.from(entries).map(([key, attribute]) => {
        console.log(attribute);
        return <ThemedText key={key}>{attribute.label}</ThemedText>;
      })}
   
  /*
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
                  // hide only globally-unused terms (keep contextually-empty ones visible/disabled)
                  const isGloballyUnused =
                    variableProduct.getVariationSetForTerm(termKey).size === 0;

                  if (isGloballyUnused) return null;

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
  ); */

/* 

             <ProductAttributeOption
                key={`${attrKey}:${termKey}`}
                attribute={attrKey}
                term={termKey}
                isSelected={isSelected}
                label={termLabel}
                onPress={onPress}
                variationSet={variationSet}
              />
 */
