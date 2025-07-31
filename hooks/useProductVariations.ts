import { Product, ProductVariation } from '@/models/Product';
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
    priceRange?: any;
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
    const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>(() => {
        if (initialProductVariation) {
            return getOptionsFromVariation(initialProductVariation);
        }

        const defaultOptions: Record<number, string> = {};
        product.attributes.forEach(attr => {
            if (attr.has_variations && attr.terms) {
                const defaultTerm = attr.terms.find(term => term.default);
                if (defaultTerm) {
                    defaultOptions[attr.id] = defaultTerm.name;
                }
            }
        });

        if (Object.keys(defaultOptions).length > 0) {
            return defaultOptions;
        }

        return {};
    });


    const defaultVariation = useMemo(() => {
        if (!product.attributes || product.attributes.length === 0) {
            return null;
        }

        return (
            productVariations.find(variation => {
                return product.attributes.every(defaultAttr => {
                    return variation.attributes.some(
                        vAttr => vAttr.name === defaultAttr.name && vAttr.option === defaultAttr.option
                    );
                });
            }) || null
        );
    }, [product.attributes, productVariations]);



    const { availableOptions, selectedVariation, productVariationAttributes } = useMemo(() => {
        const attributes = product.attributes.filter(attr => attr.variation);
        const available = new Map<number, Map<string, ProductVariation[]>>();
        attributes.forEach(attribute => {
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
            if (selectedEntries.length < attributes.length) {
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

        return { availableOptions: available, selectedVariation: finalVariation, productVariationAttributes: attributes };
    }, [product.attributes, productVariations, selectedOptions]);

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
        const isOutOfStock = singleVariant ? !singleVariant.is_in_stock : false;

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
                min: Math.min(...matchingVariations.map(v => parseFloat(v.prices.price))),
                max: Math.max(...matchingVariations.map(v => parseFloat(v.prices.price)))
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
