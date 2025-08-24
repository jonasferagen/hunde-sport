// app/(preloader)/PreloaderScreen.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Redirect } from 'expo-router';
import { Image, Paragraph, Theme, YStack, Button } from 'tamagui';
import { useFonts } from 'expo-font';
import { useCartStore } from '@/stores/cartStore';
import { useProductCategoryStore } from '@/stores/productCategoryStore';
import { useProductCategories } from '@/hooks/data/ProductCategory';
import { queryClient } from '@/lib/queryClient';

SplashScreen.preventAutoHideAsync().catch(() => { });

export const PreloaderScreen = () => {
    const splashHidden = useRef(false);
    const hideSplash = () => {
        if (!splashHidden.current) {
            splashHidden.current = true;
            SplashScreen.hideAsync().catch(() => { });
        }
    };

    // Fonts
    const [fontsReady] = useFonts({
        Inter: require('@/assets/fonts/Inter/Inter-Regular.ttf'),
        'Inter-Bold': require('@/assets/fonts/Inter/Inter-Bold.ttf'),
        Montserrat: require('@/assets/fonts/Montserrat/Montserrat-Regular.ttf'),
        'Montserrat-Bold': require('@/assets/fonts/Montserrat/Montserrat-Bold.ttf'),
    });

    // Cart
    const initializeCart = useCartStore(s => s.initializeCart);
    const cartReady = useCartStore(s => s.isInitialized);

    // Categories (infinite)
    const cats = useProductCategories();
    const setCategories = useProductCategoryStore(s => s.setProductCategories);
    const [catsReady, setCatsReady] = useState(false);

    // Start cart when fonts are ready
    useEffect(() => {
        if (fontsReady && !cartReady) initializeCart();
    }, [fontsReady, cartReady, initializeCart]);

    // Hide native splash once fonts are ready (so our UI renders correctly)
    useEffect(() => {
        if (fontsReady) hideSplash();
    }, [fontsReady]);


    const { error, isLoading, hasNextPage, isFetching, isFetchingNextPage, fetchNextPage } = cats;

    // Drain categories page-by-page (no while-loop, no ref)
    useEffect(() => {
        if (error) return; // wait for user retry
        if (isLoading) return;

        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
            return;
        }

        // no more pages + nothing in flight => ready
        if (!hasNextPage && !isFetching && !isFetchingNextPage) {
            setCatsReady(true);
        }
    }, [
        hasNextPage,
        isFetchingNextPage,
        isFetching,
        isLoading,
        error,
        fetchNextPage,
    ]);

    // Push flattened items into your store whenever they change
    useEffect(() => {
        setCategories(cats.items);
    }, [cats.items, setCategories]);

    // Step label (first unmet gate)
    const stepLabel = useMemo(() => {
        if (!fontsReady) return 'Laster skrifttyper…';
        if (!cartReady) return 'Initialiserer handlekurv…';

        const count = cats.items?.length ?? 0;
        const total = cats.total ?? 0;
        if (cats.error) return 'Kunne ikke hente kategorier';
        if (!catsReady) {
            const suffix =
                total > 0 ? ` (${Math.min(count, total)}/${total})` : count ? ` (${count}…)` : '';
            return `Henter kategorier…${suffix}`;
        }
        return 'Starter…';
    }, [fontsReady, cartReady, catsReady, cats.items, cats.total, cats.error]);

    // All ready?
    if (fontsReady && cartReady && catsReady) {
        return <Redirect href="/(app)" />;
    }

    const splashImage = require('@/assets/images/splash-icon.png');

    return (
        <Theme name="light">
            <YStack f={1} jc="center" ai="center" bg="$background" gap="$3" p="$4">
                <Image source={splashImage} style={{ width: 200, height: 200 }} />
                {!!stepLabel && <Paragraph o={0.7}>{stepLabel}</Paragraph>}

                {cats.error && (
                    <>
                        <Paragraph ta="center" o={0.8}>
                            {cats.error instanceof Error ? cats.error.message : 'Ukjent feil'}
                        </Paragraph>
                        <Button
                            onPress={async () => {
                                await queryClient.resetQueries({ queryKey: ['product-categories'] });
                                setCatsReady(false);
                                cats.refetch();
                            }}
                        >
                            Prøv igjen
                        </Button>
                    </>
                )}
            </YStack>
        </Theme>
    );
};
