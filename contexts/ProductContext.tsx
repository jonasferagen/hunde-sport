import { DebugTrigger } from '@/components/debug/DebugTrigger';
import { useProduct, useProductVariations } from '@/hooks/data/Product';
import { ProductVariation, PurchasableProduct } from '@/models/Product/Product';
import { createPurchasable, Purchasable } from '@/models/Product/Purchasable';
import { LoadingScreen } from '@/screens/misc/LoadingScreen';
import { NotFoundScreen } from '@/screens/misc/NotFoundScreen';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { ProductCategoryProvider } from './ProductCategoryContext';

/**
 * Interface for the ProductContext
 */
export interface ProductContextType {
    product: PurchasableProduct;
    purchasable: Purchasable;
    isLoading: boolean;
    selectedProductVariation: ProductVariation | undefined;
    setSelectedProductVariation: (variation: ProductVariation | undefined) => void;
    productVariations: ProductVariation[] | undefined;

}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProductContext = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProductContext must be used within a ProductProvider');
    }
    return context;
};


export const ProductLoader: React.FC<{ id: number; productCategoryId?: number; children: React.ReactNode }> = ({
    id,
    productCategoryId,
    children,
}) => {
    const { data: product, isLoading } = useProduct(id);

    if (isLoading) {
        return <LoadingScreen />;
    }
    if (!product) {
        return <NotFoundScreen message="Beklager, produktet ble ikke funnet" />;
    }

    if (product.type === 'variation') {
        throw new Error('Not supported for product variations');
    }

    return <ProductCategoryProvider productCategoryId={productCategoryId} productCategories={product.categories} >
        <ProductProvider product={product}>{children}</ProductProvider>
    </ProductCategoryProvider>;
};


export const ProductProvider: React.FC<{ product: PurchasableProduct; children: React.ReactNode; showDebug?: boolean }> = ({
    product,
    children,
    showDebug = true,
}) => {

    const { isLoading, items: variations } = useProductVariations(product);
    const [productVariations, setProductVariations] = useState<ProductVariation[]>([]);
    const [selectedProductVariation, setSelectedProductVariation] = useState<ProductVariation | undefined>(undefined);

    // Reset variation state if the product itself changes
    useEffect(() => {
        setProductVariations([]);
        setSelectedProductVariation(undefined);
    }, [product]);

    // Update variations when they are loaded for the current product
    useEffect(() => {
        if (!isLoading && variations) {
            setProductVariations(variations);
        }
    }, [isLoading, variations]);

    const value = useMemo(() => {
        const purchasable = createPurchasable({ product, productVariation: selectedProductVariation });

        return {
            product,
            purchasable,
            isLoading,
            selectedProductVariation,
            setSelectedProductVariation,
            productVariations,
        };
    }, [product, selectedProductVariation, isLoading, productVariations]);

    return (
        <ProductContext.Provider value={value}>
            <View style={{ flex: 1 }}>
                {children}
                {showDebug && <DebugTrigger product={product} />}
            </View>
        </ProductContext.Provider>
    );
};
