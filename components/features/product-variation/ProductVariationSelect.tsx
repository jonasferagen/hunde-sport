// components/ProductVariationSelect.tsx

import { H3 } from "tamagui";

import { ThemedXStack, ThemedYStack } from "@/components/ui";
import { useVariableProduct } from "@/contexts/VariableProductContext";
import { ProductAttributeOption } from "@/components/features/product-variation/ProductAttributeOption";

export function ProductVariationSelect() {
  const { variableProduct } = useVariableProduct();
  const { attributes } = variableProduct;
  return (
    <ThemedXStack split ai="flex-start" gap="$2">
      {Array.from(attributes).map(([attrKey, attribute]) => {
        // console.log(mapped.termsByAttribute);

        return (
          <>
            <ThemedYStack key={attrKey} f={1}>
              <H3 tt="capitalize" size="$6" mb="$1">
                {attribute.label}
              </H3>
            </ThemedYStack>

            <ThemedYStack w="100%" gap="$2">
              {Array.from(variableProduct.attributeHasTerms.get(attrKey)!.values()).map(
                (termKey) => {
                  // hide only globally unused terms
                  const isGloballyUnused =
                    variableProduct.getVariationsByTerm(termKey).size === 0;
                  if (isGloballyUnused) return null;

                  // check compatibility with *other* selections
                  const vsetForThisTerm = variableProduct.getVariationsByTerm(termKey);

                  // If this attribute is currently selected with another term,
                  // build a hypothetical selection: replace with this term.
                  const hypothetical = new Map(selections);
                  hypothetical.set(attrKey, termKey);

                  const isEnabled =
                    intersectSets(
                      variableProduct.getCompatibleVariations(hypothetical),
                      vsetForThisTerm
                    ).size > 0;

                  const isSelected = selectedTerm === termKey;
                  const termLabel = types.get(termKey)?.label ?? termKey;

                  const onPress = () =>
                    select(attrKey, isSelected ? null : termKey);

                  return (
                    <ProductAttributeOption
                      key={`${attrKey}:${termKey}`}
                      attribute={attrKey}
                      term={termKey}
                      isSelected={!!isSelected}
                      disabled={!isEnabled}
                      label={termLabel}
                      variationSet={vsetForThisTerm}
                      onPress={onPress}
                    />
                  );
                }
              )}
            </ThemedYStack>
          </ThemedYStack>
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
