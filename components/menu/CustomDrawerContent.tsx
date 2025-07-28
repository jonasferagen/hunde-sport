import { CategoryTree, RenderItemProps } from '@/components/features/category/CategoryTree';
import { routes } from '@/config/routes';
import {
    DrawerContentComponentProps,
    DrawerContentScrollView
} from '@react-navigation/drawer';
import { LinearGradient } from '@tamagui/linear-gradient';
import { ChevronRight } from '@tamagui/lucide-icons';
import { Link } from 'expo-router';
import React, { useEffect } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Button, getTokenValue, SizableText, Theme, useTheme, View, XStack, YStack } from 'tamagui';


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
                <Button
                    theme="secondary"
                    circular
                    onPress={hasChildren ? () => onExpand(category.id) : undefined}
                    opacity={hasChildren ? 1 : .2}
                    disabled={!hasChildren}
                    borderColor="$borderColor"
                    pressStyle={{ backgroundColor: theme.backgroundFocus.val, borderColor: theme.borderColor.val }}
                    borderWidth={1}
                    size="$6"
                >
                    {hasChildren ? <AnimatedChevron expanded={isExpanded} size="$4" /> : <ChevronRight size="$4" />}
                </Button>
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
                    <YStack gap="$1" paddingVertical="$1">
                        {state.routes.map((route, index) => {
                            const isFocused = state.index === index;
                            const onPress = () => navigation.navigate(route.name);

                            return (
                                <Button
                                    paddingVertical="$2"
                                    marginHorizontal="$2"
                                    key={route.key}
                                    onPress={onPress}
                                    backgroundColor={isFocused ? 'white' : '$backgroundLight'}
                                    borderRadius="$4"
                                    borderColor="$borderColor"
                                    pressStyle={{ backgroundColor: '$backgroundFocus' }}
                                    borderWidth={1}
                                    jc="flex-start"
                                >
                                    <SizableText
                                        color={isFocused ? '$colorSubtle' : '$color'}
                                        fontWeight={isFocused ? 'bold' : 'normal'}
                                        fontSize="$6"
                                    >
                                        {route.name}
                                    </SizableText>
                                </Button>

                            );
                        })}

                        <CategoryTree
                            renderItem={(itemProps) => <CategoryTreeItem {...itemProps} />}
                        />
                    </YStack>
                </Theme>
            </DrawerContentScrollView>
        </YStack>
    );
}
