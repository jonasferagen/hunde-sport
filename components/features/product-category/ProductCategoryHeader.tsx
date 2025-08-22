// ProductCategoryHeader.tsx
import React, { useMemo, useState, useCallback } from 'react';
import { FlatList } from 'react-native';
import { Link } from 'expo-router';
import { Chip } from '@/components/ui/chips/Chip';
import { ThemedXStack, ThemedYStack, ThemedLinearGradient } from '@/components/ui/themed-components';
import { EdgeFadesOverlay } from '@/components/ui/list/EdgeFadesOverlay';
import { useCanonicalNavigation } from '@/hooks/useCanonicalNavigation';
import { Button, ScrollView, Sheet, Text, Separator, XStack, YStack } from 'tamagui';
import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons';
import type { ProductCategory } from '@/types';

type Props = {
    title: string;
    productCategories: readonly ProductCategory[];
};

const INLINE_MAX = 8;   // <=8 chips inline
const HSCROLL_MAX = 16; // <=16 chips in one horizontal row

export const ProductCategoryHeader: React.FC<Props> = ({ title, productCategories }) => {
    const [openSheet, setOpenSheet] = useState(false);
    const { linkProps } = useCanonicalNavigation();

    const count = productCategories.length;

    const mode: 'inline' | 'hscroll' | 'popular+more' =
        count <= INLINE_MAX ? 'inline' :
            count <= HSCROLL_MAX ? 'hscroll' : 'popular+more';

    const openAll = useCallback(() => setOpenSheet(true), []);
    const closeAll = useCallback(() => setOpenSheet(false), []);

    const ChipLink = ({ c }: { c: ProductCategory }) => (
        <Link {...linkProps('product-category', c)} asChild>
            <Chip theme="shade">{c.name}</Chip>
        </Link>
    );
    if (count === 0) return null;
    return (
        <ThemedYStack bg="$background" pb="$2">
            <ThemedLinearGradient />
            <XStack ai="center" jc="space-between" mb="$2">
                {mode !== 'inline' && (
                    <Button size="$2" chromeless iconAfter={ChevronDown} onPress={openAll}>
                        Vis alle
                    </Button>
                )}
            </XStack>

            {mode === 'inline' && (
                <ThemedXStack fw="wrap" gap="$2">
                    {productCategories.map(c => <ChipLink key={c.id} c={c} />)}
                </ThemedXStack>
            )}

            {mode === 'hscroll' && (
                <YStack>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <ThemedXStack ai="center" gap="$2" px="$1">
                            {productCategories.map(c => <ChipLink key={c.id} c={c} />)}
                            <Button size="$2" chromeless iconAfter={ChevronDown} onPress={openAll}>
                                Vis alle
                            </Button>
                        </ThemedXStack>
                    </ScrollView>
                </YStack>
            )}


            {/* Bottom sheet grid */}
            <Sheet
                modal
                native
                open={openSheet}
                onOpenChange={(o: boolean) => !o && closeAll()}
                snapPointsMode="percent"
                snapPoints={[80]}
                position={0}
                dismissOnSnapToBottom
                animation="fast"
            >
                <Sheet.Overlay />
                <Sheet.Frame p="$4" gap="$3" mih={0}>
                    <Text fos="$7">Alle underkategorier</Text>
                    <Separator />
                    <FlatList
                        data={productCategories}
                        keyExtractor={(c) => String(c.id)}
                        numColumns={3}
                        columnWrapperStyle={{ gap: 8 }}
                        contentContainerStyle={{ gap: 8, paddingBottom: 8 }}
                        renderItem={({ item }) => (
                            <Link {...linkProps('product-category', item)} asChild>
                                <Chip theme="shade">{item.name}</Chip>
                            </Link>
                        )}
                    />
                    <Button mt="$2" chromeless icon={ChevronUp} onPress={closeAll}>
                        Lukk
                    </Button>
                </Sheet.Frame>
            </Sheet>
        </ThemedYStack>
    );
};
