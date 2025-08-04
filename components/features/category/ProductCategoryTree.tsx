import { ProductCategoryProvider, useProductCategoryContext } from '@/contexts';
import { ProductCategory } from '@/models/ProductCategory';
import { usePathname } from 'expo-router';
import React, { JSX, memo, useCallback, useState } from 'react';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { XStack, YStack } from 'tamagui';

export interface RenderItemProps {
    productCategory: ProductCategory;
    level: number;
    isActive: boolean;
    isExpanded: boolean;
    hasChildren: boolean;
    onExpand: (id: number) => void;
}

export interface ProductCategoryTreeProps {
    renderItem: (props: RenderItemProps) => JSX.Element;
    level?: number;
}

interface ProductCategoryBranchProps extends ProductCategoryTreeProps {
    productCategory: ProductCategory;
    expandedIds: Set<number>;
    onExpand: (id: number) => void;
}

const ProductCategoryBranch = memo(({
    productCategory,
    level = 0,
    expandedIds,
    onExpand,
    renderItem,
}: ProductCategoryBranchProps) => {
    const pathname = usePathname();
    const { productCategories: subproductCategories } = useProductCategoryContext();

    const hasChildren = subproductCategories.length > 0;
    const isExpanded = expandedIds.has(productCategory.id);


    return (
        <Animated.View key={productCategory.id} layout={LinearTransition}>
            <YStack>
                <XStack flex={1}>
                    {renderItem({
                        productCategory,
                        level,
                        isActive: pathname.includes(`/category/${productCategory.id}`),
                        isExpanded,
                        hasChildren,
                        onExpand,
                    })}
                </XStack>
                {isExpanded && hasChildren && (
                    <YStack pl="$4">
                        {subproductCategories.map((subproductCategory) => (
                            <ProductCategoryProvider key={subproductCategory.id} productCategoryId={subproductCategory.id}>
                                <ProductCategoryBranch
                                    productCategory={subproductCategory}
                                    level={level + 1}
                                    expandedIds={expandedIds}
                                    onExpand={onExpand}
                                    renderItem={renderItem}
                                />
                            </ProductCategoryProvider>
                        ))}
                    </YStack>
                )}
            </YStack>
        </Animated.View>
    );
});

export const ProductCategoryTree = ({ renderItem, level = 0 }: ProductCategoryTreeProps) => {
    const { productCategories: productCategories } = useProductCategoryContext();
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
                        renderItem={renderItem}
                    />
                </ProductCategoryProvider>
            ))}
        </YStack>
    );
};
