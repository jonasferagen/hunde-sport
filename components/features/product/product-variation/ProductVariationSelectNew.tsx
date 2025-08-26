import { Loader } from '@/components/ui/Loader';
import { ThemedText } from '@/components/ui/themed-components/ThemedText';

import { useProductVariationSelector } from '@/domain/Product/helpers/useProductVariationSelector';
import { VariableProduct } from '@/domain/Product/Product';
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { spacePx } from '@/lib/helpers';
import { ProductVariation, Purchasable } from '@/types';
import React from 'react';
import { XStack, YStack, YStackProps } from 'tamagui';
import { AttributeSelector } from './AttributeSelector';
import { useProductVariations } from '@/hooks/data/Product';
import { VariableProductOptions } from '@/domain/Product/helpers/VariableProductOptions';

interface ProductVariationSelectProps extends YStackProps {
    onSelectionChange?: (selection: Record<string, string>) => void;
    onProductVariationSelected?: (variation: ProductVariation | undefined) => void;
    purchasable: Purchasable;
}


export const ProductVariationSelect = React.memo((props: ProductVariationSelectProps) => {
    useRenderGuard('ProductVariationSelect');

    const { purchasable } = props;
    const variableProduct = purchasable.product as VariableProduct;
    const { items: productVariations, isLoading } = useProductVariations(purchasable.product);

    const optionGroups = new VariableProductOptions(variableProduct).getOptionGroups();

    const cols = Math.min(2, optionGroups.size || 1);
    const GAP = '$2';
    const gapPx = spacePx(GAP);
    const half = Math.round(gapPx / 2);
    const colW = cols === 2 ? '50%' : '100%';

    if (isLoading) {
        return <Loader h={props.h} />;
    }



    return (
        <XStack fw="wrap" mx={-half} my={-half}>
            {optionGroups.map(({ id, name }) => {
                const options = selectionManager.getAvailableOptions(name);
                const unavailable = unavailableSets[name];
                const filtered = unavailable ? options.filter((o) => !unavailable.has(o.name)) : options;
                const selectedValue = selectionManager.getSelectedOption(name);
                if (!filtered.length) return null;

                return (
                    <YStack key={id} w={colW} p={half}>
                        <ThemedText tt="capitalize" bold mb="$1">
                            {name}
                        </ThemedText>
                        <AttributeSelector
                            options={filtered}
                            selectedValue={selectedValue}
                            onSelect={(value) => handleSelectOption(name, value)}
                        />
                    </YStack>
                );
            })}
        </XStack>
    );
});