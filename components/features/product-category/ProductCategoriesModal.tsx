// ProductCategoriesModal.tsx
import React from 'react';
import { FlatList } from 'react-native';
import { Link } from 'expo-router';
import { H4, Separator } from 'tamagui';
import { ThemedButton, ThemedXStack, ThemedYStack } from '@/components/ui';
import { useCanonicalNavigation } from '@/hooks/useCanonicalNavigation';
import type { ProductCategory } from '@/types';
import { X, ChevronRight } from '@tamagui/lucide-icons';

export function ProductCategoriesModal({
    productCategories,
    title,
    close,
}: {
    productCategories: readonly ProductCategory[];
    title: string;
    close: () => void;
}) {
    const { linkProps } = useCanonicalNavigation();

    return (
        <ThemedYStack f={1} mih={0} p="$2" gap="$3">
            {/* Header */}
            <ThemedXStack split>
                <H4>{title}</H4>
                <ThemedButton circular onPress={close}>
                    <X />
                </ThemedButton>
            </ThemedXStack>

            <FlatList
                data={productCategories}
                keyExtractor={(c) => String(c.id)}
                renderItem={({ item, index }) => (
                    <Link {...linkProps('product-category', item)} asChild>
                        <ThemedButton
                            w="100%"
                            justifyContent="space-between"
                            size="$5"
                            mt={index > 0 ? '$2' : undefined}
                            onPress={close}               // ← close the modal when selecting
                        >
                            <H4>{item.name}</H4>
                            <ChevronRight />
                        </ThemedButton>
                    </Link>
                )}
            />

        </ThemedYStack>
    );
}
