// CustomDrawerNew.tsx
import { THEME_DRAWER } from '@/config/app';
import { routes } from '@/config/routes';
import { useDrawerSettled } from '@/hooks/useDrawerSettled';
import { LoadingScreen } from '@/screens/misc/LoadingScreen';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import { X } from '@tamagui/lucide-icons';
import React, { type ComponentRef } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import Animated, { useAnimatedRef } from 'react-native-reanimated';
import { Theme } from 'tamagui';
import { ThemedLinearGradient, ThemedXStack, ThemedYStack } from '../ui';
import { ThemedButton } from '../ui/themed-components/ThemedButton';
import { ThemedText } from '../ui/themed-components/ThemedText';

import type { AnimatedRef } from 'react-native-reanimated';

import { ProductCategoryTree } from './ProductCategoryTree';
type AnimatedScrollViewRef = ComponentRef<typeof Animated.ScrollView>;


export const CustomDrawerNew = React.memo(({ navigation }: {
    navigation: DrawerContentComponentProps['navigation']
}) => {
    const DRAWER_ITEMS = React.useMemo(
        () => Object.values(routes)
            .filter(r => r.showInDrawer)
            .map(r => ({ name: r.name as keyof typeof routes, label: r.label })),
        []
    );

    const { openedOnce: showTree } = useDrawerSettled({ readyDelay: 'interactions' });

    // Instance type for Animated.ScrollView


    // ✅ Instance type, not component type
    const scrollRef = useAnimatedRef<AnimatedScrollViewRef>();
    const lastYRef = React.useRef<number>(0);

    // Keep this on the JS thread; no need for a Reanimated handler here
    const onScroll = React.useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
        lastYRef.current = e.nativeEvent.contentOffset.y;
    }, []);

    const close = React.useCallback(() => {
        navigation.dispatch(DrawerActions.closeDrawer());
    }, [navigation]);

    return (
        <Theme name={THEME_DRAWER}>
            <ThemedYStack box f={1}>
                <ThemedXStack container split>
                    <ThemedText size="$6">hunde-sport.no</ThemedText>
                    <ThemedButton theme="tint" circular onPress={close}><X /></ThemedButton>
                </ThemedXStack>
                <ThemedYStack f={1} mih={0} theme="tertiary">
                    <ThemedLinearGradient />
                    {showTree ? <ProductCategoryTree /> : <LoadingScreen />}
                </ThemedYStack>
            </ThemedYStack>
        </Theme>
    );
});

const DrawerLink = React.memo(({ name, label }: {
    name: keyof typeof routes; label: string;
}) => (
    <ThemedButton theme="shade">
        <ThemedText>{label}</ThemedText>
    </ThemedButton>
));

export type DrawerScrollCtxValue = {
    scrollRef: AnimatedRef<AnimatedScrollViewRef>;
    lastYRef: { current: number };
};

export const DrawerScrollCtx = React.createContext<DrawerScrollCtxValue | null>(null);
