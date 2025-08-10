import { ProductCategoryTree } from '@/components/menu/ProductCategoryTree';
import { resolveTheme, routes } from '@/config/routes';
import {
    DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { X } from '@tamagui/lucide-icons';
import React from 'react';
import { H4, ScrollView, XStack, YStack } from 'tamagui';
import { ThemedButton } from '../ui/themed-components/ThemedButton';
import { ThemedLinearGradient } from '../ui/themed-components/ThemedLinearGradient';
import { ThemedText } from '../ui/themed-components/ThemedText';

export const CustomDrawerContent = (props: DrawerContentComponentProps) => {
    const { state, navigation } = props;
    const activeRouteName = state.routes[state.index].name;
    const themeName = resolveTheme(activeRouteName);

    return (
        <YStack
            t={themeName}
            f={1}
        >
            <YStack f={1} bc="$background">
                <ThemedLinearGradient />
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
                        <ProductCategoryTree />
                    </YStack>
                </ScrollView>
            </YStack>
        </YStack>
    );
}
