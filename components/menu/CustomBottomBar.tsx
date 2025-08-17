import { THEME_BOTTOM_BAR } from '@/config/app';
import { useCanonicalNav } from '@/hooks/useCanonicalNav';
import { Home, Search, ShoppingCart } from '@tamagui/lucide-icons';
import { usePathname } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { styled, Tabs, Text } from 'tamagui';
import { ThemedLinearGradient, ThemedYStack } from '../ui';


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


import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = React.ComponentProps<typeof ThemedYStack> & {
    respectSafeArea?: boolean;
};

import { useNavProgress } from '@/stores/navProgressStore';
import { startTransition } from 'react';
export const CustomBottomBar = React.memo(({ respectSafeArea = true, ...rest }: Props) => {

    const insets = useSafeAreaInsets();
    const pb = respectSafeArea ? insets.bottom : 0;

    const { to } = useCanonicalNav();
    const pathname = usePathname();
    const currentTab = useMemo(
        () => pathname.split('/')[1] || 'index',
        [pathname]
    );

    const onChange = useCallback((next: string) => {
        if (next !== currentTab) {
            const { start } = useNavProgress.getState();
            start();
            startTransition(() => {
                to(next as any);
            });
        }
    }, [currentTab, to]);

    return (
        <ThemedYStack box theme={THEME_BOTTOM_BAR} {...rest} w="100%"  >
            <ThemedLinearGradient pointerEvents="none" />
            <StyledTabs
                key={currentTab}
                value={currentTab}           // <-- controlled
                onValueChange={onChange}
                activationMode="manual"      // avoid activating on focus moves
                pb={pb}
            >
                <StyledTabsList>
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
