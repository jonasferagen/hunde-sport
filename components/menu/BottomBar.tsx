import { ThemedLinearGradient } from '@/components/ui/themed-components/ThemedLinearGradient';
import { THEME_BOTTOM_BAR } from '@/config/app';
import { RouteKey } from '@/config/routes';
import { useCanonicalNav } from '@/hooks/useCanonicalNav';
import { Home, Search, ShoppingCart } from '@tamagui/lucide-icons';
import { usePathname } from 'expo-router';
import { styled, Tabs, Text, YStackProps } from 'tamagui';
import { ThemedYStack } from '../ui';




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

export const BottomBar = (props: YStackProps) => {

    const { to, linkProps } = useCanonicalNav();

    const pathname = usePathname();
    const currentTab = pathname.split('/')[1] || 'index';
    const handleTabChange = (value: string) => {
        to(value as RouteKey);
    };

    return (
        <ThemedYStack box theme={THEME_BOTTOM_BAR} {...props} w="100%" >
            <StyledTabs {...props} value={currentTab} onValueChange={handleTabChange}>
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
};
