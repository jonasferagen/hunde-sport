import { ThemedSpinner } from '@/components/ui/ThemedSpinner';
import { useProductContext } from '@/contexts';
import { VariableProduct } from '@/models/Product/VariableProduct';
import { ProductAttribute } from '@/types';
import React, { JSX, useCallback, useEffect, useState } from 'react';
import { SizableText, XStack, YStack } from 'tamagui';
import { AttributeSelector } from './AttributeSelector';

export const ProductVariations = (): JSX.Element => {
    const { product, isLoading, productVariations } = useProductContext();

    if (!(product instanceof VariableProduct)) {
        return <></>;
    }

    // Do not render until variations are loaded
    if (isLoading) {
        return <ThemedSpinner />;
    }

    return <ProductVariationsContent product={product} />;
};

const ProductVariationsContent = ({ product }: { product: VariableProduct }): JSX.Element => {
    const { setSelectedProductVariation: setSelectedVariation } = useProductContext();

    // The selection manager is now an internal implementation detail of this component.
    const [selectionManager, setSelectionManager] = useState(() => product.createSelectionManager());

    // When the selection manager changes (i.e., a selection is made), update the context.
    useEffect(() => {
        const selectedVariation = selectionManager.getSelectedVariation();
        setSelectedVariation(selectedVariation);
    }, [selectionManager, setSelectedVariation]);

    const handleSelectOption = useCallback(
        (attributeTaxonomy: string, optionSlug: string | null) => {
            const newManager = selectionManager.select(attributeTaxonomy, optionSlug);
            setSelectionManager(newManager);
        },
        [selectionManager]
    );

    const attributes = product.getAttributesForVariationSelection();



    return (
        <XStack gap="$2" flexWrap="wrap">
            {attributes.map((attribute: ProductAttribute) => {
                const options = selectionManager.getAvailableOptions(attribute.taxonomy);
                const selectedValue = selectionManager.getSelectedOption(attribute.taxonomy);
                if (options.length === 0) {
                    return null;
                }

                return (
                    <YStack key={attribute.id} gap="$1" f={1}>
                        <SizableText size="$3" fontWeight="bold">
                            {attribute.name}
                        </SizableText>
                        <AttributeSelector
                            options={options}
                            selectedValue={selectedValue}
                            onSelect={(value) => handleSelectOption(attribute.taxonomy, value)}
                        />
                    </YStack>
                );
            })}
        </XStack>
    );
};