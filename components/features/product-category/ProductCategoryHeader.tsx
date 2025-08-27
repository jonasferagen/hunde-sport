// ProductCategoryHeader.tsx
import { Ellipsis } from '@tamagui/lucide-icons';
import React from 'react';
import { Theme } from 'tamagui';

import { ThemedButton } from '@/components/ui/themed-components';
import { openModal } from '@/stores/ui/modalStore';
import type { ProductCategory } from '@/types';

import { ProductCategoriesModal } from './ProductCategoriesModal';

export const ProductCategoryHeader: React.FC<{
    productCategory: ProductCategory;
    productCategories: readonly ProductCategory[];
}> = ({ productCategories, productCategory }) => {
    const count = productCategories.length;

    const label = `${count}`;

    const openAll = React.useCallback(() => {
        openModal(
            (payload, api) => (
                <ProductCategoriesModal
                    productCategories={(payload as any).productCategories}
                    title={(payload as any).title}
                    close={() => api.close()}
                />
            ),
            { productCategories, title: productCategory.name }
        );
    }, [productCategory, productCategories]);

    if (count === 0) return null;
    return (
        <Theme reset>
            <ThemedButton circular onPress={openAll} mx="$3">
                <Ellipsis />
            </ThemedButton>
        </Theme>
    );
};
