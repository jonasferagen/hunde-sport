import { useProductVariations as useProductVariationsData } from '@/hooks/data/Product';
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
    productVariations: ProductVariation[];
    priceRange: { min: number; max: number } | undefined;
    isLoading: boolean;
    isProductVariationsLoading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const VariableProductProvider: React.FC<{
    product: VariableProduct;
    initialProductVariation?: ProductVariation;
    children: React.ReactNode;
}> = ({ product, initialProductVariation, children }) => {
    const [productVariation, setProductVariation] = useState<ProductVariation | undefined>(initialProductVariation);

    const { data: productVariations, isLoading: isProductVariationsLoading } = useProductVariationsData(product, {
        enabled: true,
    });

    const priceRange = useMemo(() => calculatePriceRange(productVariations), [productVariations]);

    const value: ProductContextType = {
        product,
        productVariation,
        productVariations: productVariations || [],
        priceRange,
        isLoading: false,
        isProductVariationsLoading,
    };

    return (
        <ProductContext.Provider value={value}>
            <ProductVariationSelectionProvider
                product={product}
                productVariations={productVariations || []}
                initialProductVariation={initialProductVariation}
                setProductVariation={setProductVariation}
            >
                {children}
            </ProductVariationSelectionProvider>
        </ProductContext.Provider>
    );
};

export const ProductProvider: React.FC<{ product: Product; productVariation?: ProductVariation; children: React.ReactNode }> = ({
    product,
    productVariation: initialProductVariation,
    children,
}) => {
    if (product.type === 'variable') {
        return (
            <VariableProductProvider product={product as VariableProduct} initialProductVariation={initialProductVariation}>
                {children}
            </VariableProductProvider>
        );
    }

    const value: ProductContextType = {
        product: product as SimpleProduct,
        productVariations: [],
        priceRange: undefined,
        isLoading: false,
        isProductVariationsLoading: false,
    };

    return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProductContext = () => {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error('useProductContext must be used within a ProductProvider');
    }
    return context;
};