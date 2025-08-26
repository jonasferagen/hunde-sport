import { Loader } from '@/components/ui/Loader';
import { ThemedButton, ThemedText, ThemedXStack, ThemedYStack } from '@/components/ui/themed-components';
import { THEME_OPTION, THEME_OPTION_SELECTED } from '@/config/app';
import { VariableProductOptions, type Option, type OptionGroup, type Term } from '@/domain/Product/helpers/VariableProductOptions';
import { VariableProduct } from '@/domain/Product/VariableProduct';
import { useProductVariations } from '@/hooks/data/Product';
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { spacePx } from '@/lib/helpers';
import type { ProductVariation, Purchasable } from '@/types';
import React from 'react';

export type TermSelection = Map<string, Term | null>;

interface ProductVariationSelectProps {
  onSelectionChange?: (selection: TermSelection) => void;
  onProductVariationSelected?: (variation: ProductVariation | undefined) => void; // not used yet
  purchasable: Purchasable;
  h?: number;
}

export const ProductVariationSelect = ({ ...props }: ProductVariationSelectProps) => {
  useRenderGuard('ProductVariationSelect');

  const { purchasable, onSelectionChange } = props;
  const variableProduct = purchasable.product as VariableProduct;
  const { isLoading } = useProductVariations(purchasable.product); // variations fetched elsewhere later

  // Build static option groups from the product once per product change
  const optionGroups = React.useMemo<OptionGroup[]>(
    () => new VariableProductOptions(variableProduct).getOptionGroups(),
    [variableProduct]
  );

  // selection state (taxonomy -> Term|null)
  const [selection, setSelection] = React.useState<TermSelection>(() => new Map());

  // Reset selection whenever groups change
  React.useEffect(() => {
    const next = new Map<string, Term | null>();
    for (const g of optionGroups) next.set(g.taxonomy, null);
    setSelection(next);
  }, [optionGroups]);

  // Notify parent on selection changes
  React.useEffect(() => {
    onSelectionChange?.(selection);
  }, [selection, onSelectionChange]);

  // Minimal select handler (immutable Map update)
  const handleSelect = React.useCallback((taxonomy: string, term: Term | null) => {
    setSelection(prev => {
      const next = new Map(prev);
      next.set(taxonomy, term);
      return next;
    });
  }, []);

  // layout
  const cols = Math.min(2, optionGroups.length ? 2 : 1);
  const GAP = '$2';
  const gapPx = spacePx(GAP);
  const half = Math.round(gapPx / 2);
  const colW = cols === 2 ? '50%' : '100%';

  if (isLoading) return <Loader h={props.h} />;

  return (
    <ThemedXStack fw="wrap" mx={-half} my={-half}>
      {optionGroups.map(group => {
        const { taxonomy } = group;
        const filtered = group.options.filter(o => o.linked.length > 0);
        if (!filtered.length) return null;

        const selected = selection.get(taxonomy) ?? null;

        return (
          <ThemedYStack key={taxonomy} w={colW} p={half}>
            <ThemedText tt="capitalize" bold mb="$1">
              {group.label}
            </ThemedText>

            <AttributeSelector
              options={filtered}
              selected={selected}
              onSelect={handleSelect}
            />
          </ThemedYStack>
        );
      })}
    </ThemedXStack>
  );
};

/* ---------- AttributeSelector ---------- */

type AttributeSelectorProps = {
  options: Option[];
  selected: Term | null;
  onSelect?: (taxonomy: string, term: Term | null) => void;
};

export const AttributeSelector = React.memo(function AttributeSelector({
  options,
  selected,
  onSelect,
}: AttributeSelectorProps) {
  return (
    <ThemedYStack w="100%" gap="$2">
      {options.map((opt) => {
        const { term } = opt;
        const isSelected = selected?.slug === term.slug;
        const handlePress = () => onSelect?.(term.taxonomy, isSelected ? null : term);

        return (
          <AttributeOption
            key={term.slug}
            option={opt}
            isSelected={isSelected}
            onPress={handlePress}
          />
        );
      })}
    </ThemedYStack>
  );
});

/* ---------- AttributeOption ---------- */

type AttributeOptionProps = {
  option: Option;
  isSelected?: boolean;
  onPress?: () => void;
};

export const AttributeOption = React.memo(function AttributeOption({
  option,
  isSelected = false,
  onPress,
}: AttributeOptionProps) {
  const { term, linked } = option;

  return (
    <ThemedXStack ai="center" gap="$2" theme={isSelected ? THEME_OPTION_SELECTED : THEME_OPTION}>
      <ThemedButton
        size="$2"
        bw={2}
        aria-label={term.label}
        onPress={onPress}
      >
        <ThemedText>{term.label}</ThemedText>
      </ThemedButton>
      <ThemedText size="$1" opacity={0.6}>
        {linked.length} varianter
      </ThemedText>
    </ThemedXStack>
  );
});
