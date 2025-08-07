import { PageHeader, PageView } from '@/components/layout';
import { log } from '@/services/Logger';
import { useCartStore } from '@/stores/CartStore';
import { ChevronLeft } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { YStack } from 'tamagui';

const CHECKOUT_URL = 'https://hunde-sport.no/kassen/';

export const CheckoutScreen = () => {
    const router = useRouter();
    const { cartToken } = useCartStore();

    if (!cartToken) {
        log.warn('CheckoutScreen: No cartToken found, redirecting back.');
        router.back();
        return null;
    }

    const source = {
        uri: CHECKOUT_URL,
        headers: {
            'Cart-Token': cartToken,
        },
    };

    log.info('CheckoutScreen: Loading WebView with source:', source);

    return (
        <PageView>
            <PageHeader
                title="Kasse"
                leftAction={{ icon: ChevronLeft, onPress: () => router.back() }}
            />
            <WebView
                source={source}
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
                        <ActivityIndicator size="large" />
                    </YStack>
                )}
            />
        </PageView>
    );
};
