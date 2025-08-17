
import { THEME_DRAWER } from '@/config/app';
import { routes } from '@/config/routes';
import { useCanonicalNav } from '@/hooks/useCanonicalNav';
import { DrawerContentComponentProps, useDrawerStatus } from '@react-navigation/drawer';
import { X } from '@tamagui/lucide-icons';
import React from 'react';
import { Freeze } from 'react-freeze';
import { ScrollView, Theme } from 'tamagui';
import { ThemedXStack, ThemedYStack } from '../ui';
import { ThemedButton } from '../ui/themed-components/ThemedButton';
import { ThemedText } from '../ui/themed-components/ThemedText';
import { ProductCategoryTree } from './ProductCategoryTree';

type DrawerLinkProps = {
    name: keyof typeof routes;
    label: string;
    active: boolean;
    to: (name: keyof typeof routes) => void;
};

// DrawerLinks.tsx
const DrawerLink = React.memo(({ name, label, active, to }: {
    name: keyof typeof routes;
    label: string;
    active: boolean;
    to: (name: keyof typeof routes) => void;
}) => {
    const onPress = React.useCallback(() => to(name), [to, name]);
    return (
        <ThemedButton onPress={onPress} theme={active ? 'tint' : 'shade'}>
            <ThemedText>{label}</ThemedText>
        </ThemedButton>
    );
});

export const DrawerLinks = React.memo(function DrawerLinks({
    activeRouteName,   // string or null
    to,
}: {
    activeRouteName: string | null;
    to: (name: keyof typeof routes) => void;
}) {
    // Build the static list once
    const items = React.useMemo(
        () => Object.values(routes)
            .filter((r) => r.showInDrawer)
            .map((r) => ({ name: r.name as keyof typeof routes, label: r.label })),
        []
    );

    return (
        <>
            {items.map(({ name, label }) => (
                <DrawerLink
                    key={name}
                    name={name}
                    label={label}
                    active={!!activeRouteName && activeRouteName === name}
                    to={to}
                />
            ))}
        </>
    );
});


export const CustomDrawer = React.memo((props: DrawerContentComponentProps) => {
    const { state, navigation } = props;
    const { to } = useCanonicalNav();

    const isOpen = useDrawerStatus() === 'open';
    const close = React.useCallback(() => navigation.closeDrawer(), [navigation]);
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => { if (isOpen && !mounted) setMounted(true); }, [isOpen, mounted]);

    // Only derive active route when the drawer is OPEN
    const activeRouteName = React.useMemo(
        () => (isOpen ? state.routes[state.index]?.name ?? 'index' : null),
        [isOpen, state]
    );


    return (
        <Theme name={THEME_DRAWER} >
            <ThemedYStack>
                <ThemedXStack container split>
                    <ThemedText size="$6">hunde-sport.no</ThemedText>
                    <ThemedButton theme="tint" circular onPress={close}>
                        <X />
                    </ThemedButton>
                </ThemedXStack>
                {mounted ? (
                    <Freeze freeze={!isOpen}>
                        <ScrollView>
                            <ThemedYStack container="$4">
                                <DrawerLinks activeRouteName={activeRouteName} to={to as any} />
                                <ThemedText size="$6">Kategorier</ThemedText>
                            </ThemedYStack>

                            <ProductCategoryTree />
                        </ScrollView>
                    </Freeze>
                ) : null}
            </ThemedYStack>
        </Theme>
    );
});
