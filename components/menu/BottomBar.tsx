import { ThemedLinearGradient } from '@/components/ui/ThemedLinearGradient';
import { routes } from '@/config/routes';
import { Home, Search, ShoppingCart } from '@tamagui/lucide-icons';
import { usePathname, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styled, Tabs, Text, YStack, YStackProps } from 'tamagui';

const StyledTab = styled(Tabs.Tab, {
    name: 'StyledTab',
    f: 1,
    p: '$5',
    fd: 'column',
    ai: 'center',
    gap: '$2',
    bg: 'transparent',
    boc: 'red',
    bw: 1,
    h: 100,
});

const StyledTabs = styled(Tabs, {
    name: 'StyledTabs',
});

const StyledTabsList = styled(Tabs.List, {
    name: 'StyledTabsList',
    f: 1
});

export const BottomBar = (props: YStackProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const currentTab = pathname.split('/')[1] || 'index';
    const handleTabChange = (value: string) => {
        router.push(routes[value].path());
    };
    const insets = useSafeAreaInsets();

    return (
        <YStack {...props} b={insets.bottom}>
            <ThemedLinearGradient />
            <StyledTabs {...props} value={currentTab} onValueChange={handleTabChange}>
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
        </YStack>
    );
};
