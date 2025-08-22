// ProductCategoryHeader.tsx (simplified)
import React, { useState, useCallback } from 'react';
import { FlatList } from 'react-native';
import { Link } from 'expo-router';
import { Chip } from '@/components/ui/chips/Chip';
import { ThemedStackProps, ThemedXStack, ThemedYStack } from '@/components/ui/themed-components';
import { useCanonicalNavigation } from '@/hooks/useCanonicalNavigation';
import { Button, Sheet, Text, Separator } from 'tamagui';
import type { ProductCategory } from '@/types';

interface Props extends ThemedStackProps {
    productCategories: readonly ProductCategory[];
};

const INLINE_LIMIT = 12;
const INLINE_SHOW = 8; // when many, show this many + “+N flere”

export const ProductCategoryHeader: React.FC<Props> = ({ productCategories, ...props }) => {
    const [open, setOpen] = useState(false);
    const { linkProps } = useCanonicalNavigation();

    const count = productCategories.length;

    const openAll = useCallback(() => setOpen(true), []);
    const closeAll = useCallback(() => setOpen(false), []);

    const ChipLink = ({ c }: { c: ProductCategory }) => (
        <Link {...linkProps('product-category', c)} asChild>
            <Chip theme="tint">{c.name}</Chip>
        </Link>
    );
    if (count === 0) return null;
    const many = count > INLINE_LIMIT;
    const inline = many ? productCategories.slice(0, INLINE_SHOW) : productCategories;

    return (
        <ThemedYStack {...props}>
            <ThemedXStack fw="wrap" gap="$2">
                {inline.map((c) => <ChipLink key={c.id} c={c} />)}
                {many && (
                    <Chip theme="shade" onPress={openAll}>
                        +{count - INLINE_SHOW} flere
                    </Chip>
                )}
            </ThemedXStack>

            <Sheet
                modal
                native
                open={open}
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
                                <Chip theme="tint">{item.name}</Chip>
                            </Link>
                        )}
                    />
                    <Button mt="$2" onPress={closeAll}>
                        Lukk
                    </Button>
                </Sheet.Frame>
            </Sheet>
        </ThemedYStack>
    );
};
