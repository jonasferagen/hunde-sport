import { useProductVariations } from '@/hooks/data/Product';
import { Product } from '@/models/Product';
import { ProductAttribute } from '@/models/ProductAttribute';
import { useEffect, useMemo, useState } from 'react';

interface UseProductVariantsReturn {
    productVariant: Product | null;
    productVariants: Product[];
    handleOptionSelect: (attributeId: number, option: string) => void;
    availableOptions: Map<number, Map<string, Product[]>>;
    selectedOptions: Record<number, string>;
    variationAttributes: ProductAttribute[];
    isLoading: boolean;
}

export const useProductVariants = (product: Product): UseProductVariantsReturn => {

    const isVariable = product.type === 'variable';

    const { productVariations: productVariants, isLoading: isInitialLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useProductVariations(product.id);

    const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({});
    const [initializedForProductId, setInitializedForProductId] = useState<number | null>(null);
    const [isFetchingAll, setIsFetchingAll] = useState(isVariable);

    useEffect(() => {
        if (!isVariable) return;

        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
            return;
        }
        if (!hasNextPage) {
            setIsFetchingAll(false);
        }

        // Guard to ensure this runs only once per product when data is ready.
        if (productVariants && product.id !== initializedForProductId) {
            setInitializedForProductId(product.id);
        }
    }, [productVariants, product, initializedForProductId, hasNextPage, isFetchingNextPage, isVariable]);

    const variationAttributes = useMemo(() => {
        if (!isVariable) return [];
        return product.getVariationAttributes();
    }, [product, isVariable]);

    const productVariant = useMemo(() => {
        if (!isVariable || !productVariants || Object.keys(selectedOptions).length < variationAttributes.length) {
            return null;
        }
        return product.findVariant(productVariants, selectedOptions) || null;
    }, [selectedOptions, productVariants, product, isVariable, variationAttributes]);

    const handleOptionSelect = (attributeId: number, optionName: string) => {
        setSelectedOptions(prev => {
            const newOptions = { ...prev };
            if (newOptions[attributeId] === optionName) {
                // If the same option is selected again, unselect it.
                delete newOptions[attributeId];
            } else {
                // Otherwise, select the new option.
                newOptions[attributeId] = optionName;
            }
            return newOptions;
        });
    };

    const availableOptions = useMemo(() => {
        if (!isVariable || !productVariants) return new Map();
        return product.getAvailableOptions(productVariants, selectedOptions);
    }, [product, productVariants, selectedOptions, isVariable]);

    return {
        productVariant,
        productVariants: productVariants || [],
        handleOptionSelect,
        availableOptions,
        selectedOptions,
        variationAttributes: variationAttributes,
        isLoading: !isVariable ? false : (isInitialLoading || hasNextPage || isFetchingAll),
    };
};
