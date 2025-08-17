import { THEME_HEADER } from '@/config/app';
import { resolveTitle } from '@/config/routes';
import { DrawerHeaderProps } from '@react-navigation/drawer';
import { Menu } from '@tamagui/lucide-icons';
import React from 'react';
import { H4, Theme } from 'tamagui';
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
                <ThemedButton theme="tint" circular onPress={onOpen}>
                    <Menu />
                </ThemedButton>
                <H4 fs={1}>{title}</H4>
            </ThemedXStack>
        </Theme>

    );
});


export const CustomHeader = React.memo(({
    navigation,
}: {
    navigation: DrawerHeaderProps['navigation'],
}) => {

    const route = navigation.getState().routes[navigation.getState().index];
    const title = resolveTitle(route);

    const open = React.useCallback(() => {
        navigation.openDrawer();
    }, [navigation]);


    return (
        <HeaderChrome onOpen={open} title={title} />
    );
});

