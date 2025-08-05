import { ThemedSpinner } from '@/components/ui/ThemedSpinner';
import { useProductCategories } from '@/hooks/data/ProductCategory';
import { useCartStore } from '@/stores/CartStore';
import { useProductCategoryStore } from '@/stores/ProductCategoryStore';
import { useRouter } from 'expo-router';
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
    const addItem = useCartStore((state) => state.addItem);

    useEffect(() => {
        initializeCart();
    }, [initializeCart]);

    useEffect(() => {
        if (isInitialized) {
            // --- TEMPORARY TEST CODE ---
            console.log('TEST: Cart initialized. Adding test item...');
            addItem({ id: 248212, quantity: 1, variation: [] }).finally(() => {
                console.log('TEST: Add item call finished.');
                onReady();
            });
            // --- END TEMPORARY TEST CODE ---
        }
    }, [isInitialized, onReady, addItem]);

    return null; // Logic-only component
};

/**
 * Handles fetching all product categories and reports when ready.
 */
const CategoryLoader = ({ onReady }: LoaderProps) => {
    const { items: productCategories, isLoading } = useProductCategories();
    const setCategoriesInStore = useProductCategoryStore((state) => state.setProductCategories);

    useEffect(() => {
        // The loader is ready once fetching is complete and we have a definitive result.
        if (!isLoading && productCategories) {
            setCategoriesInStore(productCategories);
            onReady();
        }
    }, [isLoading, productCategories, onReady, setCategoriesInStore]);

    return null; // Logic-only component
};

// --- Main Preloader Screen ---

export const PreloaderScreen = (): JSX.Element => {
    const [isCartReady, setCartReady] = useState(false);
    const [areCategoriesReady, setCategoriesReady] = useState(false);
    const router = useRouter();

    const handleCartReady = useCallback(() => setCartReady(true), []);
    const handleCategoriesReady = useCallback(() => setCategoriesReady(true), []);

    useEffect(() => {
        if (isCartReady && areCategoriesReady) {
            router.replace('/(app)');
        }
    }, [isCartReady, areCategoriesReady, router]);

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

/*
  <YStack ai="center" gap="$2"></YStack>
<SizableText>Laster inn data...</SizableText>
                    <Progress value={progress} w={200}>
                        <Progress.Indicator animation="linearSlow" />
                    </Progress>
                    <SizableText theme="alt2">{categories.length} / {totalCategories}</SizableText>
        */