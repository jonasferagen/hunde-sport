import { useInitializeCart } from '@/hooks/data/Cart';
import { useCategories } from '@/hooks/data/Category';
import { useCategoryStore } from '@/stores/CategoryStore';
import { useRouter } from 'expo-router';
import React, { JSX, useEffect } from 'react';
import { Spinner, YStack } from 'tamagui';

const Preloader = (): JSX.Element => {
    // Categories
    const {
        items: categories,
        isLoading: isCategoriesLoading,
        isFetchingNextPage: isFetchingNextCategories,
        hasNextPage: hasNextCategoriesPage
    } = useCategories({ autoload: true });
    const { setCategories } = useCategoryStore();

    // Cart
    const { isLoading: isCartLoading } = useInitializeCart();

    const router = useRouter();

    const allCategoriesFetched = !hasNextCategoriesPage;
    const isWaiting = isCategoriesLoading || isFetchingNextCategories || isCartLoading;

    useEffect(() => {
        if (categories.length > 0) {
            setCategories(categories);
        }
    }, [categories, setCategories]);

    useEffect(() => {
        if (!isWaiting && allCategoriesFetched && categories.length > 0) {
            router.replace('/(app)');
        }
    }, [isWaiting, allCategoriesFetched, categories, router]);

    return (
        <YStack f={1} jc="center" ai="center">
            <Spinner size="large" color="$orange10" />
        </YStack>
    );
};

export default Preloader;