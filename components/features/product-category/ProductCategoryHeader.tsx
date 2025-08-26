// ProductCategoryHeader.tsx
import React from 'react';

import { ThemedButton } from '@/components/ui/themed-components';
import type { ProductCategory } from '@/types';
import { openModal } from '@/stores/ui/modalStore';
import { ProductCategoriesModal } from './ProductCategoriesModal';
import { Ellipsis } from '@tamagui/lucide-icons';
import { Theme } from 'tamagui';

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
