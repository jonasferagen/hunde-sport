import { ThemedLinearGradient } from '@/components/ui/ThemedLinearGradient';
import { resolveTheme } from '@/config/routes';
import { Home, Search, ShoppingCart } from '@tamagui/lucide-icons';
import { Link } from 'expo-router';
import { styled, Tabs, Text, Theme, YStack, YStackProps } from 'tamagui';

const StyledTab = styled(Tabs.Tab, {
    name: 'StyledTab',
    padding: '$2',
    flex: 1,
    position: 'relative',
    bottom: 50,
    height: 90,
    left: 0,
    right: 0,
    borderColor: '$borderColorStrong',
    borderWidth: 1,
    backgroundColor: 'transparent',
});

const StyledTabs = styled(Tabs, {
    name: 'StyledTabs',
    height: 100,
    position: 'relative',
    bottom: -40,
    left: 0,
    right: 0,
});

const StyledTabsList = styled(Tabs.List, {
    name: 'StyledTabsList',
    width: '100%',
    position: 'absolute',
    bottom: 0,
});

export const BottomBar = (props: YStackProps) => {

    const theme = resolveTheme();

    return <Theme name={theme} >
        <YStack {...props}>
            <ThemedLinearGradient />

            <StyledTabs {...props}>
                <StyledTabsList>
                    <Link href="/" asChild>
                        <StyledTab value="home">
                            <YStack ai="center" >
                                <Home />
                                <Text>Hjem</Text>
                            </YStack>
                        </StyledTab>
                    </Link>
                    <Link href="/search" asChild>
                        <StyledTab value="search">
                            <YStack ai="center">
                                <Search />
                                <Text>Søk</Text>
                            </YStack>
                        </StyledTab>
                    </Link>
                    <Link href="/shopping-cart" asChild>
                        <StyledTab value="cart">
                            <YStack ai="center">
                                <ShoppingCart />
                                <Text>Handlekurv</Text>
                            </YStack>
                        </StyledTab>
                    </Link>
                </StyledTabsList>
            </StyledTabs>
        </YStack>
    </Theme>
};
