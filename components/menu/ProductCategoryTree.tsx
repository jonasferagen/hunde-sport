import { ProductCategoryProvider, useProductCategoryContext } from '@/contexts';
import React, { useCallback, useState } from 'react';
import { YStack } from 'tamagui';
import { ProductCategoryBranch } from './ProductCategoryBranch';

export interface ProductCategoryTreeProps {
    level?: number;
}

export const ProductCategoryTree = ({ level = 0 }: ProductCategoryTreeProps) => {
    const { productCategory, productCategories } = useProductCategoryContext();
    const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

    const handleExpand = useCallback((id: number) => {
        setExpandedIds((prev) => {
            const newIds = new Set(prev);
            if (newIds.has(id)) {
                newIds.delete(id);
            } else {
                newIds.add(id);
            }
            return newIds;
        });
    }, []);

    return (
        <YStack>
            {productCategories.map((productCategory) => (
                <ProductCategoryProvider key={productCategory.id} productCategoryId={productCategory.id}>
                    <ProductCategoryBranch
                        productCategory={productCategory}
                        level={level}
                        expandedIds={expandedIds}
                        onExpand={handleExpand}

                    />
                </ProductCategoryProvider>
            ))}
        </YStack>
    );
};
