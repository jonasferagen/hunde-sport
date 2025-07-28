import { CategoryTree, RenderItemProps } from '@/components/features/category/CategoryTree';
import { routes } from '@/config/routes';
import { routeConfig } from "@/lib/routeConfig";
import {
    DrawerContentComponentProps,
    DrawerContentScrollView
} from '@react-navigation/drawer';
import { LinearGradient } from '@tamagui/linear-gradient';
import { ChevronRight, X } from '@tamagui/lucide-icons';
import { Link } from 'expo-router';
import React, { useEffect } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { getTokenValue, Theme, useTheme, useThemeName, View, XStack, YStack } from 'tamagui';
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
        <XStack jc="center" ai="center" gap="$2" width="100%" >
            <View ml={level * spacing}>
                <ThemedButton

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
                        <ThemedText fontSize="$3" letterSpacing={0.5}
                        >
                            {category.name}
                        </ThemedText>
                    </XStack>
                </Link>
            </XStack>

        </XStack >
    );
};
export const CustomDrawerContent = (props: DrawerContentComponentProps) => {
    const { state, navigation } = props;
    const themeName = useThemeName();

    return (
        <YStack
            theme={themeName}
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
                <Theme>
                    <XStack ai="center" marginVertical="$3" jc="space-between">
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
                        {state.routes.filter(route => route.name in routeConfig)
                            .map((route, index) => {

                                const isActive = state.index === index;
                                const onPress = () => navigation.navigate(route.name);
                                const { label, icon } = routeConfig[route.name as keyof typeof routeConfig];


                                return (
                                    <XStack key={route.key}>
                                        <ThemedButton
                                            icon={icon}
                                            circular
                                            size="$6"
                                            variant={isActive ? 'active' : undefined}
                                            onPress={onPress}
                                        />
                                        <ThemedButton
                                            paddingVertical="$2"
                                            marginHorizontal="$2"
                                            height="$6"
                                            flex={1}
                                            bc="transparent"
                                            variant={isActive ? 'active' : undefined}
                                            borderColor="transparent"
                                            onPress={onPress}
                                            borderRadius="$6"
                                            jc="flex-start"
                                        >
                                            <ThemedText variant={isActive ? 'focused' : 'default'} fontSize="$3" letterSpacing={0.5}>
                                                {label}
                                            </ThemedText>
                                        </ThemedButton>
                                    </XStack>

                                );
                            })}



                        <ThemedText marginVertical="$2" fontSize="$4">Kategorier</ThemedText>


                        <CategoryTree
                            renderItem={(itemProps) => <CategoryTreeItem {...itemProps} />}
                        />
                    </YStack>
                </Theme>
            </DrawerContentScrollView>

        </YStack>
    );
}
