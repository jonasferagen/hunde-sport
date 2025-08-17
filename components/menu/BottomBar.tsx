import { THEME_BOTTOM_BAR } from '@/config/app';
import { useCanonicalNav } from '@/hooks/useCanonicalNav';
import { Home, Search, ShoppingCart } from '@tamagui/lucide-icons';
import * as Haptics from 'expo-haptics';
import { usePathname } from 'expo-router';
import React, { useCallback, useEffect, useMemo } from 'react';
import { styled, Tabs, Text } from 'tamagui';
import { ThemedLinearGradient, ThemedYStack } from '../ui';

import { useNavPending } from '@/stores/navPending';

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
    bg: 'transparent',
    h: 'auto',
    btw: 1,
    brw: 1,
    blw: 1,
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
export const BottomBar = React.memo((props) => {
    const { to } = useCanonicalNav();
    const pathname = usePathname();
    const currentTab = useMemo(() => pathname.split('/')[1] || 'index', [pathname]);
    const setPendingTo = useNavPending((s) => s.setPendingTo);

    const onChange = useCallback((next: string) => {
        if (next === currentTab) return;
        setPendingTo(next);                // announce target immediately
        Haptics.selectionAsync().catch(() => { console.log("aa") });
        to(next as any);
    }, [currentTab, setPendingTo, to]);

    useEffect(() => {                    // clear when nav lands
        setPendingTo(null);
    }, [currentTab, setPendingTo]);


    return (
        <ThemedYStack box theme={THEME_BOTTOM_BAR} {...props} w="100%" key={currentTab}>
            <StyledTabs onValueChange={onChange}>
                <StyledTabsList>
                    <ThemedLinearGradient />
                    <StyledTab value="index">
                        <Home />
                        <Text>Hjem</Text>
                    </StyledTab>
                    <StyledTab value="search">
                        <Search />
                        <Text>Søk</Text>
                    </StyledTab>
                    <StyledTab value="cart">
                        <ShoppingCart />
                        <Text>Handlekurv</Text>
                    </StyledTab>
                </StyledTabsList>
            </StyledTabs>
        </ThemedYStack>
    );
});