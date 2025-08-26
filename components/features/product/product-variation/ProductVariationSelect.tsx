import { Loader } from '@/components/ui/Loader';
import { ThemedButton, ThemedText, ThemedXStack, ThemedYStack } from '@/components/ui/themed-components';
import { THEME_OPTION, THEME_OPTION_SELECTED } from '@/config/app';
import { ProductVariationCollection } from '@/domain/Product/helpers/ProductVariationCollection';
import { VariableProductOptions, type SelectOption, type Term } from '@/domain/Product/helpers/VariableProductOptions';
import { VariableProduct } from '@/domain/Product/VariableProduct';
import { useProductVariations } from '@/hooks/data/Product';
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { type ProductVariation } from '@/types';
import React from 'react';
import { H3 } from 'tamagui';
import { ProductPriceRange } from '../display';


export type TermSelection = Map<string, Term | null>;

interface ProductVariationSelectProps {
  onSelectionChange: (selection: TermSelection) => void;
  variableProduct: VariableProduct;
  h?: number;
}

export const ProductVariationSelect = ({ ...props }: ProductVariationSelectProps) => {
  useRenderGuard('ProductVariationSelect');
  const { isLoading, items:productVariations} = useProductVariations(props.variableProduct); // variations fetched elsewhere later

  const collection = new ProductVariationCollection(productVariations);
  if (isLoading) return <Loader h={props.h} />;
  return <ProductVariationSelectContent {...props} collection={collection} />;
}

interface ProductVariationSelectContentProps extends ProductVariationSelectProps {
    collection: ProductVariationCollection<ProductVariation>;
    onSelectionChange: (selection: TermSelection) => void;
}

export const ProductVariationSelectContent = ({ 
  collection, 
  onSelectionChange, 
  ...props 
}: ProductVariationSelectContentProps ) => {
  useRenderGuard('ProductVariationSelectContent');

  const allOptions = VariableProductOptions.create(props.variableProduct);
  const baseGroups = VariableProductOptions.group(allOptions);
  
  // init selection from baseGroups ...
  const [selection, setSelection] = React.useState<TermSelection>(() => {
    const next = new Map<string, Term | null>();
    for (const g of baseGroups) next.set(g.taxonomy.name, null);
    return next;
  });
  // recompute enabled flags when selection changes
  const flaggedOptions = React.useMemo(
    () => VariableProductOptions.withEnabled(allOptions, selection),
    [allOptions, selection]
  );
  const optionGroups = React.useMemo(
    () => VariableProductOptions.group(flaggedOptions),
    [flaggedOptions]
  );

  const handleSelect = React.useCallback((taxonomy: string, term: Term | null) => {
    selection.set(taxonomy, term);
    setSelection(selection);
    //onSelectionChange(selection);

  }, [selection]);

  return (
    <ThemedXStack split ai="flex-start" gap="$2">
      {optionGroups.map(group => {
        const { taxonomy } = group;
        const selected = selection.get(taxonomy.name) ?? null;
        const optionsInTax = group.options.filter(o => o.variationIds.length > 0);

        return (
          <ThemedYStack key={taxonomy.name} f={1}>
            <H3 tt="capitalize" size="$6" mb="$1">{taxonomy.label}</H3>
            <AttributeSelector
              options={optionsInTax}
              selected={selected}
              onSelect={handleSelect}
              collection={collection}
            />
          </ThemedYStack>
        );
      })}
    </ThemedXStack>
  );
};
// AttributeSelector: no enabledSlugs; use option.enabled
type AttributeSelectorProps = {
  options: SelectOption[];
  selected: Term | null;
  onSelect: (taxonomy: string, term: Term | null) => void;
  collection: ProductVariationCollection<ProductVariation>;
};

const AttributeSelector = React.memo(({ options, selected, onSelect, collection }: AttributeSelectorProps) => {
  return (
    <ThemedYStack w="100%" gap="$2">
      {options.map(opt => {
        const { term, enabled } = opt;
        const isSelected = selected?.slug === term.slug;
        const handlePress = enabled ? () => onSelect(term.taxonomy.name, isSelected ? null : term) : undefined;

        return (
          <AttributeOption
            key={term.slug}
            option={opt}
            isSelected={isSelected}
            onPress={handlePress}
            collection={collection}
          />
        );
      })}
    </ThemedYStack>
  );
});


// AttributeOption: compute price range + availability on demand via collection
type AttributeOptionProps = {
  option: SelectOption;
  isSelected?: boolean;
  onPress?: () => void;
  collection: ProductVariationCollection<ProductVariation>;
};

export const AttributeOption = React.memo(function AttributeOption({
  option,
  isSelected = false,
  onPress,
  collection,
}: AttributeOptionProps) {
  const { term } = option;

  // stable dep for memo; avoids array reference churn
  const idsKey = React.useMemo(() => option.variationIds.join('|'), [option.variationIds]);

  const productPriceRange = React.useMemo(() => {
    return collection.priceRangeForVariationIds(option.variationIds) ?? undefined;
  }, [collection, idsKey]);
/*
  const variationAvailability = React.useMemo(() => {
    return option.variationIds
      .map(id => collection.get(id)?.availability)
      .filter(Boolean);
  }, [collection, idsKey]);
*/
  return (
    <ThemedXStack ai="center" gap="$2" theme={isSelected ? THEME_OPTION_SELECTED : THEME_OPTION}>
      <ThemedButton
        size="$4"
        bw={2}
        aria-label={term.label}
        onPress={onPress}    // null/undefined disables it (as you wanted)
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
