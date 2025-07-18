import { Product } from '@/types';
import { useEffect, useState } from 'react';
import { useProducts } from './Product';

export const useProductVariations = (product: Product | null | undefined) => {
    const { products: variations } = useProducts(product?.variations || []);

    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
    const [selectedVariation, setSelectedVariation] = useState<Product | null>(null);

    // Set initial variation when variations are loaded
    useEffect(() => {
        // Only set initial options if no options are selected yet
        if (variations && variations.length > 0 && Object.keys(selectedOptions).length === 0) {
            const firstVariation = variations[0];
            const initialOptions: Record<string, string> = {};
            firstVariation.attributes.forEach(attr => {
                if (attr.option) { // Ensure there is an option to select
                    initialOptions[attr.slug] = attr.option;
                }
            });

            setSelectedOptions(initialOptions);
        }
    }, [variations, selectedOptions]);

    // Find the matching variation when selected options change
    useEffect(() => {
        if (!product) return;

        const allOptionsSelected = product.attributes
            .filter(attr => attr.variation)
            .every(attr => selectedOptions[attr.slug]);

        if (allOptionsSelected) {
            const foundVariation = variations.find(variation =>
                variation.attributes.every(attr => selectedOptions[attr.slug] === attr.option)
            );
            setSelectedVariation(foundVariation || null);
        } else {
            setSelectedVariation(null);
        }
    }, [selectedOptions, variations, product]);

    const handleSelectOption = (attributeSlug: string, option: string) => {

        console.log("selecting option " + attributeSlug + " " + option);

        setSelectedOptions(prev => ({
            ...prev,
            [attributeSlug]: option,
        }));
    };
    const displayProduct = selectedVariation || product;

    return {
        displayProduct,
        selectedOptions,
        handleSelectOption,
    };
};
