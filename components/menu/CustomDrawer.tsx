// CustomDrawerNew.tsx
import { Loader } from '@/components/ui/Loader';
import { THEME_CTA_CHECKOUT, THEME_SHEET, THEME_SHEET_BG1, THEME_SHEET_BG2 } from '@/config/app';
import { useDrawerSettled } from '@/hooks/ui/useDrawerSettled';
import { X } from '@tamagui/lucide-icons';
import { getVariableValue, H3, Theme, useTheme } from 'tamagui';
import { ThemedLinearGradient, ThemedText, ThemedXStack, ThemedYStack } from '../ui';
import { ThemedButton } from '@/components/ui/themed-components/ThemedButton';

import { ProductCategoryTree } from './ProductCategoryTree';
import { useDrawerStore } from '@/stores/ui/drawerStore';
import * as Application from 'expo-application';
import React, { useMemo } from 'react';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { rgba } from 'polished';
import { resolveThemeToken } from '@/lib/helpers';

export const CustomDrawer = ({ navigation }: { navigation: DrawerContentComponentProps['navigation'] }) => {
    useDrawerSettled();

    const installControls = useDrawerStore((s) => s.installControls);
    const clearControls = useDrawerStore((s) => s.clearControls);

    React.useEffect(() => {
        installControls(navigation as any);
        return clearControls;
    }, [installControls, clearControls, navigation]);

    return <CustomDrawerContent />
};

const CustomDrawerContent = () => {

    const hasOpened = useDrawerStore((s) => s.hasOpened);
    const closeDrawer = useDrawerStore((s) => s.closeDrawer);
    const version = Application.nativeApplicationVersion ?? '?.?'; // versionName / CFBundleShortVersionString
    const build = Application.nativeBuildVersion ?? 'N/A';         // versionCode / CFBundleVersion
    const c1 = resolveThemeToken(THEME_SHEET_BG1, 'background');
    const c2 = resolveThemeToken(THEME_SHEET_BG2, 'background');

    return (
        <ThemedYStack f={1} gap="$0">
            <ThemedXStack box container split theme={THEME_SHEET_BG1}>
                <H3>hunde-sport.no</H3>
                <ThemedButton circular onPress={closeDrawer}><X /></ThemedButton>
            </ThemedXStack>
            <ThemedYStack f={1} mih={0}>
                <ThemedLinearGradient fromColor={c1} toColor={c2} alpha={1} />
                {hasOpened ? <ProductCategoryTree colors={[c1, c2]} /> : <Loader />}
            </ThemedYStack>
            <ThemedYStack box container jc="flex-end" theme={THEME_SHEET_BG2}>
                <ThemedText size="$1" ta="right" >
                    v{version} (build {build})
                </ThemedText>
            </ThemedYStack>
        </ThemedYStack>
    );
}
