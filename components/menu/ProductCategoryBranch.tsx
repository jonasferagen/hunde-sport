import { ProductCategoryProvider, useProductCategoryContext } from '@/contexts';
import { ProductCategory } from '@/models/ProductCategory';
import React, { memo } from 'react';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { XStack, YStack } from 'tamagui';
import { ProductCategoryTreeProps } from './ProductCategoryTree';
import { ProductCategoryTreeItem } from './ProductCategoryTreeItem';

interface ProductCategoryBranchProps extends ProductCategoryTreeProps {
    productCategory: ProductCategory;
    expandedIds: Set<number>;
    onExpand: (id: number) => void;
}

export const ProductCategoryBranch = memo(({
    productCategory,
    level = 0,
    expandedIds,
    onExpand,
}: ProductCategoryBranchProps) => {

    const { productCategories: subproductCategories } = useProductCategoryContext();

    const hasChildren = subproductCategories.length > 0;
    const isExpanded = expandedIds.has(productCategory.id);


    return (
        <Animated.View key={productCategory.id} layout={LinearTransition}>
            <YStack>
                <XStack f={1}>
                    <ProductCategoryTreeItem
                        productCategory={productCategory}
                        level={level}
                        isExpanded={isExpanded}
                        hasChildren={hasChildren}
                        handleExpand={onExpand}
                    />
                </XStack>
                {isExpanded && hasChildren && (
                    <Animated.View entering={FadeIn} exiting={FadeOut}>
                        <YStack pl="$4">
                            {subproductCategories.map((subproductCategory) => (
                                <ProductCategoryProvider
                                    key={subproductCategory.id}
                                    productCategoryId={subproductCategory.id}>
                                    <ProductCategoryBranch
                                        productCategory={subproductCategory}
                                        level={level + 1}
                                        expandedIds={expandedIds}
                                        onExpand={onExpand}
                                    />
                                </ProductCategoryProvider>
                            ))}
                        </YStack>
                    </Animated.View>
                )}
            </YStack>
        </Animated.View>
    );
});