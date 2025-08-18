import { ThemedYStack } from '@/components/ui';
import { ThemedText } from '@/components/ui/themed-components/ThemedText';
import { ProductVariationProvider, useProductVariationContext, usePurchasableContext } from '@/contexts';
import { useProductVariationSelector } from '@/domain/Product/helpers/useProductVariationSelector';
import { VariableProduct } from '@/domain/Product/Product';
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { haptic } from '@/lib/haptics';
import { LoadingScreen } from '@/screens/misc/LoadingScreen';
import React, { JSX } from 'react';
import { XStack, YStackProps } from 'tamagui';
import { AttributeSelector } from './AttributeSelector';

interface ProductVariationSelectProps extends YStackProps { }

export const ProductVariationSelect = (props: ProductVariationSelectProps): JSX.Element => {
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

    // Convert arrays to Sets once for O(1) lookups in render
    const unavailableSets = React.useMemo(() => {
        const m: Record<string, Set<string>> = {};
        for (const [name, arr] of Object.entries(unavailableOptions)) {
            m[name] = new Set(arr);
        }
        return m;
    }, [unavailableOptions]);

    ;

    const onSelect = React.useCallback(
        (name: string, value: string) => {

            haptic.selection();
            handleSelectOption(name, value);
        },
        [handleSelectOption]
    );
    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <XStack jc="space-between" gap="$2" fg={1} fw="wrap" {...props}>
            {attributes.map(({ id, name }) => {
                const options = selectionManager.getAvailableOptions(name);
                // cheap filter with Set
                const unavailable = unavailableSets[name];
                const filtered = unavailable ? options.filter(o => !unavailable.has(o.name)) : options;
                const selectedValue = selectionManager.getSelectedOption(name);
                if (filtered.length === 0) return null;

                return (
                    <ThemedYStack key={id} container px="none">
                        <ThemedText top={0} zIndex={1} tt="capitalize" bold>{name}</ThemedText>
                        <AttributeSelector
                            options={filtered}
                            selectedValue={selectedValue}
                            onSelect={(value) => onSelect(name, value)}
                        />
                    </ThemedYStack>
                );
            })}
        </XStack>
    );
});
