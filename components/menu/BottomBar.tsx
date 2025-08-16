import { THEME_BOTTOM_BAR } from '@/config/app';
import { useCanonicalNav } from '@/hooks/useCanonicalNav';
import { Home, Search, ShoppingCart } from '@tamagui/lucide-icons';
import * as Haptics from 'expo-haptics';
import { usePathname } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
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

export const BottomBar = (props: StackProps) => {
    const { to } = useCanonicalNav();
    const pathname = usePathname();

    // derive current route segment ('', 'search', 'cart'...)
    const currentTab = useMemo(() => pathname.split('/')[1] || 'index', [pathname]);

    // optimistic tab value
    const [tab, setTab] = useState(currentTab);
    useEffect(() => {
        // when navigation completes, sync + stop pending UI
        setTab(currentTab);
    }, [currentTab]);

    const onChange = (next: string) => {
        if (next === tab) return;
        setTab(next);                      // instant visual switch
        Haptics.selectionAsync().catch(() => { });

        // canonical navigation policy (replace for top-level tabs)
        to(next as any);
    };

    return (
        <ThemedYStack box theme={THEME_BOTTOM_BAR} {...props} w="100%">
            <StyledTabs value={tab} onValueChange={onChange}>
                <StyledTabsList>
                    <ThemedLinearGradient />
                    <StyledTab value="index" disabled={tab === 'index' && tab !== currentTab}>
                        {tab === 'index' && tab !== currentTab ? <ThemedSpinner size="small" /> : <Home />}
                        <Text>Hjem</Text>
                    </StyledTab>

                    <StyledTab value="search" disabled={tab === 'search' && tab !== currentTab}>
                        {tab === 'search' && tab !== currentTab ? <ThemedSpinner size="small" /> : <Search />}
                        <Text>Søk</Text>
                    </StyledTab>

                    <StyledTab value="cart" disabled={tab === 'cart' && tab !== currentTab}>
                        {tab === 'cart' && tab !== currentTab ? <ThemedSpinner size="small" /> : <ShoppingCart />}
                        <Text>Handlekurv</Text>
                    </StyledTab>
                </StyledTabsList>
            </StyledTabs>
        </ThemedYStack>
    );
};
