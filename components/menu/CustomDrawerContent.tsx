import { CategoryTree, RenderItemProps } from '@/components/features/category/CategoryTree';
import { routes } from '@/config/routes';
import {
    DrawerContentComponentProps,
    DrawerContentScrollView
} from '@react-navigation/drawer';
import { LinearGradient } from '@tamagui/linear-gradient';
import { ChevronRight, Home, Search, ShoppingCart, X } from '@tamagui/lucide-icons';
import { Link } from 'expo-router';
import React, { useEffect } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { getTokenValue, SizableText, Theme, useTheme, View, XStack, YStack } from 'tamagui';
import { ThemedButton } from '../ui/ThemedButton';
import { ThemedText } from '../ui/ThemedText';


const AnimatedChevron = ({ expanded, size }: { expanded: boolean, size: string }) => {
    const rotation = useSharedValue(expanded ? 90 : 0);

    useEffect(() => {
        rotation.value = withTiming(expanded ? 90 : 0, { duration: 150 });
    }, [expanded]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotateZ: `${rotation.value}deg` }],
    }));

    return (
        <Animated.View style={animatedStyle}>
            <ChevronRight size={size} />
        </Animated.View>
    );
};

const CategoryTreeItem = ({
    category,
    isActive,
    isExpanded,
    level,
    hasChildren,
    onExpand,
}: RenderItemProps) => {

    const spacing = getTokenValue('$4', 'space');
    const theme = useTheme();
    return (
        <XStack jc="center" ai="center" gap="$2" width="100%" theme="secondary">
            <View ml={level * spacing}>
                <ThemedButton
                    theme="secondary"
                    circular
                    onPress={hasChildren ? () => onExpand(category.id) : undefined}
                    disabled={!hasChildren}
                    size="$6"
                >
                    {hasChildren ? <AnimatedChevron expanded={isExpanded} size="$4" /> : <ChevronRight size="$4" />}
                </ThemedButton>
            </View>

            <XStack flex={1} theme="light">
                <Link href={routes.category(category)} asChild>
                    <XStack
                        theme="secondary"
                        ai="center"
                        gap="$2"
                        paddingVertical="$2.5"
                        paddingHorizontal="$3"
                        marginVertical="$1"
                        borderRadius="$4"
                        backgroundColor={isActive ? theme.backgroundFocus.val : 'transparent'}
                        pressStyle={{ backgroundColor: theme.backgroundFocus.val, borderColor: theme.backgroundFocus.val }}
                        flex={1}
                    >

                        <SizableText fontSize="$5"
                        >
                            {category.name}
                        </SizableText>
                    </XStack>
                </Link>
            </XStack>

        </XStack >
    );
};
export function CustomDrawerContent(props: DrawerContentComponentProps) {
    const { state, navigation } = props;

    const allowedRoutes = {
        'index': {
            label: 'Hjem', icon: <Home />
        },
        'search': {
            label: 'Søk', icon: <Search />
        },
        'shopping-cart': {
            label: 'Handlekurv', icon: <ShoppingCart />
        }
    };

    return (
        <YStack

            flex={1}
            borderRightWidth={1}
            borderRightColor="$borderColor"
            shadowColor="$shadowColorFocus"
            shadowOffset={{ width: 2, height: 0 }}
            shadowOpacity={0.25}
            shadowRadius={8}
        >
            <LinearGradient
                colors={['$background', '$backgroundPress']}
                start={[0, 0]}
                end={[1, 1]}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            />

            <DrawerContentScrollView {...props}>
                <Theme name="secondary">
                    <XStack ai="center" paddingVertical="$3" jc="space-between" boc="$borderColor" bbw={1}>
                        <ThemedText fontSize="$4">hunde-sport.no</ThemedText>
                        <ThemedButton
                            paddingVertical="$2"
                            marginHorizontal="$2"
                            height="$6"
                            borderRadius="$4"
                            circular
                            onPress={() => navigation.closeDrawer()}
                            alignSelf="flex-end"
                        >
                            <X />
                        </ThemedButton>
                    </XStack>
                    <YStack gap="$2" paddingVertical="$2">
                        {state.routes.filter(route => Object.keys(allowedRoutes).includes(route.name))
                            .map((route, index) => {
                                const isFocused = state.index === index;
                                const onPress = () => navigation.navigate(route.name);
                                const routeLabel = allowedRoutes[route.name as keyof typeof allowedRoutes];

                                return (
                                    <XStack key={route.key}>
                                        <ThemedButton
                                            theme="secondary"
                                            circular
                                            size="$6"
                                            onPress={onPress}
                                        >
                                            {routeLabel.icon}
                                        </ThemedButton>
                                        <ThemedButton
                                            paddingVertical="$2"
                                            marginHorizontal="$2"
                                            height="$6"
                                            flex={1}
                                            bc="transparent"
                                            boc="transparent"
                                            onPress={onPress}
                                            borderRadius="$6"
                                            jc="flex-start"
                                        >
                                            <ThemedText variant={isFocused ? 'focused' : 'default'} fontSize="$3">
                                                {routeLabel.label}
                                            </ThemedText>
                                        </ThemedButton>
                                    </XStack>

                                );
                            })}
                        <XStack boc="$borderColor" bbw={1} paddingVertical="$2">
                            <ThemedText fontSize="$4" paddingVertical="$2">Kategorier</ThemedText>
                        </XStack>
                        <CategoryTree
                            renderItem={(itemProps) => <CategoryTreeItem {...itemProps} />}
                        />
                    </YStack>
                </Theme>
            </DrawerContentScrollView>

        </YStack>
    );
}
