import React from "react";

import { ThemedText, ThemedXStack } from "@/components/ui";
import type { Purchasable } from "@/domain/Purchasable";
import { VariableProduct } from "@/types";

type Props = React.ComponentProps<typeof ThemedText> & {
  purchasable: Purchasable;
};

export const ProductVariationStatus: React.FC<Props> = ({
  purchasable,
  ...textProps
}) => {
  const { product, variationSelection } = purchasable;

  const variableProduct = product as VariableProduct;

  if (!variationSelection) {
    console.error("no variationSelection");
    return null;
  }

  console.log(variableProduct);

  // stable attribute order from model
  const attrKeys = variableProduct.attributeOrder;

  return (
    <ThemedXStack gap="$3" ai="center">
      {attrKeys.map((attrKey) => {
        const attribute = variableProduct.attributes.get(attrKey)!;
        const termKey = variationSelection.get(attrKey)!;
        if (!termKey) return;
        const termLabel = variableProduct.terms.get(termKey)!.label;
        return (
          <ThemedText tt="capitalize" key={attrKey} {...textProps}>
            {attribute?.label ?? attrKey}: {termLabel}
          </ThemedText>
        );
      })}
    </ThemedXStack>
  );
};
