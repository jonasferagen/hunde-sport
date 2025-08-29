import React from "react";

import { ThemedText, ThemedXStack } from "@/components/ui";
import type { Purchasable } from "@/domain/Purchasable";

type Props = React.ComponentProps<typeof ThemedText> & {
  purchasable: Purchasable;
  /** Text when a term is not chosen yet */
  placeholder?: string; // default: "velg.."
};

export const ProductVariationStatus: React.FC<Props> = ({
  purchasable,
  placeholder = "",
  ...textProps
}) => {
  const { variableProduct, selection } = purchasable;

  // stable attribute order from model
  const attrKeys = variableProduct.attributeOrder;

  return (
    <ThemedXStack gap="$3" ai="center" fw="wrap">
      {attrKeys.map((attrKey) => {
        const attr = variableProduct.attributes.get(attrKey);
        const termKey = selection.get(attrKey) ?? null; // <- selection is Map<string, string|null>
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
