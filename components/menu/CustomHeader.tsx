import { THEME_HEADER } from '@/config/app';
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


/*
function deriveTitle(props: DrawerHeaderProps) {
    const { route, options } = props;
    const paramName = (route.params as any)?.name as string | undefined;
    const computed = getHeaderTitle(options, route.name);
    const t = paramName ?? computed;
    return route.name === 'index' || t === 'index' || t == null ? 'hunde-sport.no' : t;
}

function headerPropsEqual(prev: DrawerHeaderProps, next: DrawerHeaderProps) {
    return prev.route.key === next.route.key && deriveTitle(prev) === deriveTitle(next);
}*/

export const CustomHeader = React.memo(({
    navigation,
    route,
}: {
    navigation: DrawerHeaderProps['navigation'],
    route: DrawerHeaderProps['route'],
}) => {
    ;
    const open = React.useCallback(() => {
        navigation.openDrawer();
    }, [navigation]);

    const title = route.name;

    return (
        <HeaderChrome onOpen={open} title={title} />
    );
});

