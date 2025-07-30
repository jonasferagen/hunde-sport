import { ThemedSpinner } from '@/components/ui/ThemedSpinner';
import { useCategories } from '@/hooks/data/Category';
import { Category } from '@/models/Category';
import { usePathname } from 'expo-router';
import React, { JSX, useCallback, useState } from 'react';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { XStack, YStack } from 'tamagui';

export type RenderItemProps = {
    category: Category;
    level: number;
    isActive: boolean;
    isExpanded: boolean;
    hasChildren: boolean;
    onExpand: (id: number) => void;
};

export type CategoryTreeProps = {
    parentId?: number;
    renderItem: (props: RenderItemProps) => JSX.Element;
    iconOpen?: JSX.Element;
    iconClose?: JSX.Element;
    level?: number;
};

type CategoryTreeBranchProps = {
    category: Category;
    level: number;
    isExpanded: boolean;
    onExpand: (id: number) => void;

} & Omit<CategoryTreeProps, 'parentId'>;

const CategoryTreeBranch = ({ category, level, isExpanded, onExpand, renderItem }: CategoryTreeBranchProps) => {
    const pathname = usePathname();
    const isActive = pathname.includes(`/category/${category.id}`);
    const { items: subcategories } = useCategories(category.id, { autoload: true });
    const hasChildren = subcategories.length > 0;


    return (
        <Animated.View key={category.id} layout={LinearTransition}>
            <YStack>
                <XStack flex={1}>

                    {renderItem({
                        category,
                        level,
                        isActive,
                        isExpanded,
                        hasChildren,
                        onExpand,
                    })}

                </XStack >

                {isExpanded && (
                    <Animated.View entering={FadeIn} exiting={FadeOut}>
                        <CategoryTree
                            parentId={category.id}
                            renderItem={renderItem}
                            level={level + 1}
                        />
                    </Animated.View>
                )}

            </YStack>
        </Animated.View >
    );
};

export const CategoryTree = ({ parentId = 0, renderItem, level = 0 }: CategoryTreeProps): JSX.Element => {
    const { items: categories, isLoading } = useCategories(parentId, { autoload: true });
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const handleExpand = useCallback((id: number) => {
        setExpandedId(prev => (prev === id ? null : id));
    }, []);

    if (isLoading) {
        return (
            <ThemedSpinner />
        );
    }

    return (
        <YStack>
            {categories.map(category => (
                <CategoryTreeBranch
                    key={category.id}
                    category={category}
                    level={level}
                    isExpanded={expandedId === category.id}
                    onExpand={handleExpand}
                    renderItem={renderItem}
                />
            ))}
        </YStack>
    );
};
