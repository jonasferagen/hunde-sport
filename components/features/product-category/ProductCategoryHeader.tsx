// ProductCategoryHeader.tsx (simplified)
import React, { useState, useCallback } from 'react';
import { FlatList } from 'react-native';
import { Link } from 'expo-router';
import { Chip } from '@/components/ui/chips/Chip';
import { ThemedStackProps, ThemedXStack, ThemedYStack } from '@/components/ui/themed-components';
import { useCanonicalNavigation } from '@/hooks/useCanonicalNavigation';
import { Button, Sheet, Text, Separator } from 'tamagui';
import type { ProductCategory } from '@/types';
import { openModal } from '@/stores/modalStore';
import { ProductCategoriesModal } from './ProductCategoriesModal';


export const ProductCategoryHeader: React.FC<{ productCategories: readonly ProductCategory[] }> = ({
    productCategories }) => {
    const { linkProps } = useCanonicalNavigation();

    const count = productCategories.length;


    const INLINE_LIMIT = 12;
    const INLINE_SHOW = 8;
    const many = count > INLINE_LIMIT;
    const inline = many ? productCategories.slice(0, INLINE_SHOW) : productCategories;

    const openAll = React.useCallback(() => {
        openModal(
            (payload, api) => (
                <ProductCategoriesModal
                    productCategories={payload as readonly ProductCategory[]}
                    close={() => api.close()}
                />
            ),
            productCategories
        );
    }, [productCategories]);

    const ChipLink = ({ c }: { c: ProductCategory }) => (
        <Link {...linkProps('product-category', c)} asChild>
            <Chip theme="dark_primary">{c.name}</Chip>
        </Link>
    );
    if (count === 0) return null;
    return (
        <ThemedYStack pb="$2">
            <ThemedXStack fw="wrap" gap="$2" theme="dark_primary_tint">
                {inline.map((c) => <ChipLink key={c.id} c={c} />)}
                {many && (
                    <Chip onPress={openAll}>
                        +{count - INLINE_SHOW} flere
                    </Chip>
                )}
            </ThemedXStack>
        </ThemedYStack>
    );
};