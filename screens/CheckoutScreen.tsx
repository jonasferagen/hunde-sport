import { PageHeader, PageView } from '@/components/layout';
import { ThemedSpinner } from '@/components/ui/ThemedSpinner';
import { log } from '@/services/Logger';
import { useCartStore } from '@/stores/CartStore';
import CookieManager from '@react-native-cookies/cookies';
import { ChevronLeft } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { YStack } from 'tamagui';

const COOKIE_DOMAIN = "hunde-sport.no";
const COOKIE_NAME = "cart_token";
const BASE_URL = "https://hunde-sport.no";
const CHECKOUT_URL = `${BASE_URL}/kassen/`;

export const CheckoutScreen = () => {
    const router = useRouter();
    const { cartToken } = useCartStore();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const prepareCheckout = async () => {
            if (cartToken) {
                try {
                    log.info('CheckoutScreen: Setting cartToken cookie...');
                    await CookieManager.set(BASE_URL, {
                        name: COOKIE_NAME,
                        value: cartToken,
                        domain: COOKIE_DOMAIN,
                        path: '/',
                        version: '1',
                        secure: true,
                        httpOnly: false,
                    });

                    log.info('CheckoutScreen: Cookie set successfully.');

                    const cookies = await CookieManager.get(BASE_URL);
                    log.info('CheckoutScreen: Cookies:', cookies['cart_token']);


                } catch (error) {
                    log.error('CheckoutScreen: Failed to set cookie', error);
                } finally {
                    setIsReady(true);
                }
            } else {
                log.warn('CheckoutScreen: No cartToken found, redirecting back.');
                router.back();
            }
        };

        prepareCheckout();
    }, [cartToken, router]);

    if (!isReady) {
        return (
            <PageView>
                <PageHeader
                    title="Kasse"
                    leftAction={{ icon: ChevronLeft, onPress: () => router.back() }}
                />
                <YStack f={1} ai="center" jc="center">
                    <ActivityIndicator size="large" />
                </YStack>
            </PageView>
        );
    }

    log.info('CheckoutScreen: Ready to render WebView.');

    return (
        <PageView>
            <PageHeader
                title="Kasse"
                leftAction={{ icon: ChevronLeft, onPress: () => router.back() }}
            />
            <WebView
                source={{ uri: CHECKOUT_URL }}
                sharedCookiesEnabled
                startInLoadingState={true}
                onLoad={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    log.info('WebView onLoad:', nativeEvent);
                }}
                onError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    log.error('WebView onError:', nativeEvent);
                }}
                onHttpError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    log.error('WebView onHttpError:', nativeEvent);
                }}
                onNavigationStateChange={(navState: WebViewNavigation) => {
                    log.info('WebView onNavigationStateChange:', navState);
                }}
                renderLoading={() => (
                    <YStack f={1} ai="center" jc="center" pos="absolute" t={0} l={0} r={0} b={0}>
                        <ThemedSpinner />
                    </YStack>
                )}
            />
        </PageView>
    );
};
