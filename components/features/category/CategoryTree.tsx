import { CustomText, Icon, Loader } from '@/components/ui';
import { _routes } from '@/config/routes';
import { useBreadcrumbs, useTheme } from '@/contexts';
import { useCategories } from '@/hooks/Category';
import { BORDER_RADIUS, SPACING } from '@/styles/Dimensions';
import { Category, Theme } from '@/types';
import { rgba } from '@/utils/helpers';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useState, useTransition } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { CategoryIcon } from './CategoryIcon';

interface CategoryTreeItemProps {
    category: Category;
    level: number;
    ancestors: Category[];
    isExpanded: boolean;
    onExpand: (categoryId: number) => void;
    isActive: boolean;
    onSelect?: (category: Category) => void;
};

const CategoryTreeItem = ({ category, level, ancestors, isExpanded, onExpand, isActive, onSelect }: CategoryTreeItemProps) => {
    const { categories } = useCategories(category.id);
    const { theme } = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const hasChildren = categories.length > 0; // subcategories
    const [isPending, startTransition] = useTransition();

    const handleExpand = useCallback(() => {
        onExpand(category.id);
    }, [onExpand, category.id]);

    const handleSelect = useCallback(() => {
        // This is an urgent update

        if (onSelect) {
            onSelect(category);
        }
        // This is a non-urgent update
        startTransition(() => {
            router.push(_routes.category(category));
        });
    }, [onSelect, category]);


    const color = theme.textOnColor.primary;


    return (
        <Animated.View layout={LinearTransition} style={{ overflow: 'hidden' }}>
            <View style={[isExpanded ? styles.activeCategory : null, { paddingVertical: SPACING.xs, marginLeft: level * SPACING.md }]}>
                <View style={styles.itemContainer}>
                    <Pressable style={styles.categoryInfo} onPress={handleSelect}>
                        <CategoryIcon image={category.image} size='xl' color={color} />
                        <CustomText style={[styles.categoryText, { color }, isActive && styles.activeCategoryText]}>{category.name} ({category.count})</CustomText>
                    </Pressable>
                    {hasChildren && (
                        <Pressable onPress={handleExpand}>
                            <Icon name={isExpanded ? 'collapse' : 'expand'} size='md' color={color} />
                        </Pressable>
                    )}
                </View>
                {isExpanded && (
                    <Animated.View entering={FadeIn} exiting={FadeOut} style={{ overflow: 'hidden' }}>
                        <CategorySubTree
                            categoryId={category.id}
                            level={level + 1}
                            ancestors={ancestors}
                            onSelect={onSelect}
                        />
                    </Animated.View>
                )}
            </View>
        </Animated.View >
    );
};

interface CategorySubTreeProps {
    categoryId: number;
    level?: number;
    ancestors?: Category[];
    onSelect?: (category: Category) => void;
};

const CategorySubTree = ({ categoryId, level = 0, ancestors = [], onSelect }: CategorySubTreeProps) => {
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
                            ancestors={ancestors.concat(category)}
                            isExpanded={expandedItemId === category.id}
                            onExpand={handleToggleExpand}
                            isActive={breadcrumbs.some(b => b.id === category.id)}
                            onSelect={onSelect}
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

export const CategoryTree = React.memo(({ onSelect }: { onSelect?: (category: Category) => void }) => {
    return <CategorySubTree categoryId={0} onSelect={onSelect} />;
});

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
    activeCategoryText: {
        fontWeight: 'bold',
    },
    icon: {
        marginRight: SPACING.sm,
    },
    activeCategory: {
        backgroundColor: rgba('white', 0.3),
        borderRadius: BORDER_RADIUS.sm,
    },
});
