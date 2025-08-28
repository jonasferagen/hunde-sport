// components/ProductVariationSelect.tsx

import React from "react";
// components/ProductVariationSelect.tsx (top of file imports)
import { H3 } from "tamagui";

import {
  ThemedButton,
  ThemedText,
  ThemedXStack,
  ThemedYStack,
} from "@/components/ui";
import { THEME_OPTION, THEME_OPTION_SELECTED } from "@/config/app";
import type { ProductPrices } from "@/domain/pricing";
import { getProductPriceRange } from "@/domain/pricing";
import { getAllAttributeOptions } from "@/domain/Product/helpers/VariableProductUI";
import { ProductVariation } from "@/domain/Product/ProductVariation";
import { VariableProduct } from "@/domain/Product/VariableProduct";
import { useProductVariations } from "@/hooks/data/Product";

import { ProductPriceRange } from "../product/display";

// --- Public component (initializer) ---
type Props = {
  variableProduct: VariableProduct;
  onSelect?: (payload: {
    selection: Map<string, string | null>; // attrKey -> termKey|null (internal)
    selectedVariation?: ProductVariation; // resolved variation (if any)
    candidateIds: number[]; // all matching IDs for current selection
    isComplete: boolean; // all attributes selected
  }) => void;
};

// ...

export function ProductVariationSelect({ variableProduct, onSelect }: Props) {
  const { isLoading, items: productVariations } =
    useProductVariations(variableProduct);

  // Build a stable ID → variation index
  const byId = React.useMemo(() => {
    const m = new Map<number, ProductVariation>();
    for (const v of productVariations) m.set(v.id, v);
    return m;
  }, [productVariations]);

  // Compute a price range for a set of variation IDs (used by the option rows)
  const priceRangeForIds = React.useCallback(
    (ids: number[]) => {
      const prices: ProductPrices[] = ids
        .map((id) => byId.get(id)?.prices)
        .filter(Boolean) as ProductPrices[];

      // If nothing matched (e.g., disabled option), return undefined so UI hides price
      if (prices.length === 0) return undefined;

      // Use your util (it already ignores zero/empty prices and seeds correctly)
      return getProductPriceRange(prices);
    },
    [byId]
  );

  if (isLoading) return null; // or skeleton

  return (
    <VariationSelectLogic
      variableProduct={variableProduct}
      byId={byId}
      priceRangeForIds={priceRangeForIds}
      onSelect={onSelect}
    />
  );
}

// --- Logic subcomponent (compute) ---
function VariationSelectLogic({
  variableProduct,
  byId,
  priceRangeForIds,
  onSelect,
}: {
  variableProduct: VariableProduct;
  byId: Map<number, ProductVariation>;
  priceRangeForIds: (ids: number[]) => any;
  onSelect?: Props["onSelect"];
}) {
  // internal selection: attrKey -> termKey|null
  const [selection, setSelection] = React.useState<Map<string, string | null>>(
    () => {
      const m = new Map<string, string | null>();
      for (const key of variableProduct.attributes.keys()) m.set(key, null);
      return m;
    }
  );

  const select = React.useCallback(
    (attrKey: string, termKey: string | null) => {
      setSelection((prev) => {
        const next = new Map(prev);
        next.set(attrKey, termKey);
        return next;
      });
    },
    []
  );

  // groups: [{ attribute: {key,label}, options:[{term:{key,label,attribute}, enabled, variationIds}]}]
  const groups = React.useMemo(
    () => getAllAttributeOptions(variableProduct, selection),
    [variableProduct, selection]
  );

  // candidate IDs = intersection across currently selected terms
  const candidateIds = React.useMemo(() => {
    let ids: Set<number> | null = null;
    for (const [attr, term] of selection) {
      if (!term) continue;
      const group = groups.find((g) => g.attribute.key === attr);
      const opt = group?.options.find((o) => o.term.key === term);
      const subset = new Set(opt?.variationIds ?? []);
      ids = ids ? intersect(ids, subset) : subset;
      if (ids.size === 0) break;
    }
    if (!ids) {
      // no selection → all variation IDs from variants
      return variableProduct.variants.map((v) => v.key);
    }
    return [...ids];
  }, [groups, selection, variableProduct]);

  const selectedVariation =
    candidateIds.length === 1 ? byId.get(candidateIds[0]) : undefined;

  const isComplete = React.useMemo(() => {
    for (const [, term] of selection) if (!term) return false;
    return true;
  }, [selection]);

  // Adapt data to your view shape:
  // - product.taxonomies.values(): array of { name, label }
  // - flagged: array of { term:{ slug, label, taxonomy:{ name } }, enabled, variationIds }
  const taxonomies = React.useMemo(
    () =>
      Array.from(variableProduct.attributes.values()).map((a) => ({
        name: a.key,
        label: a.label,
      })),
    [variableProduct]
  );

  const flagged = React.useMemo(
    () =>
      groups.flatMap((g) =>
        g.options.map((o) => ({
          term: {
            slug: o.term.key,
            label: o.term.label,
            taxonomy: { name: g.attribute.key },
          },
          enabled: o.enabled,
          variationIds: o.variationIds,
        }))
      ),
    [groups]
  );

  // view selection map: taxonomy.name -> { slug, taxonomy:{name} } | null (for your existing code)
  const viewSelection = React.useMemo(() => {
    const m = new Map<
      string,
      { slug: string; taxonomy: { name: string } } | null
    >();
    for (const [attrKey, termKey] of selection) {
      m.set(
        attrKey,
        termKey ? { slug: termKey, taxonomy: { name: attrKey } } : null
      );
    }
    return m;
  }, [selection]);

  // notify parent
  React.useEffect(() => {
    onSelect?.({ selection, selectedVariation, candidateIds, isComplete });
  }, [onSelect, selection, selectedVariation, candidateIds, isComplete]);

  return (
    <VariationOptionGroups
      product={{ taxonomies }} // mimic product.taxonomies.values()
      flagged={flagged}
      selection={viewSelection}
      select={(taxonomyName, termOrNull) => {
        select(taxonomyName, termOrNull ? termOrNull.slug : null);
      }}
      priceRangeForIds={priceRangeForIds}
    />
  );
}

// --- View subcomponent (render; matches your structure) ---
function VariationOptionGroups({
  product,
  flagged,
  selection,
  select,
  priceRangeForIds,
}: {
  product: { taxonomies: { name: string; label: string }[] };
  flagged: {
    term: { slug: string; label: string; taxonomy: { name: string } };
    enabled: boolean;
    variationIds: number[];
  }[];
  selection: Map<string, { slug: string; taxonomy: { name: string } } | null>;
  select: (
    taxonomyName: string,
    term: { slug: string; taxonomy: { name: string } } | null
  ) => void;
  priceRangeForIds: (ids: number[]) => any;
}) {
  return (
    <ThemedXStack split ai="flex-start" gap="$2">
      {Array.from(product.taxonomies.values()).map((tax) => {
        const selected = selection.get(tax.name) ?? null;
        const optionsInTax = flagged.filter(
          (o) => o.term.taxonomy.name === tax.name && o.variationIds.length > 0
        );

        return (
          <ThemedYStack key={tax.name} f={1}>
            <H3 tt="capitalize" size="$6" mb="$1">
              {tax.label}
            </H3>
            <ThemedYStack w="100%" gap="$2">
              {optionsInTax.map((opt) => {
                const { term, enabled = true } = opt;
                const isSelected =
                  !!selected &&
                  selected.slug === term.slug &&
                  selected.taxonomy.name === term.taxonomy.name;

                const onPress = enabled
                  ? () => select(term.taxonomy.name, isSelected ? null : term)
                  : undefined;

                const price = priceRangeForIds(opt.variationIds) ?? undefined;

                return (
                  <ThemedXStack
                    key={`${tax.name}:${term.slug}`}
                    ai="center"
                    gap="$2"
                    theme={isSelected ? THEME_OPTION_SELECTED : THEME_OPTION}
                  >
                    <ThemedButton
                      size="$4"
                      bw={2}
                      aria-label={term.label}
                      onPress={onPress}
                      disabled={!enabled}
                    >
                      <ThemedXStack f={1} split>
                        <ThemedXStack gap="$1">
                          <ThemedText>{term.label}</ThemedText>
                        </ThemedXStack>
                        {price ? (
                          <ProductPriceRange productPriceRange={price} />
                        ) : null}
                      </ThemedXStack>
                    </ThemedButton>
                  </ThemedXStack>
                );
              })}
            </ThemedYStack>
          </ThemedYStack>
        );
      })}
    </ThemedXStack>
  );
}

// ---- utils ----
function intersect(a: Set<number>, b: Set<number>): Set<number> {
  const out = new Set<number>();
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  for (const x of small) if (large.has(x)) out.add(x);
  return out;
}
