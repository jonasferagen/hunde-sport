import { VariableProduct } from '@/models/Product/Product';
import { VariationSelection } from '@/models/Product/helpers/VariationSelection';
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

    const selectionManager = useMemo(() => {
        return Object.entries(selections).reduce(
            (manager, [attributeName, slug]) => manager.select(attributeName, slug),
            baseSelectionManager
        );
    }, [baseSelectionManager, selections]);

    useEffect(() => {
        const selectedVariation = selectionManager.getSelectedVariation();
        onProductVariationSelected(selectedVariation);
    }, [selectionManager, onProductVariationSelected]);

    const handleSelectOption = useCallback((attributeName: string, optionSlug: string | null) => {
        setSelections(prevSelections => {
            const newSelections = { ...prevSelections };
            if (optionSlug) {
                newSelections[attributeName] = optionSlug;
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
    };
};
