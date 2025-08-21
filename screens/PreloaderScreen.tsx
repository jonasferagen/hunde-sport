// app/(preloader)/PreloaderScreen.tsx


import { useProductCategories } from '@/hooks/data/ProductCategory';
import { useCartStore } from '@/stores/cartStore';
import { useProductCategoryStore } from '@/stores/productCategoryStore';
import { useFonts } from 'expo-font';
import { Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Image, Paragraph, Theme, YStack } from 'tamagui';
export const PreloaderScreen = () => {

    const splashHidden = useRef(false);

    // 1) Fonts
    const [fontsLoaded] = useFonts({
        Inter: require('@/assets/fonts/Inter/Inter-Regular.ttf'),
        'Inter-Bold': require('@/assets/fonts/Inter/Inter-Bold.ttf'),
        Montserrat: require('@/assets/fonts/Montserrat/Montserrat-Regular.ttf'),
        'Montserrat-Bold': require('@/assets/fonts/Montserrat/Montserrat-Bold.ttf'),
    });
    useEffect(() => {
        // Hide splash as soon as we can render with correct fonts
        if (fontsLoaded && !splashHidden.current) {
            splashHidden.current = true;
            SplashScreen.hideAsync().catch(() => { });
            setStep('cart');
        }
    }, [fontsLoaded]);
    // 2) Cart init (Zustand)
    const isInitialized = useCartStore(s => s.isInitialized);
    const initializeCart = useCartStore(s => s.initializeCart);

    useEffect(() => {
        if (isInitialized) {
            setStep('categories');
            return;
        }
        initializeCart();
    }, [isInitialized, initializeCart]);
    // 3) Categories (TanStack Query v5 — infinite)

    const setCategoriesInStore = useProductCategoryStore((s) => s.setProductCategories);

    const [ready, setReady] = useState(false);
    const [error, setError] = useState<null | string>(null);
    const mounted = useRef(true);
    useEffect(() => () => { mounted.current = false; }, []);

    // optional: user-facing progress labels
    const [step, setStep] = useState<'fonts' | 'cart' | 'categories' | 'done'>('fonts');
    const stepLabel = useMemo(() => {
        switch (step) {
            case 'fonts': return 'Laster skrifttyper…';
            case 'cart': return 'Initialiserer handlekurv…';
            case 'categories': return 'Henter kategorier…';
            default: return 'Starter…';
        }
    }, [step]);

    const queryResult = useProductCategories();
    useEffect(() => {
        // wait for fonts first if you like
        if (!fontsLoaded) return;
        setStep('categories');
        const { isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = queryResult;
        const isDone = !isLoading && !hasNextPage && !isFetchingNextPage;

        if (!isDone) {
            fetchNextPage();
            return;
        }

        const categories = queryResult.items;
        useProductCategoryStore.getState().setProductCategories(categories);
        setReady(true);

    }, [fontsLoaded, queryResult]);

    if (ready) return <Redirect href="/(app)" />;
    const splashImage = require('@/assets/images/splash-icon.png');
    return (
        <Theme name="light">
            <YStack f={1} jc="center" ai="center" bg="$background">
                {/* same logo as splash */}
                <Image source={splashImage} style={{ width: 200, height: 200, marginBottom: 16 }} />
                {/* step label */}
                {stepLabel && <Paragraph o={0.7}>{stepLabel}</Paragraph>}
            </YStack>
        </Theme>
    );
};
