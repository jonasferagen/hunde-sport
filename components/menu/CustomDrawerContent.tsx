import { CategoryTree, RenderItemProps } from '@/components/features/category/CategoryTree';
import { routes } from '@/config/routes';
import {
    DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { LinearGradient } from '@tamagui/linear-gradient';
import { ChevronRight, X, } from '@tamagui/lucide-icons';
import { Link } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getTokenValue, ScrollView, Theme, useTheme, useThemeName, View, XStack, YStack } from 'tamagui';
import { ThemedButton } from '../ui/ThemedButton';
import { ThemedText } from '../ui/ThemedText';
import { AnimatedListExpansionIcon } from './AnimatedListExpansionIcon';


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
                    {hasChildren ? <AnimatedListExpansionIcon expanded={isExpanded} size="$4" /> : <ChevronRight size="$4" />}
                </ThemedButton>
            </View>

            <XStack flex={1} >
                <Link href={routes.category.path(category)} asChild>
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
    const { top } = useSafeAreaInsets();

    return (
        <YStack
            theme={themeName}
            flex={1}
            borderRightWidth={2}
            borderRightColor="$borderColor"
        >
            <Theme name="primary">

                <YStack flex={1} backgroundColor="$background">

                    <XStack
                        ai="center"
                        jc="space-between"
                        paddingTop={top + 30}
                        paddingHorizontal="$4"
                        paddingBottom="$3"


                    >
                        <ThemedText fontSize="$4">hunde-sport.no</ThemedText>
                        <ThemedButton
                            circular
                            onPress={() => navigation.closeDrawer()}
                        >
                            <X />
                        </ThemedButton>
                    </XStack>

                    <ScrollView>

                        <LinearGradient
                            colors={['$background', '$backgroundPress']}
                            start={[0, 0]}
                            end={[1, 1]}
                            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                        />
                        <YStack gap="$2" paddingVertical="$4" paddingHorizontal="$4">
                            {Object.values(routes)
                                .filter(route => route.showInDrawer)
                                .map((route, index) => {
                                    const isActive = state.routes[state.index].name === route.name;
                                    const onPress = () => navigation.navigate(route.name);

                                    return (
                                        <XStack key={route.name}>
                                            <ThemedButton
                                                icon={route.icon}
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
                                                    {route.label}
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
                    </ScrollView>
                </YStack>
            </Theme>
        </YStack>
    );
}
