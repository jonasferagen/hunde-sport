// CustomHeader.tsx
import { THEME_HEADER } from '@/config/app';
import { resolveTitle } from '@/config/routes';
import type { DrawerHeaderProps } from '@react-navigation/drawer';
import { Menu } from '@tamagui/lucide-icons';
import React from 'react';
import { H3, Theme } from 'tamagui';
import { ThemedButton, ThemedLinearGradient, ThemedXStack } from '../ui/themed-components';
import { useDrawerStore } from '@/stores/drawerStore';

export const CustomHeader = React.memo(({ route, options }: DrawerHeaderProps) => {
    const paramName = (route as any).params?.name; // keep stable dep
    const computed = React.useMemo(() => resolveTitle(route), [route.name, paramName]);

    const title =
        typeof options?.title === 'string' && options.title.length
            ? (options.title as string)
            : computed;

    const openDrawer = useDrawerStore((s) => s.openDrawer);

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
});
