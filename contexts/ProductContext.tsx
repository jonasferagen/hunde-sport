import { useProductVariations } from '@/hooks/data/Product';
import { ProductVariation } from '@/models/Product/ProductVariation';
import { SimpleProduct } from '@/models/Product/SimpleProduct';
import { VariableProduct } from '@/models/Product/VariableProduct';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';



/**
 * Interface for the ProductContext
 */
export interface ProductContextType {
    product: SimpleProduct | VariableProduct;
    //purchasableProduct: Purchasable | undefined;
    // Variation specific
    isLoading: boolean;
    // selectionManager: VariationSelection | null;
    //setSelectionManager: (selectionManager: VariationSelection | null) => void;
    setSelectedVariation: (variation: ProductVariation | undefined) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProductContext = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProductContext must be used within a ProductProvider');
    }
    return context;
};

const VariableProductContextProvider: React.FC<{ product: VariableProduct; children: React.ReactNode }> = ({
    product: initialProduct,
    children,
}) => {
    const [product, setProduct] = useState(initialProduct);

    const { isLoading, items: productVariations } = useProductVariations(product);


    const setSelectedVariation = useCallback(
        (variation: ProductVariation | undefined) => {
            setProduct((currentProduct) => {
                const newProduct = currentProduct.clone();
                newProduct.setSelectedVariation(variation);
                return newProduct;
            });
        },
        [setProduct]
    );


    useEffect(() => {
        if (!isLoading) {
            product.setVariationsData(productVariations);
        }
    }, [product, isLoading, productVariations]);


    const value: ProductContextType = {
        product,
        isLoading,
        setSelectedVariation,
    };

    return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const ProductProvider: React.FC<{ product: SimpleProduct | VariableProduct; children: React.ReactNode }> = ({
    product,
    children,
}) => {
    if (product instanceof VariableProduct) {
        return <VariableProductContextProvider product={product}>{children}</VariableProductContextProvider>;
    }

    const value: ProductContextType = {
        product,
        isLoading: false,
        setSelectedVariation: () => { },
    };

    return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};