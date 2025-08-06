import { ThemedSpinner } from '@/components/ui/ThemedSpinner';
import { useProductContext } from '@/contexts';
import { VariableProduct } from '@/models/Product/VariableProduct';
import { VariationSelection } from '@/models/Product/helpers/VariationSelection';
import { ProductAttribute } from '@/types';
import React, { JSX, useCallback, useEffect, useMemo, useState } from 'react';
import { SizableText, XStack, YStack } from 'tamagui';
import { AttributeSelector } from './AttributeSelector';

export const ProductVariations = (): JSX.Element => {
    const { isLoading, product: initialProduct, setSelectedProductVariation, productVariations } = useProductContext();

    if (!(initialProduct instanceof VariableProduct)) {
        return <></>;
    }
    const product = initialProduct as VariableProduct;
    if (isLoading) {
        return <ThemedSpinner />;
    }

    // State to track only the user's selections
    const [selections, setSelections] = useState<Record<string, string>>({});

    // The selectionManager is now derived from state and props. It will be
    // re-created whenever the product, variations, or user selections change.
    const selectionManager = useMemo(() => {
        const manager = VariationSelection.create(product, productVariations || []);
        // Re-apply the current selections to the new manager instance
        return Object.entries(selections).reduce(
            (currentManager, [taxonomy, slug]) => currentManager.select(taxonomy, slug),
            manager
        );
    }, [product, productVariations, selections]);

    // When the selection manager changes (i.e., a selection is made), update the context.
    useEffect(() => {
        const selectedVariation = selectionManager.getSelectedVariation();
        setSelectedProductVariation(selectedVariation);
    }, [selectionManager, setSelectedProductVariation]);

    const handleSelectOption = useCallback(
        (attributeTaxonomy: string, optionSlug: string | null) => {
            setSelections(prevSelections => {
                const newSelections = { ...prevSelections };
                if (optionSlug) {
                    newSelections[attributeTaxonomy] = optionSlug;
                } else {
                    delete newSelections[attributeTaxonomy];
                }
                return newSelections;
            });
        },
        [] // No dependencies needed as we use the functional form of setState
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