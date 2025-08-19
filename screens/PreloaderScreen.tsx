import { ThemedSpinner } from '@/components/ui/themed-components/ThemedSpinner';
import { useProductCategories } from '@/hooks/data/ProductCategory';
import { useCartStore } from '@/stores/cartStore';
import { useProductCategoryStore } from '@/stores/productCategoryStore';
import { Redirect } from 'expo-router';
import React, { JSX, useCallback, useEffect, useState } from 'react';
import { Theme, YStack } from 'tamagui';

// --- Subcomponents for isolated data loading ---

interface LoaderProps {
    onReady: () => void;
}

/**
 * Handles initializing the cart and reports when it's ready.
 */
const CartInitializer = ({ onReady }: LoaderProps) => {
    const initializeCart = useCartStore((state) => state.initializeCart);
    const isInitialized = useCartStore((state) => state.isInitialized);

    useEffect(() => {
        initializeCart();
    }, [initializeCart]);

    useEffect(() => {
        if (isInitialized) {
            onReady();
        }
    }, [isInitialized, onReady]);

    return null;
};

/**
 * Handles fetching all product categories and reports when ready.
 */
const CategoryLoader = ({ onReady }: LoaderProps): JSX.Element => {
    const { items: productCategories, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useProductCategories();
    const setCategoriesInStore = useProductCategoryStore((state) => state.setProductCategories);

    useEffect(() => {
        // The loader is ready once fetching is complete and we have a definitive result.
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }

        if (!isLoading && !hasNextPage && !isFetchingNextPage) {
            setCategoriesInStore(productCategories);
            onReady();
        }
    }, [isLoading, productCategories, onReady, setCategoriesInStore, hasNextPage, fetchNextPage, isFetchingNextPage]);

    return <></>;
};

// --- Main Preloader Screen ---

export const PreloaderScreen = (): JSX.Element => {
    const [isCartReady, setCartReady] = useState(false);
    const [areCategoriesReady, setCategoriesReady] = useState(false);

    const handleCartReady = useCallback(() => setCartReady(true), []);
    const handleCategoriesReady = useCallback(() => setCategoriesReady(true), []);



    if (isCartReady && areCategoriesReady) {
        return <Redirect href="/(app)" />;
    }

    return (
        <Theme name="primary">
            <CartInitializer onReady={handleCartReady} />
            <CategoryLoader onReady={handleCategoriesReady} />
            <YStack f={1} jc="center" ai="center" gap="$4">
                <ThemedSpinner size="large" />
            </YStack>
        </Theme>
    );
};
