import React from "react";

import { ThemedText, ThemedXStack } from "@/components/ui";
import { VariableProduct } from "@/domain/Product/VariableProduct";

type Props = React.ComponentProps<typeof ThemedText> & {
  variableProduct: VariableProduct;
  selection: Map<string, string | null>; // attrKey -> termKey|null
  isComplete?: boolean;
  incompleteHint?: string; // default: "Velg alle alternativer for å fortsette"
  showHint?: boolean; // default: true
  placeholder?: string; // default: "må velge"
};

export const ProductVariationStatus: React.FC<Props> = ({
  variableProduct,
  selection,
  isComplete,
  incompleteHint = "Velg alle alternativer for å fortsette",
  showHint = true,
  placeholder = "må velge",
  ...textProps
}) => {
  // stable ordering from product attributes
  const keys = React.useMemo(
    () => [...variableProduct.attributes.keys()],
    [variableProduct]
  );

  return (
    <ThemedXStack gap="$3" ai="center" fw="wrap">
      {keys.map((attrKey) => {
        const termKey = selection.get(attrKey) ?? null;
        const attrLabel =
          variableProduct.attributes.get(attrKey)?.label ?? attrKey;
        const termLabel = termKey
          ? (variableProduct.terms.get(termKey)?.label ?? termKey)
          : placeholder;

        return (
          <ThemedText key={attrKey} {...textProps}>
            {attrLabel}: {termLabel}
          </ThemedText>
        );
      })}

      {showHint && isComplete === false && (
        <ThemedText opacity={0.7} {...textProps}>
          {incompleteHint}
        </ThemedText>
      )}
    </ThemedXStack>
  );
};
