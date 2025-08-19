import { THEME_DRAWER } from '@/config/app';
import { routes } from '@/config/routes';
import { useDrawerSettled } from '@/hooks/usePanelSettled';
import { useDrawerProgress, type DrawerContentComponentProps } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import { X } from '@tamagui/lucide-icons';
import React from 'react';
import { InteractionManager } from 'react-native';
import { SharedValue } from 'react-native-reanimated';
import { ScrollView, Theme } from 'tamagui';
import { ThemedSpinner, ThemedXStack, ThemedYStack } from '../ui';
import { ThemedButton } from '../ui/themed-components/ThemedButton';
import { ThemedText } from '../ui/themed-components/ThemedText';
import { ProductCategoryTree } from './ProductCategoryTree';


export const CustomDrawerNew = React.memo(({ navigation }
    : { navigation: DrawerContentComponentProps['navigation'] }) => {

    const DRAWER_ITEMS = Object.values(routes)
        .filter(r => r.showInDrawer)
        .map(r => ({ name: r.name as keyof typeof routes, label: r.label, }));

    const progress = useDrawerProgress() as SharedValue<number>; // 0..1
    const { isFullyOpen, isFullyClosed } = useDrawerSettled(progress);

    const [showTree, setShowTree] = React.useState(false);
    React.useEffect(() => {
        if (isFullyOpen) {
            const t = InteractionManager.runAfterInteractions(() => setShowTree(true));
            return () => t.cancel();
        }
    }, [isFullyOpen]);
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
                <ScrollView f={1} mih={0}>
                    <ThemedYStack container="$4">
                        {DRAWER_ITEMS.map(({ name, label }) => (
                            <DrawerLink
                                key={name}
                                name={name}
                                label={label}
                            />
                        ))}
                        <ThemedText size="$6">Kategorier</ThemedText>
                    </ThemedYStack>
                    <ThemedYStack f={1} h="100%" boc="black" bw={3} ai="center" jc="center">
                        {showTree && false ? <ProductCategoryTree /> : <ThemedSpinner />}
                    </ThemedYStack>
                </ScrollView>
            </ThemedYStack>
        </Theme>
    );
});


// DrawerLink.tsx
const DrawerLink = React.memo(({ name, label }: {
    name: keyof typeof routes; label: string;
}) => {
    return (
        <ThemedButton theme={'shade'}>
            <ThemedText>{label}</ThemedText>
        </ThemedButton>
    );
});

