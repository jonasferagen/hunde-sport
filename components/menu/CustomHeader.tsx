// CustomHeader.tsx
import { THEME_HEADER } from '@/config/app';
import { useHeaderTitle } from '@/config/routes';
import type { DrawerHeaderProps } from '@react-navigation/drawer';
import { Menu } from '@tamagui/lucide-icons';
import React from 'react';
import { H3, Theme } from 'tamagui';
import { ThemedButton, ThemedLinearGradient, ThemedXStack } from '../ui/themed-components';
import { useDrawerStore } from '@/stores/drawerStore';

export const CustomHeader = () => {

    const openDrawer = useDrawerStore((s) => s.openDrawer);
    const title = useHeaderTitle();

    return (
        <Theme name={THEME_HEADER}>
            <ThemedXStack container split box>
                <ThemedLinearGradient />
                <H3>{title}</H3>
                <ThemedButton circular disabled={!openDrawer} onPress={openDrawer}>
                    <Menu />
                </ThemedButton>
            </ThemedXStack>
        </Theme>
    );
};
