import { ProductCategoryTree, RenderItemProps } from '@/components/features/product-category/ProductCategoryTree';
import { resolveTheme, routes } from '@/config/routes';
import {
    DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { LinearGradient } from '@tamagui/linear-gradient';
import { ChevronRight, X, } from '@tamagui/lucide-icons';
import { Link } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getTokenValue, ScrollView, Theme, useTheme, View, XStack, YStack } from 'tamagui';
import { ThemedButton } from '../ui/ThemedButton';
import { ThemedText } from '../ui/ThemedText';
import { AnimatedListExpansionIcon } from './AnimatedListExpansionIcon';


const ProductCategoryTreeItem = ({
    productCategory,
    isActive,
    isExpanded,
    level,
    hasChildren,
    onExpand,
}: RenderItemProps) => {

    const spacing = getTokenValue('$4', 'space');
    const theme = useTheme();

    return (
        <XStack jc="center" ai="center" gap="$2" w="100%" >
            <View ml={level * spacing}>
                <ThemedButton
                    circular
                    onPress={hasChildren ? () => onExpand(productCategory.id) : undefined}
                    disabled={!hasChildren}
                    size="$6"
                >
                    {hasChildren ? <AnimatedListExpansionIcon expanded={isExpanded} size="$4" /> : <ChevronRight size="$4" />}
                </ThemedButton>
            </View>

            <XStack flex={1} >
                <Link href={routes['product-category'].path(productCategory)} asChild>
                    <XStack
                        f={1}
                        py="$2.5"
                        px="$3"
                        my="$1"
                        br="$4"
                        gap="$2"
                        ai="center"
                        bg={isActive ? theme.backgroundFocus.val : 'transparent'}
                        pressStyle={{ backgroundColor: theme.backgroundFocus.val, borderColor: theme.backgroundFocus.val }}
                    >
                        <ThemedText fos="$3" letterSpacing={0.5}>
                            {productCategory.name}
                        </ThemedText>
                    </XStack>
                </Link>
            </XStack>

        </XStack >
    );
};
export const CustomDrawerContent = (props: DrawerContentComponentProps) => {
    const { state, navigation } = props;
    const activeRouteName = state.routes[state.index].name;
    const themeName = resolveTheme(activeRouteName);
    const { top, bottom } = useSafeAreaInsets();

    return (
        <YStack
            theme={themeName}
            flex={1}
            brw={2}
            brc="$borderColor"
        >
            <Theme name="primary">

                <YStack f={1} bc="$background" mt={top} mb={bottom}>
                    <LinearGradient
                        colors={['$background', '$backgroundStrong']}
                        start={[0, 0]}
                        end={[1, 1]}
                        fullscreen
                    />
                    <XStack
                        ai="center"
                        jc="space-between"
                        p="$3"
                    >
                        <ThemedText fos="$4">hunde-sport.no</ThemedText>
                        <ThemedButton
                            circular
                            onPress={() => navigation.closeDrawer()}
                        >
                            <X />
                        </ThemedButton>
                    </XStack>

                    <ScrollView>
                        <YStack gap="$2" p="$4">
                            {Object.values(routes)
                                .filter(route => route.showInDrawer)
                                .map((route) => {
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
                                                py="$2"
                                                mx="$2"
                                                h="$6"
                                                f={1}
                                                bc="transparent"
                                                variant={isActive ? 'active' : undefined}
                                                boc="transparent"
                                                onPress={onPress}
                                                br="$6"
                                                jc="flex-start"
                                            >
                                                <ThemedText
                                                    variant={isActive ? 'focused' : 'default'}
                                                    fos="$3"
                                                    letterSpacing={0.5}>
                                                    {route.label}
                                                </ThemedText>
                                            </ThemedButton>
                                        </XStack>
                                    );
                                })}
                            <ThemedText my="$2" fos="$4">Kategorier</ThemedText>
                            <ProductCategoryTree renderItem={ProductCategoryTreeItem} />
                            <ProductCategoryTree renderItem={ProductCategoryTreeItem} />
                        </YStack>
                    </ScrollView>
                </YStack>
            </Theme>
        </YStack>
    );
}
