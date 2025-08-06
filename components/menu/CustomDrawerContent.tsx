import { ProductCategoryTree } from '@/components/menu/ProductCategoryTree';
import { resolveTheme, routes } from '@/config/routes';
import {
    DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { LinearGradient } from '@tamagui/linear-gradient';
import { X } from '@tamagui/lucide-icons';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { H4, ScrollView, Theme, XStack, YStack } from 'tamagui';
import { ThemedButton } from '../ui/ThemedButton';
import { ThemedText } from '../ui/ThemedText';

export const CustomDrawerContent = (props: DrawerContentComponentProps) => {
    const { state, navigation } = props;
    const activeRouteName = state.routes[state.index].name;
    const themeName = resolveTheme(activeRouteName);
    const { top, bottom } = useSafeAreaInsets();

    return (
        <Theme name="primary">
            <YStack
                f={1}
            >
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
                            <ProductCategoryTree />

                        </YStack>
                    </ScrollView>
                </YStack>
            </YStack>
        </Theme>
    );
}
