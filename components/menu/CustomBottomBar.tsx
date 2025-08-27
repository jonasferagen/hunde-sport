import { Home, Search, ShoppingCart } from '@tamagui/lucide-icons';
import { usePathname } from 'expo-router';
import React, { useCallback, useEffect, useMemo } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styled, Tabs, Text } from 'tamagui';

import { BOTTOM_BAR_HEIGHT, THEME_BOTTOM_BAR } from '@/config/app';
import { useCanonicalNavigation } from '@/hooks/useCanonicalNavigation';
import { useDrawerStore } from '@/stores/ui/drawerStore';

import { ThemedLinearGradient, ThemedText, ThemedYStack } from '../ui';


const StyledTab = styled(Tabs.Tab, {

    pos: 'relative',
    zIndex: 1,
    name: 'StyledTab',
    f: 1,
    fd: 'column',
    ai: 'center',
    jc: 'center',
    py: '$3',
    gap: '$1',
    bg: '$background',
    h: BOTTOM_BAR_HEIGHT,
    bw: 1,
    boc: '$borderColor',
});

const StyledTabs = styled(Tabs, {
    name: 'StyledTabs',
    b: 0,
    w: '100%',

});

const StyledTabsList = styled(Tabs.List, {
    name: 'StyledTabsList',
    display: 'flex',
    w: '100%',
});



export function CustomBottomBar() {
    const drawerStatus = useDrawerStore(s => s.status); // 'opening' | 'open' | 'closing' | 'closed'
    const show = drawerStatus === 'closing' || drawerStatus === 'closed';

    const progress = useSharedValue(show ? 1 : 0); // 1 = visible, 0 = hidden

    React.useEffect(() => {
        progress.value = withTiming(show ? 1 : 0, { duration: 160 });
    }, [show, progress]);

    const style = useAnimatedStyle(() => ({
        transform: [{ translateY: (1 - progress.value) * Number(BOTTOM_BAR_HEIGHT) }],
        opacity: progress.value,
    }));
    return (
        <Animated.View
            collapsable={false}
            style={[{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 1 }, style]}
            pointerEvents={show ? 'auto' : 'none'}
            importantForAccessibility={show ? 'auto' : 'no-hide-descendants'}
        >
            <CustomBottomBarContents />
        </Animated.View>
    );
}

export const CustomBottomBarContents = () => {

    const insets = useSafeAreaInsets();

    const { to, } = useCanonicalNavigation();
    const pathname = usePathname();
    const currentTab = useMemo(
        () => pathname.split('/')[1] || 'index',
        [pathname]
    );

    const onChange = useCallback((next: string) => {
        if (next !== currentTab) {
            to(next as any);
        }
    }, [currentTab, to]);
    return (
        <ThemedYStack
            theme={THEME_BOTTOM_BAR}
            w="100%"
            pos="absolute"
            o={1}
            b={insets.bottom}
        >
            <StyledTabs
                key={currentTab}
                value={currentTab}           // <-- controlled
                onValueChange={onChange}
                activationMode="manual"      // avoid activating on focus moves
            >
                <StyledTabsList >
                    <ThemedLinearGradient />
                    <StyledTab value="index">
                        <Home />
                        <ThemedText>Hjem</ThemedText>
                    </StyledTab>
                    <StyledTab value="search">
                        <Search />
                        <ThemedText>Søk</ThemedText>
                    </StyledTab>
                    <StyledTab value="cart">
                        <ShoppingCart />
                        <ThemedText>Handlekurv</ThemedText>
                    </StyledTab>
                </StyledTabsList>
            </StyledTabs>
        </ThemedYStack>
    );
}

export const BottomInsetSpacer = () => {
    const visible = useDrawerStore(s => s.status === 'closed');
    const h = useSharedValue(visible ? BOTTOM_BAR_HEIGHT : 0);
    useEffect(() => { h.value = withTiming(visible ? Number(BOTTOM_BAR_HEIGHT) : 0, { duration: 160 }); }, [visible, h]);
    const style = useAnimatedStyle(() => ({ height: h.value }));
    return <Animated.View style={style} />;
};