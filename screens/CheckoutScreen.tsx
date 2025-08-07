import { PageHeader, PageView } from '@/components/layout';
import { log } from '@/services/Logger';
import { useCartStore } from '@/stores/CartStore';
import { ChevronLeft } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { LoadingScreen } from './misc/LoadingScreen';

const storeUrl = 'https://hunde-sport.no';

const createRestoreToken = async (jwtToken: string) => {
    try {
        const response = await fetch(`${storeUrl}/wp-json/custom/v1/cart-restore-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jwt_token: jwtToken,
            }),
        });

        const result = await response.json();

        if (result.success) {
            const checkoutUrl = `${storeUrl}/kassen?restore_token=${result.restore_token}`;
            return checkoutUrl;
        } else {
            throw new Error(result.message || 'Failed to create restore token');
        }
    } catch (error) {
        console.error('Error creating restore token:', error);
        throw error;
    }
};

export const CheckoutScreen = () => {
    const router = useRouter();
    const { cartToken } = useCartStore();
    const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!cartToken) {
            log.warn('CheckoutScreen: No cartToken found, redirecting back.');
            router.back();
            return;
        }

        const getCheckoutUrl = async () => {
            try {
                log.info('CheckoutScreen: Creating restore token...');
                const url = await createRestoreToken(cartToken);
                log.info('CheckoutScreen: Restore token created. Loading URL:', url);
                setCheckoutUrl(url);
            } catch (e: any) {
                log.error('CheckoutScreen: Failed to get checkout URL', e);
                setError(e.message || 'An unknown error occurred.');
            }
        };

        getCheckoutUrl();
    }, [cartToken, router]);

    if (error || !checkoutUrl) {
        return (
            <PageView>
                <PageHeader
                    title="Kasse"
                    leftAction={{ icon: ChevronLeft, onPress: () => router.back() }}
                />
                <LoadingScreen message={error ? `Error: ${error}` : 'Forbereder kassen...'} />
            </PageView>
        );
    }

    return (
        <PageView>
            <PageHeader title="Kasse" />
            <WebView
                source={{ uri: checkoutUrl }}
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
                renderLoading={() => <LoadingScreen />}
            />
        </PageView>
    );
};
