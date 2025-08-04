import { ProductCategoryProvider, useProductCategoryContext } from '@/contexts';
import { ProductCategory } from '@/models/Category';
import { usePathname } from 'expo-router';
import React, { JSX, memo, useCallback, useState } from 'react';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { XStack, YStack } from 'tamagui';

export interface RenderItemProps {
    category: ProductCategory;
    level: number;
    isActive: boolean;
    isExpanded: boolean;
    hasChildren: boolean;
    onExpand: (id: number) => void;
}

export interface CategoryTreeProps {
    renderItem: (props: RenderItemProps) => JSX.Element;
    level?: number;
}

interface CategoryBranchProps extends CategoryTreeProps {
    category: ProductCategory;
    expandedIds: Set<number>;
    onExpand: (id: number) => void;
}

const CategoryBranch = memo(({ category, level = 0, expandedIds, onExpand, renderItem }: CategoryBranchProps) => {
    const pathname = usePathname();
    const { productCategories: subproductCategories } = useProductCategoryContext();

    const hasChildren = subproductCategories.length > 0;
    const isExpanded = expandedIds.has(category.id);


    return (
        <Animated.View key={category.id} layout={LinearTransition}>
            <YStack>
                <XStack flex={1}>
                    {renderItem({
                        category,
                        level,
                        isActive: pathname.includes(`/category/${category.id}`),
                        isExpanded,
                        hasChildren,
                        onExpand,
                    })}
                </XStack>
                {isExpanded && hasChildren && (
                    <YStack pl="$4">
                        {subproductCategories.map((subcategory) => (
                            <ProductCategoryProvider key={subcategory.id} productCategoryId={subcategory.id}>
                                <CategoryBranch
                                    category={subcategory}
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

export const CategoryTree = ({ renderItem, level = 0 }: CategoryTreeProps) => {
    const { productCategories: categories } = useProductCategoryContext();
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
            {categories.map((category) => (
                <ProductCategoryProvider key={category.id} productCategoryId={category.id}>
                    <CategoryBranch
                        category={category}
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
