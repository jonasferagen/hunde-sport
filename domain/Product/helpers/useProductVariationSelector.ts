import { VariableProduct } from '@/domain/Product/Product';
import { VariationSelection } from '@/domain/Product/helpers/VariationSelection';
import { ProductVariation } from '@/types';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface UseProductVariationSelectorProps {
    product: VariableProduct;
    productVariations: ProductVariation[];
    onProductVariationSelected: (variation: ProductVariation | undefined) => void;

}

export const useProductVariationSelector = ({
    product,
    productVariations,
    onProductVariationSelected,
}: UseProductVariationSelectorProps) => {
    const [selections, setSelections] = useState<Record<string, string>>({});

    const baseSelectionManager = useMemo(
        () => VariationSelection.create(product, productVariations),
        [product, productVariations]
    );
    const unavailableOptions = useMemo(() => {
        const result: Record<string, string[]> = {};

        product.attributes.forEach(attribute => {
            const unavailable = baseSelectionManager
                .getAvailableOptions(attribute.name)
                .filter(option => !option.isAvailable)
                .map(option => option.name);

            if (unavailable.length > 0) {
                result[attribute.name] = unavailable;
            }
        });

        return result;
    }, [baseSelectionManager, product.attributes]);


    const selectionManager = useMemo(() => {
        return Object.entries(selections).reduce(
            (manager, [attributeName, name]) => manager.select(attributeName, name),
            baseSelectionManager
        );
    }, [baseSelectionManager, selections]);

    useEffect(() => {
        const selectedVariation = selectionManager.getSelectedVariation();
        onProductVariationSelected(selectedVariation);
    }, [selectionManager, onProductVariationSelected]);

    const handleSelectOption = useCallback((attributeName: string, name: string | null) => {
        setSelections(prevSelections => {
            const newSelections = { ...prevSelections };
            if (name) {
                newSelections[attributeName] = name;
            } else {
                delete newSelections[attributeName];
            }
            return newSelections;
        });
    }, []);

    const attributes = useMemo(() => product.getAttributesForVariationSelection(), [product]);

    return {
        selectionManager,
        attributes,
        handleSelectOption,
        unavailableOptions,
    };
};
