import { ProductCategoryTree, RenderItemProps } from '@/components/features/product-category/ProductCategoryTree';
import { resolveTheme, routes } from '@/config/routes';
import {
    DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { LinearGradient } from '@tamagui/linear-gradient';
import { X } from '@tamagui/lucide-icons';
import { Link } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getTokenValue, H4, ScrollView, Theme, XStack, YStack } from 'tamagui';
import { ThemedButton } from '../ui/ThemedButton';
import { ThemedText } from '../ui/ThemedText';
import { AnimatedListExpansionIcon } from './AnimatedListExpansionIcon';


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
                        <H4>hunde-sport.no</H4>
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
                                                f={1}
                                                onPress={onPress}
                                            >
                                                <ThemedText
                                                    f={1}
                                                    variant={isActive ? 'focused' : 'default'}
                                                    letterSpacing={0.5}
                                                    fos="$4">
                                                    {route.label}
                                                </ThemedText>
                                            </ThemedButton>
                                        </XStack>
                                    );
                                })}
                            <H4 my="$2">Kategorier</H4>
                            <ProductCategoryTree renderItem={ProductCategoryTreeItem} />

                        </YStack>
                    </ScrollView>
                </YStack>
            </Theme>
        </YStack>
    );
}

const ProductCategoryTreeItem = ({
    productCategory,
    isActive,
    isExpanded,
    level,
    hasChildren,
    handleExpand,
}: RenderItemProps) => {

    const spacing = getTokenValue('$2', 'space');

    return (
        <XStack ai="center" gap="$2" w="100%" >
            <XStack flex={1} ml={level * spacing}>
                <Link href={routes['product-category'].path(productCategory)} asChild>
                    <ThemedButton f={1}>
                        <ThemedText f={1} letterSpacing={0.5}>
                            {productCategory.name}
                        </ThemedText>
                    </ThemedButton>
                </Link>
            </XStack>

            <ThemedButton
                circular
                onPress={() => handleExpand(productCategory.id)}
                disabled={!hasChildren}
                size="$6"
                opacity={hasChildren ? 1 : 0}
                pointerEvents={hasChildren ? 'auto' : 'none'}
            >
                <AnimatedListExpansionIcon expanded={isExpanded} size="$4" />
            </ThemedButton>
        </XStack >
    );
};
