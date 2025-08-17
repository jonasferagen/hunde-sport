
import { THEME_DRAWER } from '@/config/app';
import { routes } from '@/config/routes';
import { useCanonicalNav } from '@/hooks/useCanonicalNav';
import { useDrawerStatus, type DrawerContentComponentProps } from '@react-navigation/drawer';
import { useNavigationState } from '@react-navigation/native';
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
    const { to } = useCanonicalNav();
    const isOpen = useDrawerStatus() === 'open';
    const activeRouteName = useNavigationState((s) =>
        isOpen ? s.routes[s.index]?.name ?? 'index' : 'index'
    );

    const [showTree, setShowTree] = React.useState(false);
    React.useEffect(() => {
        if (isOpen && !showTree) {
            const t = InteractionManager.runAfterInteractions(() => setShowTree(true));
            return () => t.cancel();
        }
    }, [isOpen, showTree]);



    return (
        <Theme name={THEME_DRAWER}>
            <ThemedYStack box f={1} >
                <ThemedXStack container split>
                    <ThemedText size="$6">hunde-sport.no</ThemedText>
                    <ThemedButton theme="tint" circular onPress={() => { navigation.closeDrawer() }}>
                        <X />
                    </ThemedButton>
                </ThemedXStack>
                <ScrollView>
                    <ThemedYStack container="$4">
                        {DRAWER_ITEMS.map(({ name, label }) => (
                            <DrawerLink key={name}
                                name={name}
                                label={label}
                                active={activeRouteName === name}
                                to={to}
                            />
                        ))}
                        <ThemedText size="$6">Kategorier</ThemedText>
                    </ThemedYStack>
                    {/* heavy subtree */}
                    <Suspense fallback={null}>
                        {showTree ? (
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
