// CustomDrawerNew.tsx
import { THEME_DRAWER } from '@/config/app';
import { useDrawerSettled } from '@/hooks/useDrawerSettled';
import { LoadingScreen } from '@/screens/misc/LoadingScreen';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import { X } from '@tamagui/lucide-icons';
import React from 'react';
import { H3, Theme } from 'tamagui';
import { ThemedLinearGradient, ThemedXStack, ThemedYStack } from '../ui';
import { ThemedButton } from '../ui/themed-components/ThemedButton';
import { ProductCategoryTree } from './ProductCategoryTree';

export const CustomDrawer = React.memo(({ navigation }: {
    navigation: DrawerContentComponentProps['navigation']
}) => {

    const { openedOnce: showTree } = useDrawerSettled({ readyDelay: 'interactions' });
    const close = React.useCallback(() => {
        navigation.dispatch(DrawerActions.closeDrawer());
    }, [navigation]);

    return (
        <Theme name={THEME_DRAWER}>
            <ThemedYStack box f={1}>
                <ThemedXStack container split>
                    <H3>hunde-sport.no</H3>
                    <ThemedButton theme="tint" circular onPress={close}><X /></ThemedButton>
                </ThemedXStack>
                <ThemedYStack f={1} mih={0} theme="tertiary">
                    <ThemedLinearGradient />
                    {showTree ? <ProductCategoryTree /> : <LoadingScreen />}
                </ThemedYStack>
            </ThemedYStack>
        </Theme>
    );
});

