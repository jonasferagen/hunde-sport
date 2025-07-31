import { Product, ProductVariation } from '@/models/Product';
import { useCallback, useMemo, useState } from 'react';

/**
 * A helper function to extract the selected options from a given product variation.
 * @param variation The product variation.
 * @returns A record mapping attribute IDs to option names.
 */
const getOptionsFromVariation = (variation: ProductVariation | null | undefined): Record<number, string> => {
    if (!variation?.attributes) return {};
    return variation.attributes.reduce((acc, attr) => {
        if (attr.id && attr.option) {
            acc[attr.id] = attr.option;
        }
        return acc;
    }, {} as Record<number, string>);
};

/**
 * Represents the state of a single attribute option.
 */
export interface OptionState {
    isSelected: boolean;
    isAvailable: boolean;
    isOutOfStock: boolean;
    matchingVariation: ProductVariation | null;
    priceRange?: { min: number; max: number };
    isFinalOption: boolean;
}

/**
 * A custom hook to manage the complex logic of product variation selection.
 * It determines option availability, finds the selected variation, and manages selection state.
 */
export const useProductVariations = (
    product: Product,
    productVariations: ProductVariation[],
    initialProductVariation?: ProductVariation | null
) => {
    // State for the currently selected options (attributeId -> optionName)
    const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>(() =>
        getOptionsFromVariation(initialProductVariation)
    );

    // Memoized list of attributes that are used for variations.
    const productVariationAttributes = useMemo(() =>
        product.attributes.filter(attr => attr.variation),
        [product.attributes]
    );

    // Memoized lookup tables for efficient variation searching.
    const variationData = useMemo(() => {
        const index = new Map<string, Set<number>>(); // Key: 'attrId:option', Value: Set of variation IDs
        const variationMap = new Map<number, ProductVariation>(); // Key: variation ID, Value: ProductVariation

        productVariations.forEach(v => {
            variationMap.set(v.id, v);
            v.attributes.forEach(attr => {
                const key = `${attr.id}:${attr.option}`;
                if (!index.has(key)) {
                    index.set(key, new Set());
                }
                index.get(key)!.add(v.id);
            });
        });

        return { index, variationMap };
    }, [productVariations]);

    // Memoized calculation of the final selected variation.
    const selectedVariation = useMemo(() => {
        // A variation can only be determined if all variation attributes have a selected option.
        if (Object.keys(selectedOptions).length !== productVariationAttributes.length) {
            return null;
        }

        // Get the sets of variation IDs for each selected option.
        const idSets = Object.entries(selectedOptions).map(([attrId, option]) =>
            variationData.index.get(`${attrId}:${option}`) || new Set<number>()
        );

        if (idSets.some(s => s.size === 0)) return null;

        // Find the intersection of all sets to get the matching variation ID.
        const intersection = idSets.reduce((acc, currentSet) =>
            new Set([...acc].filter(id => currentSet.has(id)))
        );

        if (intersection.size === 1) {
            const finalId = intersection.values().next().value;
            return variationData.variationMap.get(finalId!) || null;
        }

        return null;
    }, [selectedOptions, variationData, productVariationAttributes]);

    // Callback to handle selecting an option.
    const selectOption = useCallback((attributeId: number, optionName: string) => {
        setSelectedOptions(prev => ({
            ...prev,
            [attributeId]: optionName,
        }));
    }, []);

    // Callback to get the state of a specific option.
    const getOptionState = useCallback(
        (attributeId: number, optionName: string): OptionState => {
            const isSelected = selectedOptions[attributeId] === optionName;

            // Find variations that match the *other* selected options.
            const otherSelections = Object.entries(selectedOptions).filter(([id]) => Number(id) !== attributeId);
            const potentialMatches = otherSelections.reduce((acc, [id, opt]) => {
                const matchingIds = variationData.index.get(`${id}:${opt}`) || new Set();
                return new Set([...acc].filter(variationId => matchingIds.has(variationId)));
            }, new Set(variationData.variationMap.keys()));

            // Find variations that also match the current option being evaluated.
            const optionSpecificMatches = variationData.index.get(`${attributeId}:${optionName}`) || new Set();
            const finalMatches = new Set([...potentialMatches].filter(id => optionSpecificMatches.has(id)));

            const isAvailable = finalMatches.size > 0;
            const matchingVariations = [...finalMatches].map(id => variationData.variationMap.get(id)!);

            const singleVariant = matchingVariations.length === 1 ? matchingVariations[0] : null;
            const isOutOfStock = singleVariant ? !singleVariant.is_in_stock : false;

            // Determine if selecting this option would complete the selection.
            const selectionCountAfterClick = Object.keys(selectedOptions).length + (selectedOptions[attributeId] ? 0 : 1);
            const isFinalSelectionStep = selectionCountAfterClick === productVariationAttributes.length;
            const isFinalOption = !!singleVariant && isFinalSelectionStep;

            const priceRange = isAvailable
                ? {
                    min: Math.min(...matchingVariations.map(v => parseFloat(v.prices.price))),
                    max: Math.max(...matchingVariations.map(v => parseFloat(v.prices.price))),
                }
                : undefined;

            return {
                isSelected,
                isAvailable,
                isOutOfStock,
                matchingVariation: singleVariant,
                priceRange,
                isFinalOption,
            };
        },
        [selectedOptions, variationData, productVariationAttributes]
    );

    return {
        selectedOptions,
        selectedVariation,
        selectOption,
        getOptionState,
        productVariationAttributes,
    };
};
