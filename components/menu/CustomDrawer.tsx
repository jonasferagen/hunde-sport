// CustomDrawerNew.tsx
import { Loader } from '@/components/ui/Loader';
import { THEME_SHEET, THEME_SHEET_BG1, THEME_SHEET_BG2 } from '@/config/app';
import { useDrawerSettled } from '@/hooks/useDrawerSettled';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import { X } from '@tamagui/lucide-icons';
import React from 'react';
import { H3, YStackProps } from 'tamagui';
import { ThemedLinearGradient, ThemedXStack, ThemedYStack } from '../ui';
import { ThemedButton } from '../ui/themed-components/ThemedButton';
import { AppVersion } from './AppVersion';
import { ProductCategoryTree } from './ProductCategoryTree';
import { useDrawerStore } from '@/stores/drawerStore';

interface Props extends YStackProps {
    navigation: DrawerContentComponentProps['navigation'],
}

export const CustomDrawer = React.memo(({ navigation, ...props }: Props) => {

    useDrawerSettled();
    const hasOpened = useDrawerStore((s) => s.hasOpened);
    const close = React.useCallback(() => {
        navigation.dispatch(DrawerActions.closeDrawer());
    }, [navigation]);

    return (
        <ThemedYStack f={1} theme={THEME_SHEET} {...props}>
            <ThemedLinearGradient fromTheme={{ theme: THEME_SHEET_BG1 }} toTheme={{ theme: THEME_SHEET_BG2 }} />
            <ThemedXStack container split>
                <H3>hunde-sport.no</H3>
                <ThemedButton circular onPress={close}><X /></ThemedButton>
            </ThemedXStack>
            <ThemedYStack f={1} mih={0}>
                {hasOpened ? <ProductCategoryTree /> : <Loader />}
            </ThemedYStack>
            <AppVersion />
        </ThemedYStack>
    );
});

