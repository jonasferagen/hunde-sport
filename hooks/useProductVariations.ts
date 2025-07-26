import { Product, ProductPriceRange } from '@/models/Product';
import { ProductVariation } from '@/models/ProductVariation';
import { useMemo, useState } from 'react';

// Helper to get initial options from a variation
const getOptionsFromVariation = (variation: ProductVariation | null | undefined) => {
    if (!variation || !variation.attributes) return {};
    return variation.attributes.reduce(
        (acc, attr) => {
            if (attr.id && attr.option) {
                acc[attr.id] = attr.option;
            }
            return acc;
        },
        {} as Record<number, string>
    );
};

/**
 * Represents the state of a single attribute option.
 */
export interface OptionState {
    isSelected: boolean;
    isAvailable: boolean;
    isOutOfStock: boolean;
    matchingVariation: ProductVariation | null;
    priceRange?: ProductPriceRange;
    isFinalOption: boolean;
}

/**
 * Custom hook to manage product variation selection logic.
 * This hook centralizes all the complex logic for selecting product variations,
 * determining option availability, and finding the resulting variation.
 */
export const useProductVariations = (
    product: Product,
    productVariations: ProductVariation[],
    initialProductVariation?: ProductVariation | null
) => {
    const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>(() =>
        getOptionsFromVariation(initialProductVariation)
    );

    const defaultVariation = useMemo(() => {
        if (!product.default_attributes || product.default_attributes.length === 0) {
            return null;
        }

        return (
            productVariations.find(variation => {
                return product.default_attributes.every(defaultAttr => {
                    return variation.attributes.some(
                        vAttr => vAttr.id === defaultAttr.id && vAttr.option === defaultAttr.option
                    );
                });
            }) || null
        );
    }, [product.default_attributes, productVariations]);

    const productVariationAttributes = useMemo(() => {
        return product.attributes.filter(attr => attr.variation);
    }, [product]);

    const { availableOptions, selectedVariation } = useMemo(() => {
        const available = new Map<number, Map<string, ProductVariation[]>>();
        productVariationAttributes.forEach(attribute => {
            const otherSelectedOptions = Object.entries(selectedOptions).filter(([attrId]) => attrId !== attribute.id.toString());
            const matchingVariants = productVariations.filter(variant =>
                otherSelectedOptions.every(([attrId, optionValue]) =>
                    variant.attributes.some(attr => attr.id.toString() === attrId && attr.option === optionValue)
                )
            );

            const attributeOptions = new Map<string, ProductVariation[]>();
            matchingVariants.forEach(variant => {
                variant.attributes.forEach(variantAttr => {
                    if (variantAttr.id === attribute.id && variantAttr.option) {
                        if (!attributeOptions.has(variantAttr.option)) {
                            attributeOptions.set(variantAttr.option, []);
                        }
                        attributeOptions.get(variantAttr.option)?.push(variant);
                    }
                });
            });
            available.set(attribute.id, attributeOptions);
        });

        const findVariation = (variations: ProductVariation[], options: Record<number, string>): ProductVariation | null => {
            const selectedEntries = Object.entries(options);

            // Only find a variation if all attributes have been selected
            if (selectedEntries.length < productVariationAttributes.length) {
                return null;
            }

            return (
                variations.find(variant => {
                    return selectedEntries.every(([attrId, optionValue]) => {
                        return variant.attributes.some(attr => attr.id.toString() === attrId && attr.option === optionValue);
                    });
                }) || null
            );
        };

        const finalVariation = findVariation(productVariations, selectedOptions);

        return { availableOptions: available, selectedVariation: finalVariation };
    }, [product, productVariations, selectedOptions]);

    const selectOption = (attributeId: number, optionName: string) => {
        setSelectedOptions(prev => {
            const newOptions = { ...prev };
            if (prev[attributeId] === optionName) {
                delete newOptions[attributeId];
            } else {
                newOptions[attributeId] = optionName;
            }
            return newOptions;
        });
    };

    const getOptionState = (attributeId: number, optionName: string): OptionState => {
        const isSelected = selectedOptions[attributeId] === optionName;
        const matchingVariations = availableOptions.get(attributeId)?.get(optionName) || [];
        const isAvailable = !!matchingVariations && matchingVariations.length > 0;
        const singleVariant = isAvailable && matchingVariations.length === 1 ? matchingVariations[0] : null;
        const isOutOfStock = singleVariant ? singleVariant.stock_status === 'outofstock' : false;

        const isCurrentlySelected = !!selectedOptions[attributeId];
        const potentialSelectionCount = Object.keys(selectedOptions).length + (isCurrentlySelected ? 0 : 1);
        const isFinalSelectionStep = potentialSelectionCount === productVariationAttributes.length;

        const isFinalOption = !!singleVariant && isFinalSelectionStep;

        return {
            isSelected,
            isAvailable,
            isOutOfStock,
            matchingVariation: singleVariant,
            priceRange: matchingVariations.length > 0 ? {
                min: Math.min(...matchingVariations.map(v => v.price)),
                max: Math.max(...matchingVariations.map(v => v.price))
            } : undefined,
            isFinalOption,
        };
    };

    return {
        selectedOptions,
        selectedVariation,
        selectOption,
        getOptionState,
        productVariationAttributes,
        availableOptions, // Keep this for now for the context
        defaultVariation,
    };
};
