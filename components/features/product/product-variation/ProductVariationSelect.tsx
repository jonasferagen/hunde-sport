import { Loader } from '@/components/ui/Loader';
import { ThemedText } from '@/components/ui/themed-components/ThemedText';
import { ProductVariationProvider, useProductVariationContext, usePurchasableContext } from '@/contexts';
import { useProductVariationSelector } from '@/domain/Product/helpers/useProductVariationSelector';
import { VariableProduct } from '@/domain/Product/Product';
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { spacePx } from '@/lib/helpers';
import React from 'react';
import { XStack, YStack, YStackProps } from 'tamagui';
import { AttributeSelector } from './AttributeSelector';

interface ProductVariationSelectProps extends YStackProps { }

export const ProductVariationSelect = (props: ProductVariationSelectProps) => {
    const { purchasable } = usePurchasableContext();
    const variableProduct = purchasable.product as VariableProduct;

    return <ProductVariationProvider product={variableProduct}>
        <ProductVariationSelectContent {...props} />
    </ProductVariationProvider>
}

export const ProductVariationSelectContent = React.memo(function ProductVariationSelectContent(
    props: ProductVariationSelectProps
) {
    useRenderGuard('ProductVariationSelect');
    const { purchasable, setProductVariation } = usePurchasableContext();
    const { productVariations, isLoading } = useProductVariationContext();
    const variableProduct = purchasable.product as VariableProduct;

    const {
        attributes,
        selectionManager,
        handleSelectOption,
        unavailableOptions,
    } = useProductVariationSelector({
        product: variableProduct,
        productVariations,
        onProductVariationSelected: setProductVariation,
    });

    const unavailableSets = React.useMemo(() => {
        const m: Record<string, Set<string>> = {};
        for (const [name, arr] of Object.entries(unavailableOptions)) m[name] = new Set(arr);
        return m;
    }, [unavailableOptions]);

    const cols = Math.min(2, attributes.length || 1);
    const GAP = '$2';
    const gapPx = spacePx(GAP);
    const half = Math.round(gapPx / 2);
    const colW = cols === 2 ? '50%' : '100%';


    if (isLoading) return <Loader h={props.h} />;

    return (
        <XStack fw="wrap" mx={-half} my={-half}>
            {attributes.map(({ id, name }) => {
                const options = selectionManager.getAvailableOptions(name);
                const unavailable = unavailableSets[name];
                const filtered = unavailable ? options.filter(o => !unavailable.has(o.name)) : options;
                const selectedValue = selectionManager.getSelectedOption(name);
                if (!filtered.length) return null;

                return (
                    <YStack key={id} w={colW} p={half}>
                        <ThemedText tt="capitalize" bold mb="$1">{name}</ThemedText>
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