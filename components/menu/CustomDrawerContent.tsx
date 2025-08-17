import { THEME_DRAWER } from '@/config/app';
import { routes } from '@/config/routes';
import { ProductCategoryProvider } from '@/contexts';
import { useCanonicalNav } from '@/hooks/useCanonicalNav';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { X } from '@tamagui/lucide-icons';
import React, { useCallback, useMemo } from 'react';
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

// memoize a single drawer link row
const DrawerLink = React.memo(({ name, label, active, to }: DrawerLinkProps) => {

    const onPress = useCallback(() => to(name), [to, name]);
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
    //  activeRouteName === r.name

    const items = useMemo(
        () =>
            Object.values(routes)
                .filter((r) => r.showInDrawer)
                .map((r) => (
                    <DrawerLink
                        key={r.name}
                        name={r.name as keyof typeof routes}
                        label={r.label}
                        active={false}
                        to={to}
                    />
                )),
        [activeRouteName, to]
    );

    return <>{items}</>;
});

export const CustomDrawerContent = React.memo((props: DrawerContentComponentProps) => {
    const { state, navigation } = props;
    const { to } = useCanonicalNav();

    const activeRouteName = state.routes[state.index]?.name ?? 'index';
    const close = useCallback(() => navigation.closeDrawer(), [navigation]);

    return (
        <Theme name={THEME_DRAWER} key={activeRouteName}>
            <ThemedYStack>
                <ThemedXStack container split>
                    <ThemedText size="$6">hunde-sport.no</ThemedText>
                    <ThemedButton theme="tint" circular onPress={close}>
                        <X />
                    </ThemedButton>
                </ThemedXStack>
                <ScrollView>
                    <ThemedYStack container="$4">
                        <DrawerLinks activeRouteName={activeRouteName} to={to as any} />
                        <ThemedText size="$6">Kategorier</ThemedText>
                    </ThemedYStack>
                </ScrollView>
                <ProductCategoryProvider productCategoryId={0}>
                    <ProductCategoryTree />
                </ProductCategoryProvider>
            </ThemedYStack>
        </Theme>
    );
});
