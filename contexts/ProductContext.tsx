import { useProductVariations } from '@/hooks/data/Product';
import { Product } from '@/models/Product';
import { ProductVariation } from '@/models/ProductVariation';
import React, { createContext, useContext, useMemo, useState } from 'react';
import { ProductVariationSelectionProvider } from './ProductVariationSelectionContext';

export const calculatePriceRange = (productVariations: ProductVariation[]): { min: number; max: number } | undefined => {
    if (!productVariations || productVariations.length === 0) {
        return undefined
    }

    const prices = productVariations.map((p) => p.price).filter((p) => p > 0);

    const min = Math.min(...prices);
    const max = Math.max(...prices);

    return { min, max };
};

interface ProductContextType {
    product: Product;
    productVariation?: ProductVariation | null;
    setProductVariation: (variation: ProductVariation | null) => void;
    productVariations: ProductVariation[];
    priceRange: { min: number; max: number } | undefined;
    isLoading: boolean;
    isProductVariationsLoading: boolean;

}

const ProductContext = createContext<ProductContextType | undefined>(undefined);


export const ProductProvider: React.FC<{ product: Product; productVariation?: ProductVariation | null; children: React.ReactNode }> = ({
    product,
    productVariation: initialProductVariation,
    children,
}) => {
    const [productVariation, setProductVariation] = useState<ProductVariation | null | undefined>(initialProductVariation);

    const {
        items: productVariations,
        isLoading,
        isFetchingNextPage,
        hasNextPage,

    } = useProductVariations(product.id, { enabled: product.type === 'variable', autoload: true });

    const priceRange = useMemo(() => calculatePriceRange(productVariations), [productVariations]);

    const value = {
        product,
        productVariation,
        setProductVariation,
        productVariations: productVariations || [],
        priceRange,
        isLoading,
        isProductVariationsLoading: isLoading || isFetchingNextPage || hasNextPage,

    };

    const content = product.type === 'variable' ? (
        <ProductVariationSelectionProvider
            product={product}
            productVariations={productVariations || []}
            initialProductVariation={initialProductVariation}
            setProductVariation={setProductVariation}
        >
            {children}
        </ProductVariationSelectionProvider>
    ) : children;

    return <ProductContext.Provider value={value}>{content}</ProductContext.Provider>;
};

export const useProductContext = () => {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error('useProductContext must be used within a ProductProvider');
    }
    return context;
};