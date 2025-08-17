import { THEME_HEADER } from '@/config/app';
import { Prof } from '@/lib/debug/prof';
import { DrawerHeaderProps } from '@react-navigation/drawer';
import { getHeaderTitle } from '@react-navigation/elements';
import { Menu } from '@tamagui/lucide-icons';
import React from 'react';
import { H4, Theme } from 'tamagui';
import { ThemedButton, ThemedLinearGradient, ThemedXStack } from '../ui/themed-components';

// useEvent: stable callback identity without re-creating deps
function useEvent<T extends (...a: any[]) => any>(fn: T): T {
    const ref = React.useRef(fn);
    ref.current = fn;
    // @ts-expect-error generic typing
    return React.useCallback((...args) => ref.current(...args), []);
}

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
    return <Prof id="HeaderTitle" disable>
        <H4 fs={1}>{title}</H4>
    </Prof>;
});

function deriveTitle(props: DrawerHeaderProps) {
    const { route, options } = props;
    const paramName = (route.params as any)?.name as string | undefined;
    const computed = getHeaderTitle(options, route.name);
    const t = paramName ?? computed;
    return route.name === 'index' || t === 'index' || t == null ? 'hunde-sport.no' : t;
}

function headerPropsEqual(prev: DrawerHeaderProps, next: DrawerHeaderProps) {
    return prev.route.key === next.route.key && deriveTitle(prev) === deriveTitle(next);
}

export const CustomHeader = React.memo((props: DrawerHeaderProps) => {
    const title = React.useMemo(() => deriveTitle(props), [props]);
    const onOpen = useEvent(() => props.navigation.openDrawer());

    return (
        <HeaderChrome onOpen={onOpen}>
            <HeaderTitle title={title} />
        </HeaderChrome>
    );
}, headerPropsEqual);

