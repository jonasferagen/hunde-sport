import { ThemedSpinner } from '@/components/ui/ThemedSpinner';
import { useCartData } from '@/hooks/data/Cart';
import { useCategories } from '@/hooks/data/Category';
import { useCategoryStore } from '@/stores/CategoryStore';
import { useRouter } from 'expo-router';
import React, { JSX, useEffect, useState } from 'react';
import { Progress, SizableText, Theme, YStack } from 'tamagui';

export const PreloaderScreen = (): JSX.Element => {
    const [isReadyToNavigate, setIsReadyToNavigate] = useState(false);

    // Categories
    const {
        items: categories,
        total: totalCategories,
        isLoading: isCategoriesLoading,
        isFetchingNextPage: isFetchingNextCategories,
        hasNextPage: hasNextCategoriesPage
    } = useCategories({ autoload: true });
    const { setCategories } = useCategoryStore();

    // Cart
    const { isLoading: isCartLoading } = useCartData();

    const router = useRouter();

    const allCategoriesFetched = !hasNextCategoriesPage;
    const isWaiting = isCategoriesLoading || isFetchingNextCategories || isCartLoading;
    const progress = totalCategories > 0 ? (categories.length / totalCategories) * 100 : 0;

    useEffect(() => {
        if (categories.length > 0) {
            setCategories(categories);
        }
    }, [categories, setCategories]);

    useEffect(() => {
        if (!isWaiting && allCategoriesFetched && categories.length > 0) {
            setIsReadyToNavigate(true);
        }
    }, [isWaiting, allCategoriesFetched, categories]);

    useEffect(() => {
        if (isReadyToNavigate) {
            router.replace('/(app)');
        }
    }, [isReadyToNavigate, router]);



    return (
        <Theme name="primary">
            <YStack f={1} jc="center" ai="center" gap="$4">
                <ThemedSpinner size="large" />
                <YStack ai="center" gap="$2">
                    <SizableText>Laster inn kategorier...</SizableText>
                    <Progress value={progress} w={200}>
                        <Progress.Indicator animation="slow" />
                    </Progress>
                    <SizableText theme="alt2">{categories.length} / {totalCategories}</SizableText>
                </YStack>
            </YStack>
        </Theme>
    );
};
