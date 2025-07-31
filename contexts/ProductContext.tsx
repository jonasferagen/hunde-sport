import { useProductVariations } from '@/hooks/data/Product';
import { Product, ProductVariation, SimpleProduct, VariableProduct } from '@/models/Product';
import React, { createContext, useContext, useMemo, useState } from 'react';
import { ProductVariationSelectionProvider } from './ProductVariationSelectionContext';

export const calculatePriceRange = (productVariations: ProductVariation[]): { min: number; max: number } | undefined => {
    if (!productVariations || productVariations.length === 0) {
        return undefined;
    }

    const prices = productVariations.map((p) => parseFloat(p.prices.price)).filter((p) => p > 0);

    if (prices.length === 0) {
        return undefined;
    }

    const min = Math.min(...prices);
    const max = Math.max(...prices);

    return { min, max };
};

interface ProductContextType {
    product: SimpleProduct | VariableProduct;
    productVariation?: ProductVariation | undefined;
    setProductVariation: (variation: ProductVariation | undefined) => void;
    productVariations: ProductVariation[];
    priceRange: { min: number; max: number } | undefined;
    isLoading: boolean;
    isProductVariationsLoading: boolean;

}

const ProductContext = createContext<ProductContextType | undefined>(undefined);


export const ProductProvider: React.FC<{ product: Product; productVariation?: ProductVariation | undefined; children: React.ReactNode }> = ({
    product,
    productVariation: initialProductVariation,
    children,
}) => {
    const [productVariation, setProductVariation] = useState<ProductVariation | undefined>(initialProductVariation);


    const { data: productVariations, isLoading: isProductVariationsLoading } = useProductVariations(product as VariableProduct);


    const priceRange = useMemo(() => calculatePriceRange(productVariations), [productVariations]);

    const value = {
        product,
        productVariation,
        setProductVariation,
        productVariations: productVariations || [],
        priceRange,
        isLoading: false,
        isProductVariationsLoading,

    };


    const content = product.type === 'variable' && !isProductVariationsLoading ? (
        <ProductVariationSelectionProvider
            product={product as VariableProduct}
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