import { THEME_DRAWER } from '@/config/app';
import { routes } from '@/config/routes';
import { useActiveDrawerRouteWhenOpen } from '@/hooks/useActiveDrawerRouteWhenOpen';
import { useDrawerStatus, type DrawerContentComponentProps } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import { X } from '@tamagui/lucide-icons';
import React, { Suspense } from 'react';
import { InteractionManager } from 'react-native';
import { ScrollView, Theme } from 'tamagui';
import { ThemedXStack, ThemedYStack } from '../ui';
import { ThemedButton } from '../ui/themed-components/ThemedButton';
import { ThemedText } from '../ui/themed-components/ThemedText';

// CustomDrawer.tsx
const LazyCategoryTree = React.lazy(() =>
    import('@/components/menu/ProductCategoryTree').then((m) =>
        ({ default: m.ProductCategoryTree })) as Promise<{ default: any }>);


export const CustomDrawer = React.memo(({ navigation }
    : { navigation: DrawerContentComponentProps['navigation'] }) => {

    const DRAWER_ITEMS = Object.values(routes)
        .filter(r => r.showInDrawer)
        .map(r => ({ name: r.name as keyof typeof routes, label: r.label }));

    const drawerStatus = useDrawerStatus();
    const isOpen = drawerStatus === 'open';
    const activeRouteName = useActiveDrawerRouteWhenOpen();
    const [pending, setPending] = React.useState<keyof typeof routes | null>(null);

    const [showTree, setShowTree] = React.useState(false);
    React.useEffect(() => {
        if (isOpen && !showTree) {
            const t = InteractionManager.runAfterInteractions(() => setShowTree(true));
            return () => t.cancel();
        }
    }, [isOpen, showTree]);

    React.useEffect(() => {
        if (drawerStatus === 'closed' && pending) {
            navigation.dispatch(DrawerActions.jumpTo(pending as string));
            setPending(null);
        }
    }, [drawerStatus, pending, navigation]);

    const onNavigate = React.useCallback((name: keyof typeof routes) => {
        // start close IMMEDIATELY; defer the heavy mount
        setPending(name);
        navigation.dispatch(DrawerActions.closeDrawer());
    }, [navigation]);

    const close = () => { navigation.dispatch(DrawerActions.closeDrawer()); }


    return (
        <Theme name={THEME_DRAWER}>
            <ThemedYStack box f={1} >
                <ThemedXStack container split>
                    <ThemedText size="$6">hunde-sport.no</ThemedText>
                    <ThemedButton theme="tint" circular onPress={close}>
                        <X />
                    </ThemedButton>
                </ThemedXStack>
                <ScrollView>
                    <ThemedYStack container="$4">
                        {DRAWER_ITEMS.map(({ name, label }) => (
                            <DrawerLink
                                key={name}
                                name={name}
                                label={label}
                                active={activeRouteName === name}
                                onNavigate={onNavigate}
                            />
                        ))}
                        <ThemedText size="$6">Kategorier</ThemedText>
                    </ThemedYStack>
                    {/* heavy subtree */}
                    <Suspense fallback={null}>
                        {showTree && false ? (
                            <ThemedYStack display={isOpen ? 'flex' : 'none'}>
                                <LazyCategoryTree />
                            </ThemedYStack>
                        ) : null}
                    </Suspense>
                </ScrollView>
            </ThemedYStack>
        </Theme>
    );
});


// DrawerLink.tsx
const DrawerLink = React.memo(({ name, label, active, onNavigate }: {
    name: keyof typeof routes; label: string; active: boolean;
    onNavigate: (name: keyof typeof routes) => void;
}) => {
    return (
        <ThemedButton onPress={() => onNavigate(name)} theme={active ? 'tint' : 'shade'}>
            <ThemedText>{label}</ThemedText>
        </ThemedButton>
    );
});

