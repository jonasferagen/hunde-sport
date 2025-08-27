// ProductVariationSelect.tsx
import React from 'react';
import { H3 } from 'tamagui';

import { Loader } from '@/components/ui/Loader';
import { ThemedButton, ThemedText, ThemedXStack, ThemedYStack } from '@/components/ui/themed-components';
import { THEME_OPTION, THEME_OPTION_SELECTED } from '@/config/app';
import type { SelectOption, Term } from '@/domain/Product/helpers/VariableProductOptions';
import { useProductVariations } from '@/hooks/data/Product';
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { useVariableProductStore } from '@/stores/useProductVariationStore';
import type { VariableProduct } from '@/types'; // adjust paths

import { ProductPriceRange } from '../display';
 
export type TermSelection = Map<string, Term | null>;

interface Props {
  variableProduct: VariableProduct;
  h?: number;
}

export const ProductVariationSelect = ({ variableProduct, h }: Props) => {
  useRenderGuard('ProductVariationSelect');

  const { isLoading, items: productVariations } = useProductVariations(variableProduct);

  const init   = useVariableProductStore(s => s.init);
  const groups = useVariableProductStore(s => s.groups);
  const selection = useVariableProductStore(s => s.selection);
  const selectedVariation = useVariableProductStore(s => s.selectedVariation);
  const select = useVariableProductStore(s => s.select);

  // init store when data is ready
  React.useEffect(() => {
    if (!isLoading) init(variableProduct, productVariations);
    return () => useVariableProductStore.getState().reset();
  }, [isLoading, variableProduct, productVariations, init]);

  if (isLoading) return <Loader h={h} />;

  return (
    <ThemedXStack split ai="flex-start" gap="$2">
      {groups.map(group => {
        const { taxonomy } = group;
        const selected = selection.get(taxonomy.name) ?? null;
        const optionsInTax = group.options.filter(o => o.variationIds.length > 0);

        return (
          <ThemedYStack key={taxonomy.name} f={1}>
            <H3 tt="capitalize" size="$6" mb="$1">{taxonomy.label}</H3>
            <ThemedYStack w="100%" gap="$2">
              {optionsInTax.map(opt => (
                <AttributeOption
                  key={opt.term.slug}
                  option={opt}
                  selected={selected}
                  onSelect={select}
                />
              ))}
            </ThemedYStack>
          </ThemedYStack>
        );
      })}
    </ThemedXStack>
  );
};

type AttributeOptionProps = {
  option: SelectOption;
  selected: Term | null;
  onSelect: (taxonomy: string, term: Term | null) => void;
};

const AttributeOption = React.memo(function AttributeOption({
  option,
  selected,
  onSelect,
}: AttributeOptionProps) {
  const { term, enabled = true } = option;
  const priceRangeForIds = useVariableProductStore(s => s.priceRangeForIds);

  const isSelected =
    !!selected &&
    selected.slug === term.slug &&
    selected.taxonomy.name === term.taxonomy.name;

  const idsKey = React.useMemo(() => option.variationIds.join('|'), [option.variationIds]);
  const productPriceRange = React.useMemo(
    () => priceRangeForIds(option.variationIds) ?? undefined,
    [priceRangeForIds, idsKey]
  );

  const onPress = enabled ? () => onSelect(term.taxonomy.name, isSelected ? null : term) : undefined;

  return (
    <ThemedXStack ai="center" gap="$2" theme={isSelected ? THEME_OPTION_SELECTED : THEME_OPTION}>
      <ThemedButton
        size="$4"
        bw={2}
        aria-label={term.label}
        onPress={onPress}
        disabled={!onPress}
      >
        <ThemedXStack f={1} split>
          <ThemedXStack gap="$1">
            <ThemedText>{term.label}</ThemedText>
          </ThemedXStack>

          {productPriceRange ? (
            <ProductPriceRange productPriceRange={productPriceRange} />
          ) : null}
        </ThemedXStack>
      </ThemedButton>
    </ThemedXStack>
  );
});
