import { useCategories } from '@/hooks/data/Category';
import { useCategoryStore } from '@/stores/CategoryStore';
import { useRouter } from 'expo-router';
import React, { JSX, useEffect } from 'react';
import { Spinner, YStack } from 'tamagui';

const Preloader = (): JSX.Element => {
    const { items, isLoading } = useCategories({ autoload: true });
    const { setCategories, setIsLoading } = useCategoryStore();
    const router = useRouter();

    useEffect(() => {
        setCategories(items);
    }, [items, setCategories]);

    useEffect(() => {
        setIsLoading(isLoading);
    }, [isLoading, setIsLoading]);

    useEffect(() => {
        if (!isLoading && items.length > 0) {
            router.replace('/(app)');
        }
    }, [isLoading, items, router]);

    return (
        <YStack f={1} jc="center" ai="center">
            <Spinner size="large" color="$orange10" />
        </YStack>
    );
};

export default Preloader;