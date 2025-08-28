// components/ProductVariationSelect.tsx

import React from "react";
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
import { ProductVariation } from "@/domain/Product/ProductVariation";
import { VariableProduct } from "@/domain/Product/VariableProduct";
import { useProductVariations } from "@/hooks/data/Product";

import { ProductPriceRange } from "../product/display";

type AttributeKey = string;
type TermKey = string;

export type VariationSelection = Map<AttributeKey, TermKey | null>;

type Option = {
  term: { key: TermKey; label: string; attribute: AttributeKey };
  enabled: boolean;
  variationIds: number[];
};

type OptionGroup = {
  attribute: { key: AttributeKey; label: string };
  options: Option[];
};

export type OnSelectPayload = {
  selection: VariationSelection;
  selectedVariation?: ProductVariation;
};

type Props = {
  variableProduct: VariableProduct;
  onSelect?: (payload: OnSelectPayload) => void;
};

export function ProductVariationSelect({ variableProduct, onSelect }: Props) {
  const { isLoading, items: productVariations } =
    useProductVariations(variableProduct);

  // ID → variation
  const byId = React.useMemo(() => {
    const m = new Map<number, ProductVariation>();
    for (const v of productVariations) m.set(v.id, v);
    return m;
  }, [productVariations]);

  const priceRangeForIds = React.useCallback(
    (ids: number[]) => {
      const prices: ProductPrices[] = ids
        .map((id) => byId.get(id)?.prices)
        .filter(Boolean) as ProductPrices[];
      if (prices.length === 0) return undefined;
      return getProductPriceRange(prices);
    },
    [byId]
  );

  if (isLoading) return null;

  return (
    <VariationSelectLogic
      variableProduct={variableProduct}
      byId={byId}
      priceRangeForIds={priceRangeForIds}
      onSelect={onSelect}
    />
  );
}

function VariationSelectLogic({
  variableProduct,
  byId,
  priceRangeForIds,
  onSelect,
}: {
  variableProduct: VariableProduct;
  byId: Map<number, ProductVariation>;
  priceRangeForIds: (
    ids: number[]
  ) => ReturnType<typeof getProductPriceRange> | undefined;
  onSelect?: Props["onSelect"];
}) {
  // attrKey -> termKey|null
  const [selection, setSelection] = React.useState<VariationSelection>(() => {
    const m = new Map<AttributeKey, TermKey | null>();
    for (const key of variableProduct.attributes.keys()) m.set(key, null);
    return m;
  });

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

  // build option groups directly from VariableProduct data
  const groups = React.useMemo<OptionGroup[]>(
    () => getAllAttributeOptions(variableProduct, selection),
    [variableProduct, selection]
  );

  // candidate IDs = intersection of selected options’ ids
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
    if (!ids) return variableProduct.variants.map((v) => v.key);
    return [...ids];
  }, [groups, selection, variableProduct]);

  const selectedVariation =
    candidateIds.length === 1 ? byId.get(candidateIds[0]) : undefined;

  React.useEffect(() => {
    onSelect?.({ selection, selectedVariation });
  }, [onSelect, selection, selectedVariation]);

  // View: straight from groups (no “taxonomies/flagged” adapter)
  return (
    <ThemedXStack split ai="flex-start" gap="$2">
      {groups.map(({ attribute, options }) => {
        const selected = selection.get(attribute.key) ?? null;

        return (
          <ThemedYStack key={attribute.key} f={1}>
            <H3 tt="capitalize" size="$6" mb="$1">
              {attribute.label}
            </H3>
            <ThemedYStack w="100%" gap="$2">
              {options
                .filter((o) => o.variationIds.length > 0)
                .map((opt) => {
                  const { term, enabled } = opt;
                  const isSelected = selected === term.key;
                  const onPress = enabled
                    ? () => select(attribute.key, isSelected ? null : term.key)
                    : undefined;
                  const price = priceRangeForIds(opt.variationIds) ?? undefined;

                  return (
                    <ThemedXStack
                      key={`${attribute.key}:${term.key}`}
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

/** ---- minimal pure helpers (formerly scattered across 2–3 files) ---- */

function getAllAttributeOptions(
  vp: VariableProduct,
  selection: ReadonlyMap<AttributeKey, TermKey | null>
): OptionGroup[] {
  // Pre-index (attribute, term) -> Set<variantIds>
  const byAttrTerm = new Map<AttributeKey, Map<TermKey, Set<number>>>();
  for (const v of vp.variants) {
    for (const opt of v.options) {
      const inner =
        byAttrTerm.get(opt.attribute) ?? new Map<TermKey, Set<number>>();
      const set = inner.get(opt.term) ?? new Set<number>();
      set.add(v.key);
      inner.set(opt.term, set);
      byAttrTerm.set(opt.attribute, inner);
    }
  }

  // Build groups
  const attributes = [...vp.attributes.values()];
  return attributes.map((a) => {
    // Candidate set = intersection of other selected attrs
    let candidate: Set<number> | null = null;
    for (const [attr, term] of selection) {
      if (!term || attr === a.key) continue;
      const inner = byAttrTerm.get(attr);
      const subset = inner
        ? (inner.get(term) ?? new Set<number>())
        : new Set<number>();
      candidate = candidate ? intersect(candidate, subset) : new Set(subset);
      if (candidate.size === 0) break;
    }

    // Terms for this attribute, with availability
    const terms = [...vp.terms.values()].filter((t) => t.attribute === a.key);
    const options: Option[] = terms.map((t) => {
      const base = byAttrTerm.get(a.key)?.get(t.key) ?? new Set<number>();
      const final = candidate ? intersect(base, candidate) : base;
      return {
        term: t,
        enabled: final.size > 0,
        variationIds: [...final],
      };
    });

    return { attribute: { key: a.key, label: a.label }, options };
  });
}

function intersect(a: Set<number>, b: Set<number>): Set<number> {
  const out = new Set<number>();
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  for (const x of small) if (large.has(x)) out.add(x);
  return out;
}
