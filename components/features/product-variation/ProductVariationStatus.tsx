import React from "react";

import { ThemedText, ThemedXStack } from "@/components/ui";
import { Purchasable } from "@/domain/Product/Purchasable";

type Props = React.ComponentProps<typeof ThemedText> & {
  purchasable: Purchasable;
  /** Text when a term is not chosen yet */
  placeholder?: string; // default: "velg.."
};

export const ProductVariationStatus: React.FC<Props> = ({
  purchasable,
  placeholder = "velg..",
  ...textProps
}) => {
  const { variableProduct, selection } = purchasable; // VariableProduct

  // stable attribute order
  const attrKeys: string[] = [...variableProduct.attributes.keys()];

  return (
    <ThemedXStack gap="$3" ai="center" fw="wrap">
      {attrKeys.map((attrKey) => {
        const attr = variableProduct.attributes.get(attrKey);
        const state = selection?.get(attrKey);
        const termKey = state?.selected ?? null;
        const termLabel = termKey
          ? (variableProduct.terms.get(termKey)?.label ?? termKey)
          : placeholder;

        return (
          <ThemedText key={attrKey} {...textProps}>
            {attr?.label ?? attrKey}: {termLabel}
          </ThemedText>
        );
      })}
    </ThemedXStack>
  );
};
