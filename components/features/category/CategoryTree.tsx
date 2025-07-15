import { CustomText, Icon, Loader } from '@/components/ui';
import { useBreadcrumbs, useTheme } from '@/contexts';
import { useCategories } from '@/hooks/Category';
import { Theme } from '@/styles';
import { BORDER_RADIUS, SPACING } from '@/styles/Dimensions';
import { Category } from '@/types';
import { rgba } from '@/utils/helpers';
import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { CategoryIcon } from './CategoryIcon';

interface CategoryTreeProps {
    categoryId: number;
    level?: number;
    ancestors?: Category[];
};

interface CategoryTreeItemProps {
    category: Category;
    level: number;
    ancestors: Category[];
    isExpanded: boolean;
    onExpand: (categoryId: number) => void;
};

const CategoryTreeItem = ({ category, level, ancestors, isExpanded, onExpand }: CategoryTreeItemProps) => {
    const { categories } = useCategories(category.id);
    const { setCategories } = useBreadcrumbs();
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const hasChildren = categories.length > 0; // subcategories

    const handleNavigate = useCallback(() => {
        setCategories(ancestors);
    }, [setCategories, ancestors]);

    const handleExpand = useCallback(() => {
        onExpand(category.id);
    }, [onExpand, category.id]);


    const color = theme.textOnColor.primary;

    return (
        <Animated.View layout={LinearTransition} style={{ overflow: 'hidden' }}>
            <View style={[isExpanded ? styles.activeCategory : null, { paddingVertical: SPACING.xs, marginLeft: level * SPACING.md }]}>
                <View style={styles.itemContainer}>
                    <Pressable onPress={handleNavigate} style={styles.categoryInfo}>
                        <CategoryIcon image={category.image} size='xl' color={color} />
                        <CustomText style={[styles.categoryText, { color }]}>{category.name} ({category.count})</CustomText>
                    </Pressable>
                    {hasChildren && (
                        <Pressable onPress={handleExpand}>
                            <Icon name={isExpanded ? 'collapse' : 'expand'} size='md' color={color} />
                        </Pressable>
                    )}
                </View>
                {isExpanded && (
                    <Animated.View entering={FadeIn} exiting={FadeOut} style={{ overflow: 'hidden' }}>
                        <CategoryTree
                            categoryId={category.id}
                            level={level + 1}
                            ancestors={[...ancestors]}
                        />
                    </Animated.View>
                )}
            </View>
        </Animated.View >
    );
};

export const CategoryTree = ({ categoryId, level = 0, ancestors = [] }: CategoryTreeProps) => {
    const { categories, isFetchingNextPage } = useCategories(categoryId, { fetchAll: true });
    const { categories: breadcrumbs } = useBreadcrumbs();

    const activeChild = categories.find((c: Category) => breadcrumbs.some(b => b.id === c.id));
    const [expandedItemId, setExpandedItemId] = useState<number | null>(activeChild?.id ?? null);

    const handleToggleExpand = (itemId: number) => {
        setExpandedItemId(prevId => (prevId === itemId ? null : itemId));
    };

    return (
        <View style={{ marginHorizontal: 0 }}>
            <View>
                {categories.map((category: Category) => {
                    return (
                        <CategoryTreeItem
                            key={category.id}
                            category={category}
                            level={level}
                            ancestors={[...ancestors, category]}
                            isExpanded={expandedItemId === category.id}
                            onExpand={handleToggleExpand}
                        />
                    );
                })}
                {isFetchingNextPage && (
                    <Loader size="small" style={{ marginVertical: SPACING.sm }} />
                )}
            </View>
        </View>
    );
};


const createStyles = (theme: Theme) => StyleSheet.create({

    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.sm,
    },
    categoryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoryText: {
        marginLeft: SPACING.sm,
    },
    icon: {
        marginRight: SPACING.sm,
    },
    activeCategory: {
        backgroundColor: rgba('white', 0.3),
        borderRadius: BORDER_RADIUS.sm,
    },
});
