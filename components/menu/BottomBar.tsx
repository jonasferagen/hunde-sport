import { LinearGradient } from '@tamagui/linear-gradient';
import { Home, Search, ShoppingCart } from '@tamagui/lucide-icons';
import { Link } from 'expo-router';
import { DimensionValue } from 'react-native';
import { styled, Tabs, Text, Theme, YStack } from 'tamagui';

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

const StyledLinearGradient = styled(LinearGradient, {
    name: 'StyledLinearGradient',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

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

export const BottomBar = ({ children }: { children?: React.ReactNode }) => {
    return (
        <Theme name="secondary" >
            <StyledLinearGradient
                colors={['$backgroundStrong', '$backgroundPress']}
                start={(0 as DimensionValue, 0 as DimensionValue)}
                end={(0 as DimensionValue, 1 as DimensionValue)}
            />
            <StyledTabs >
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
        </Theme>

    );
};
