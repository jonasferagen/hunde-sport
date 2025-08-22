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


export const CustomDrawer = () => {
    useDrawerSettled();
    return <CustomDrawerContent />
};


const CustomDrawerContent = () => {

    const hasOpened = useDrawerStore((s) => s.hasOpened);
    const closeDrawer = useDrawerStore((s) => s.closeDrawer);

    return (
        <ThemedYStack f={1} theme={THEME_SHEET}>
            <ThemedLinearGradient fromTheme={{ theme: THEME_SHEET_BG1 }} toTheme={{ theme: THEME_SHEET_BG2 }} />
            <ThemedXStack container split>
                <H3>hunde-sport.no</H3>
                <ThemedButton circular onPress={closeDrawer}><X /></ThemedButton>
            </ThemedXStack>
            <ThemedYStack f={1} mih={0}>
                {hasOpened ? <ProductCategoryTree /> : <Loader />}
            </ThemedYStack>
            <AppVersion />
        </ThemedYStack>
    );
};
