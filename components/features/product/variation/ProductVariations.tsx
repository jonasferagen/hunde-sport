import { useProductContext } from '@/contexts/ProductContext';
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { VariableProduct } from '@/models/Product/VariableProduct';
import { VariationSelection } from '@/models/Product/VariationSelection';
import { ProductAttribute } from '@/types';
import React, { JSX, useEffect, useState } from 'react';
import { SizableText, XStack, YStack } from 'tamagui';
import { AttributeSelector } from './AttributeSelector';


export const ProductVariations = (): JSX.Element => {

    const { product } = useProductContext();
    if (!(product instanceof VariableProduct)) {
        return <></>;
    }

    return (
        <>
            <SizableText>{product.productVariation?.id}</SizableText>
            <ProductVariationsContent />
        </>
    )
}

const ProductVariationsContent = (): JSX.Element => {

    useRenderGuard("ProductVariationsContent")

    const { product: variableProduct, setSelectedVariation } = useProductContext();
    const product = variableProduct as VariableProduct;
    const _selectionManager = product.createSelectionManager();

    const [selectionManager, setSelectionManager] = useState<VariationSelection | null>(_selectionManager);

    useEffect(() => {
        if (selectionManager) {
            const selectedVariation = selectionManager.getSelectedVariation();
            setSelectedVariation(selectedVariation);
        }
    }, [selectionManager, setSelectedVariation]);

    if (!selectionManager) {
        return <></>;
    }



    const handleSelectOption = (attributeTaxonomy: string, optionSlug: string | null) => {
        const newManager = selectionManager.select(attributeTaxonomy, optionSlug);
        setSelectionManager(newManager);
    };

    const attributes = product.getAttributesForVariationSelection();
    return (
        <XStack gap="$2" flexWrap="wrap" mt="$2">
            {attributes.map((attribute: ProductAttribute) => {
                const options = selectionManager.getAvailableOptions(attribute.taxonomy);
                const selectedValue = selectionManager.selections[attribute.taxonomy];

                return (
                    <YStack key={attribute.id} flex={1}>
                        <SizableText fos="$3" fow="bold" mb="$2" ml="$1" tt="capitalize">
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