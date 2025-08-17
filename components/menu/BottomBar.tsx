import { THEME_BOTTOM_BAR } from '@/config/app';
import { useCanonicalNav } from '@/hooks/useCanonicalNav';
import { Home, Search, ShoppingCart } from '@tamagui/lucide-icons';
import * as Haptics from 'expo-haptics';
import { usePathname } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StackProps, styled, Tabs, Text } from 'tamagui';
import { ThemedLinearGradient, ThemedSpinner, ThemedYStack } from '../ui';

const StyledTab = styled(Tabs.Tab, {
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
export const BottomBar = React.memo((props: StackProps) => {
    const { to } = useCanonicalNav();
    const pathname = usePathname();
    const currentTab = useMemo(() => pathname.split('/')[1] || 'index', [pathname]);

    // purely for UI feedback, NOT the Tabs value
    const [pending, setPending] = useState<string | null>(null);

    // when navigation lands, clear pending
    useEffect(() => {
        if (pending && pending === currentTab) setPending(null);
    }, [currentTab, pending]);

    const onChange = useCallback((next: string) => {
        if (next === currentTab) return;        // already there
        setPending(next);                       // show spinner/disable
        Haptics.selectionAsync().catch(() => { });
        to(next as any);                        // replace for top-level, push for details (per your routes)
    }, [currentTab, to]);

    const isPending = (k: string) => pending === k && pending !== currentTab;

    return (
        <ThemedYStack box theme={THEME_BOTTOM_BAR} {...props} w="100%">
            <StyledTabs value={currentTab} onValueChange={onChange}>
                <StyledTabsList>
                    <ThemedLinearGradient />

                    <StyledTab value="index" disabled={isPending('index')}>
                        {isPending('index') ? <ThemedSpinner size="small" /> : <Home />}
                        <Text>Hjem</Text>
                    </StyledTab>

                    <StyledTab value="search" disabled={isPending('search')}>
                        {isPending('search') ? <ThemedSpinner size="small" /> : <Search />}
                        <Text>Søk</Text>
                    </StyledTab>

                    <StyledTab value="cart" disabled={isPending('cart')}>
                        {isPending('cart') ? <ThemedSpinner size="small" /> : <ShoppingCart />}
                        <Text>Handlekurv</Text>
                    </StyledTab>
                </StyledTabsList>
            </StyledTabs>
        </ThemedYStack>
    );
});