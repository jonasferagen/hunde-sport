import { ProductCategoryTree } from '@/components/menu/ProductCategoryTree';
import { THEME_DRAWER } from '@/config/app';
import { routes } from '@/config/routes';
import {
    DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { X } from '@tamagui/lucide-icons';
import React from 'react';
import { ScrollView, Theme, YStack } from 'tamagui';
import { ThemedXStack, ThemedYStack } from '../ui';
import { ThemedButton } from '../ui/themed-components/ThemedButton';
import { ThemedLinearGradient } from '../ui/themed-components/ThemedLinearGradient';
import { ThemedText } from '../ui/themed-components/ThemedText';

export const CustomDrawerContent = (props: DrawerContentComponentProps) => {
    const { state, navigation } = props;

    return (
        <Theme name={THEME_DRAWER}>
            <YStack>
                <ThemedLinearGradient />
                <ThemedXStack container split>
                    <ThemedText size="$6">hunde-sport.no</ThemedText>
                    <ThemedButton
                        theme="tint"
                        circular
                        onPress={() => navigation.closeDrawer()}
                    >
                        <X />
                    </ThemedButton>

                </ThemedXStack>
                <ScrollView >
                    <ThemedYStack container="$4">
                        {Object.values(routes)
                            .filter(route => route.showInDrawer)
                            .map((route) => {
                                const isActive = state.routes[state.index].name === route.name;
                                const onPress = () => navigation.navigate(route.name);
                                return (
                                    <ThemedButton key={route.name}
                                        onPress={onPress}
                                        theme={isActive ? "tint" : "shade"}
                                    >
                                        <ThemedText>{route.label}</ThemedText>
                                    </ThemedButton>
                                );
                            })}
                        <ThemedText size="$6">Kategorier</ThemedText>
                        <ProductCategoryTree />
                    </ThemedYStack>
                </ScrollView>
            </YStack>
        </Theme>
    );
}
