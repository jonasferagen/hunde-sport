import { THEME_HEADER } from '@/config/app';
import { resolveTitle } from '@/config/routes';
import { DrawerHeaderProps } from '@react-navigation/drawer';
import { Menu } from '@tamagui/lucide-icons';
import React from 'react';
import { H3, Theme } from 'tamagui';
import { ThemedButton, ThemedLinearGradient, ThemedXStack } from '../ui/themed-components';

const HeaderChrome = React.memo(function HeaderChrome({
    onOpen,
    title,
}: {
    onOpen: () => void;
    title: string;
}) {
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


export const CustomHeader = React.memo(({ navigation, route }: DrawerHeaderProps) => {
    const title = React.useMemo(() => resolveTitle(route), [route.key]);
    const open = React.useCallback(() => navigation.openDrawer(), [navigation]);
    return <HeaderChrome onOpen={open} title={title} />;
});

