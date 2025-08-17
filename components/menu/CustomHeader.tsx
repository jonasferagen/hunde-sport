import { THEME_HEADER } from '@/config/app';
import { Prof } from '@/lib/debug/prof';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Menu } from '@tamagui/lucide-icons';
import React from 'react';
import { H4, Theme } from 'tamagui';
import { ThemedButton, ThemedLinearGradient, ThemedXStack } from '../ui/themed-components';


const HeaderChrome = React.memo(function HeaderChrome({
    onOpen,
    children,
}: { onOpen: () => void; children: React.ReactNode }) {
    return (
        <Prof id="HeaderChrome" disable>
            <Theme name={THEME_HEADER}>
                <ThemedXStack container split box>
                    <ThemedLinearGradient />
                    <ThemedButton theme="tint" circular onPress={onOpen}>
                        <Menu />
                    </ThemedButton>
                    {children}
                </ThemedXStack>
            </Theme>
        </Prof>
    );
});

const HeaderTitle = React.memo(function HeaderTitle({ title }: { title: string }) {
    return <H4 fs={1}>{title}</H4>
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

export const CustomHeader = React.memo(() => {
    const title = "static";
    const nav = useNavigation();
    const open = React.useCallback(() => {
        nav.dispatch(DrawerActions.openDrawer());
    }, [nav]);

    return (
        <HeaderChrome onOpen={open}>
            <HeaderTitle title={title} />
        </HeaderChrome>
    );
});

