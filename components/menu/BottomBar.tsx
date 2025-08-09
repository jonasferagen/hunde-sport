import { ThemedLinearGradient } from '@/components/ui/ThemedLinearGradient';
import { routes } from '@/config/routes';
import { Home, Search, ShoppingCart } from '@tamagui/lucide-icons';
import { usePathname, useRouter } from 'expo-router';
import { styled, Tabs, Text, YStack, YStackProps } from 'tamagui';

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
    btw: 2,
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
    const router = useRouter();
    const pathname = usePathname();
    const currentTab = pathname.split('/')[1] || 'index';
    const handleTabChange = (value: string) => {
        router.push(routes[value].path());
    };

    return (
        <YStack {...props} w="100%">
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
        </YStack>
    );
};
