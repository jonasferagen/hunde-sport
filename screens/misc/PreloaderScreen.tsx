// app/(preloader)/PreloaderScreen.tsx
import React from 'react';
import { Redirect } from 'expo-router';
import { Theme, YStack, Paragraph, Button, Image, XStack } from 'tamagui';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

import { queryClient } from '@/lib/queryClient';
import { useProductCategories } from '@/hooks/data/ProductCategory';
import { useProductCategoryStore } from '@/stores/productCategoryStore';
import { useCartStore } from '@/stores/cartStore';
import { useCart } from '@/hooks/data/Cart';
import { ThemedButton, ThemedYStack } from '@/components/ui';
import { RefreshCw } from '@tamagui/lucide-icons';
import { CallToActionButton } from '@/components/ui/CallToActionButton';
SplashScreen.preventAutoHideAsync().catch(() => { });

type LoaderState = {
    key: 'fonts' | 'cart' | 'categories';
    ready: boolean;
    error: Error | null;
    progress?: string;          // optional granular progress
    label: string | null;              // human-facing summary reflecting state/error/progress
    retry?: () => void;
};

/** -------------------- Screen -------------------- **/
export const PreloaderScreen = () => {
    const fonts = useFontsLoader();
    const cart = useCartLoader({ enabled: fonts.ready });
    const categories = useProductCategoriesLoader({ enabled: cart.ready });

    const loaders: LoaderState[] = [fonts, cart, categories];
    const allReady = loaders.every(l => l.ready);
    if (allReady) return <Redirect href="/(app)" />;

    const splashImage = require('@/assets/images/splash-icon.png');

    // derive the *only* active step:
    const active =
        !fonts.ready || fonts.error ? fonts :
            !cart.ready || cart.error ? cart :
                !categories.ready || categories.error ? categories :
                    null;


    const label = active ? active.label : null;
    const error = active?.error;
    const retry = active?.retry;


    const LOGO_DIM = 200;

    return (

        <ThemedYStack f={1} box p="$4">
            {/* Top half: logo sits at bottom */}
            <ThemedYStack f={1} jc="flex-end" ai="center" mt={Math.round(LOGO_DIM / 2)}>
                <Image source={splashImage} style={{ width: LOGO_DIM, height: LOGO_DIM }} />
            </ThemedYStack>

            {/* Bottom half: status panel + extra text, aligned to top */}
            <ThemedYStack f={1} jc="flex-start" ai="center" >
                {/* Status panel */}
                <ThemedYStack
                    w="100%"
                    maw={420}
                    p="$2"
                    br="$2"
                    bg="$backgroundHover"
                    minHeight={120}
                    ai="center"
                    opacity={label || error ? 1 : 0}
                >
                    {!!label && (
                        <Paragraph ta="center" o={error ? 1 : 0.9}>
                            {label}
                        </Paragraph>
                    )}

                    {error && (
                        <>
                            <Paragraph ta="center" o={0.8}>{error.message}</Paragraph>
                            {!!retry && (
                                <CallToActionButton
                                    w="60%"
                                    label="Prøv igjen"
                                    after={<RefreshCw />}
                                    onPress={retry}
                                />
                            )}
                        </>
                    )}
                </ThemedYStack>
            </ThemedYStack>
        </ThemedYStack>

    );
}

/** -------------------- Loaders -------------------- **/
type Opts = { enabled: boolean };

/* Fonts */
export function useFontsLoader(): LoaderState {
    const [ready] = useFonts({
        Inter: require('@/assets/fonts/Inter/Inter-Regular.ttf'),
        'Inter-Bold': require('@/assets/fonts/Inter/Inter-Bold.ttf'),
        Montserrat: require('@/assets/fonts/Montserrat/Montserrat-Regular.ttf'),
        'Montserrat-Bold': require('@/assets/fonts/Montserrat/Montserrat-Bold.ttf'),
    });

    // hide native splash when fonts are ready so our UI renders correctly
    const hidden = React.useRef(false);
    React.useEffect(() => {
        if (ready && !hidden.current) {
            hidden.current = true;
            SplashScreen.hideAsync().catch(() => { });
        }
    }, [ready]);

    const progress = ready ? undefined : 'Laster skrifttyper…';

    return {
        key: 'fonts',
        ready,
        error: null,
        progress,
        label: ready ? null : (progress ?? 'Laster skrifttyper…'),
    };
}

/* Cart */
export function useCartLoader({ enabled }: Opts): LoaderState {
    const { data, error, isSuccess, isError, refetch } = useCart({ enabled });
    const setCart = useCartStore(s => s.setCart);


    React.useEffect(() => {
        if (isSuccess) {
            setCart(data ?? null);
        }
    }, [isSuccess, data, setCart]);

    const ready = !!data && isSuccess;
    const progress = enabled && !isSuccess && !isError ? 'Henter handlekurv…' : undefined;

    return {
        key: 'cart',
        ready,
        error: isError ? (error as Error) : null,
        progress,
        label:
            isError
                ? 'Handlekurv: kunne ikke hentes'
                : ready
                    ? null
                    : (progress ?? 'Initialiserer handlekurv…'),
        retry: () => refetch(),
    };
}

/* Product Categories */
export function useProductCategoriesLoader({ enabled }: Opts): LoaderState & {
    count: number; total?: number;
} {
    const setProductCategories = useProductCategoryStore(s => s.setProductCategories);

    const {
        error,
        items,
        isLoading,
        refetch,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
        isFetching,
        total,
    } = useProductCategories();

    // drain pages while enabled
    React.useEffect(() => {
        if (!enabled) return;
        if (error || isLoading) return;
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [enabled, error, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage]);

    // push to store
    React.useEffect(() => {
        setProductCategories(items);
    }, [items, setProductCategories]);

    const draining = isLoading || isFetching || isFetchingNextPage || hasNextPage;
    const count = items.length;

    const progress =
        enabled && !error && draining
            ? `Henter kategorier…${total > 0 ? ` (${Math.min(count, total)}/${total})`
                : count ? ` (${count}…)` : ''
            }`
            : undefined;

    const ready = enabled && !draining && !error;

    return {
        key: 'categories',
        ready,
        error: error ?? null,
        progress,
        label:
            error
                ? 'Kategorier: kunne ikke hentes'
                : ready
                    ? null
                    : (progress ?? 'Henter kategorier…'),
        retry: async () => {
            await queryClient.resetQueries({ queryKey: ['product-categories'] });
            refetch();
        },
        count,
        total,
    };
}
