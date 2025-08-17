
import { THEME_HEADER } from '@/config/app';
import { routes } from '@/config/routes';
import { useCanonicalNav } from '@/hooks/useCanonicalNav';
import { useDrawerStatus, type DrawerContentComponentProps } from '@react-navigation/drawer';
import { useNavigationState } from '@react-navigation/native';
import { X } from '@tamagui/lucide-icons';
import React from 'react';
import { ScrollView, Theme } from 'tamagui';
import { ThemedXStack, ThemedYStack } from '../ui';
import { ThemedButton } from '../ui/themed-components/ThemedButton';
import { ThemedText } from '../ui/themed-components/ThemedText';
import { ProductCategoryTree } from './ProductCategoryTree';

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

const DrawerLinks = React.memo(function DrawerLinks({

    activeRouteName,
    to,
}: {

    activeRouteName: string;
    to: (name: keyof typeof routes) => void;
}) {
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
                    active={activeRouteName === name}
                    to={to}
                />
            ))}
        </>
    );
});



export const CustomDrawer = React.memo((
    {
        navigation
    }: {
        navigation: DrawerContentComponentProps['navigation']
    }) => {



    const isOpen = useDrawerStatus() === 'open';
    const activeRouteName = useNavigationState((s) =>
        isOpen ? s.routes[s.index]?.name ?? 'index' : 'index'
    );

    const { to } = useCanonicalNav();


    return (

        <Theme name={THEME_HEADER}>

            <ThemedYStack f={1}>
                <ThemedXStack container split>
                    <ThemedText size="$6">hunde-sport.no</ThemedText>
                    <ThemedButton theme="tint" circular onPress={() => { navigation.closeDrawer() }}>
                        <X />
                    </ThemedButton>
                </ThemedXStack>

                {/* Freeze entire heavy part when closed – no extra display/pointer flips */}

                <ScrollView>
                    <ThemedYStack container="$4">
                        {/* Only compute “active” while open (otherwise always false) */}
                        <DrawerLinks
                            activeRouteName={activeRouteName}
                            to={to as any}
                        />
                        <ThemedText size="$6">Kategorier</ThemedText>
                    </ThemedYStack>
                    <ProductCategoryTree />
                </ScrollView>
            </ThemedYStack>
        </Theme>

    );
});
