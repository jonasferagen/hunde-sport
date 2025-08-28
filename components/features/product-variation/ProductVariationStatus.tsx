import React from "react";

import { ThemedText, ThemedXStack } from "@/components/ui";
import type { Purchasable } from "@/domain/Product/Purchasable";
import { VariableProduct } from "@/domain/Product/VariableProduct";

type Props = React.ComponentProps<typeof ThemedText> & {
  purchasable: Purchasable;
  /** Text when a term is not chosen yet */
  placeholder?: string; // default: "må velge"
  /** Show guidance line when selection incomplete / out of stock */
  showHint?: boolean; // default: true
};

export const ProductVariationStatus: React.FC<Props> = ({
  purchasable,
  placeholder = "velg..",
  showHint = false,
  ...textProps
}) => {
  const product = purchasable.variableProduct;
  const selection = purchasable.selection;
  const isVariable = product instanceof VariableProduct;

  // stable attribute order (for variable products)
  const attrKeys: string[] = isVariable
    ? [...(product as VariableProduct).attributes.keys()]
    : [];

  return (
    <ThemedXStack gap="$3" ai="center" split>
      {isVariable &&
        attrKeys.map((attrKey) => {
          const attr = (product as VariableProduct).attributes.get(attrKey);
          const termKey = selection?.get(attrKey) ?? null;
          const termLabel = termKey
            ? ((product as VariableProduct).terms.get(termKey)?.label ??
              termKey)
            : placeholder;

          return (
            <ThemedText key={attrKey} {...textProps}>
              {attr?.label ?? attrKey}: {termLabel}
            </ThemedText>
          );
        })}

      {showHint && <InlineHint purchasable={purchasable} {...textProps} />}
    </ThemedXStack>
  );
};

// ——— tiny, local hint line ———
const InlineHint: React.FC<
  React.ComponentProps<typeof ThemedText> & { purchasable: Purchasable }
> = ({ purchasable, ...textProps }) => {
  const product = purchasable.variableProduct;
  const isVariable = product instanceof VariableProduct;

  // Build a user-friendly hint for common states
  if (purchasable.status === "OUT_OF_STOCK") {
    return (
      <ThemedText opacity={0.7} {...textProps}>
        Utsolgt
      </ThemedText>
    );
  }

  if (purchasable.status === "VARIATION_REQUIRED" && isVariable) {
    const missing = purchasable.missingAttributes ?? [];
    if (missing.length > 0) {
      // map missing attribute keys → labels
      const labels = missing.map(
        (k) => (product as VariableProduct).attributes.get(k)?.label ?? k
      );
      return (
        <ThemedText opacity={0.7} {...textProps}>
          Velg {formatListNo(labels)}
        </ThemedText>
      );
    }
    return (
      <ThemedText opacity={0.7} {...textProps}>
        Velg alle alternativer for å fortsette
      </ThemedText>
    );
  }

  // OK / INVALID_PRODUCT → no extra hint
  return null;
};

// Norwegian-ish list joiner: "farge", "størrelse" → "farge og størrelse"
function formatListNo(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} og ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} og ${items[items.length - 1]}`;
}
