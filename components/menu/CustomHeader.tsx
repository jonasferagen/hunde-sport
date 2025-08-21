// CustomHeader.tsx
import { THEME_HEADER } from '@/config/app';
import { resolveTitle } from '@/config/routes';
import type { DrawerHeaderProps } from '@react-navigation/drawer';
import { Menu } from '@tamagui/lucide-icons';
import React from 'react';
import { H3, Theme } from 'tamagui';
import { ThemedButton, ThemedLinearGradient, ThemedXStack } from '../ui/themed-components';

const HeaderChrome = React.memo(function HeaderChrome({
    onOpen,
    title,
}: { onOpen: () => void; title: string }) {
    return (
        <Theme name={THEME_HEADER}>
            <ThemedXStack container split box>
                <ThemedLinearGradient />
                <H3>{title}</H3>
                <ThemedButton circular onPress={onOpen}>
                    <Menu />
                </ThemedButton>
            </ThemedXStack>
        </Theme>
    );
});

export const CustomHeader = React.memo(({ navigation, route, options }: DrawerHeaderProps) => {
    // Prefer an explicit title set by the screen; otherwise compute from route
    // Fix memo deps: re-run when route name or "name" param changes
    const paramName = (route as any).params?.name; // keep stable dep
    const computed = React.useMemo(() => resolveTitle(route), [route.name, paramName]);

    const title =
        typeof options?.title === 'string' && options.title.length
            ? (options.title as string)
            : computed;

    const open = React.useCallback(() => navigation.openDrawer(), [navigation]);
    return <HeaderChrome onOpen={open} title={title} />;
});
