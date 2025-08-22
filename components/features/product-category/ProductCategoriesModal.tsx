// ProductCategoriesModal.tsx
import React from 'react';
import { FlatList } from 'react-native';
import { Link } from 'expo-router';
import { Button, Separator, Text, YStack } from 'tamagui';
import { Chip } from '@/components/ui/chips/Chip';
import { useCanonicalNavigation } from '@/hooks/useCanonicalNavigation';
import type { ProductCategory } from '@/types';

export function ProductCategoriesModal({
    productCategories,
    close,
}: {
    productCategories: readonly ProductCategory[];
    close: () => void;
}) {
    const { linkProps } = useCanonicalNavigation();

    return (
        <YStack f={1} mih={0} p="$2" gap="$3">
            <Text fos="$7">Alle underkategorier</Text>
            <Separator />
            <FlatList
                data={productCategories as ProductCategory[]}
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
            <Button mt="$2" onPress={close}>Lukk</Button>
        </YStack>
    );
}
