import { ThemedSpinner } from '@/components/ui/ThemedSpinner';
import { useProductContext } from '@/contexts';
import { VariableProduct } from '@/models/Product/VariableProduct';
import { VariationSelection } from '@/models/Product/helpers/VariationSelection';
import { ProductVariation } from '@/types';
import React, { JSX, useCallback, useEffect, useMemo, useState } from 'react';
import { SizableText, XStack, YStack } from 'tamagui';
import { AttributeSelector } from './AttributeSelector';

interface VariationSelectorProps {
    product: VariableProduct;
    productVariations: ProductVariation[];
    onProductVariationSelected: (variation: ProductVariation | undefined) => void;
}

const VariationSelector = ({ product, productVariations, onProductVariationSelected: onVariationSelected }: VariationSelectorProps): JSX.Element => {
    const [selections, setSelections] = useState<Record<string, string>>({});

    const baseSelectionManager = useMemo(() => VariationSelection.create(product, productVariations), [product, productVariations]);
    const selectionManager = useMemo(() => {
        return Object.entries(selections).reduce(
            (manager, [taxonomy, slug]) => manager.select(taxonomy, slug),
            baseSelectionManager
        );
    }, [baseSelectionManager, selections]);

    useEffect(() => {
        const selectedVariation = selectionManager.getSelectedVariation();
        onVariationSelected(selectedVariation);
    }, [selectionManager, onVariationSelected]);

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
        []
    );

    const attributes = useMemo(() => product.getAttributesForVariationSelection(), [product]);
    if (attributes.length === 0) {
        return <></>;
    }

    return (
        <XStack gap="$2" flexWrap="wrap">
            {attributes.map(({ id, taxonomy, name }) => {
                const options = selectionManager.getAvailableOptions(taxonomy);
                const selectedValue = selectionManager.getSelectedOption(taxonomy);
                if (options.length === 0) return null;

                return (
                    <YStack key={id} gap="$1" f={1}>
                        <SizableText size="$3" fontWeight="bold">{name}</SizableText>
                        <AttributeSelector
                            options={options}
                            selectedValue={selectedValue}
                            onSelect={(value) => handleSelectOption(taxonomy, value)}
                        />
                    </YStack>
                );
            })}

        </XStack>
    );
};

export const ProductVariations = (): JSX.Element => {
    const { isLoading, product: initialProduct, setSelectedProductVariation, productVariations } = useProductContext();

    if (!(initialProduct instanceof VariableProduct)) {
        return <></>;
    }
    const product = initialProduct as VariableProduct;
    if (isLoading) {
        return <ThemedSpinner />;
    }

    return (
        <VariationSelector
            product={product}
            productVariations={productVariations || []}
            onProductVariationSelected={setSelectedProductVariation}
        />
    );
};