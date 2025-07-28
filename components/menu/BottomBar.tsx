import { LinearGradient } from '@tamagui/linear-gradient';
import { Home, Search, ShoppingCart } from '@tamagui/lucide-icons';
import { Link } from 'expo-router';
import { Tabs, Text, Theme, YStack } from 'tamagui';

export const BottomBar = ({ children }: { children?: React.ReactNode }) => {


    const tabStyle = {
        padding: '$2',
        flex: 1,
        position: 'relative',
        bottom: 50,
        height: 100,
        left: 0,
        right: 0
    };

    return (
        <Theme name="secondary">
            <LinearGradient
                colors={['$background', '$backgroundPress']}
                start={[0, 0]}
                end={[1, 0]}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            />
            <Tabs

                height={110}
                backgroundColor="transparent"
                borderTopColor="$borderColor"
                borderTopWidth={1}
                position="relative"
                bottom={-40}
                left={0}
                right={0}
            >
                <Tabs.List width="100%" position="absolute" bottom={0}>
                    <Tabs.Tab style={tabStyle} value="home">
                        <Link href="/">
                            <YStack ai="center" >
                                <Home />
                                <Text>Hjem</Text>
                            </YStack>
                        </Link>
                    </Tabs.Tab>
                    <Tabs.Tab style={tabStyle} value="search">
                        <Link href="/search">
                            <YStack ai="center">
                                <Search />
                                <Text>Søk</Text>
                            </YStack>
                        </Link>
                    </Tabs.Tab>
                    <Tabs.Tab style={tabStyle} value="cart">
                        <Link href="/shopping-cart">
                            <YStack ai="center">
                                <ShoppingCart />
                                <Text>Handlekurv</Text>
                            </YStack>
                        </Link>
                    </Tabs.Tab>
                </Tabs.List>
            </Tabs>
        </Theme>

    );
};
