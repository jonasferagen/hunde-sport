import { Loader } from '@/components/ui';
import { useBreadcrumbs } from '@/hooks/Breadcrumbs/BreadcrumbContext';
import { useCategories } from '@/hooks/Category';
import { FONT_SIZES } from '@/styles';
import { SPACING } from '@/styles/Dimensions';
import { Category } from '@/types';
import { rgba } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
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

    const hasChildren = categories.length > 0; // subcategories

    const handleNavigate = useCallback(() => {
        setCategories(ancestors);
    }, [setCategories, ancestors]);

    const handleExpand = useCallback(() => {
        onExpand(category.id);
    }, [onExpand, category.id]);

    const renderExpandIcon = () => {
        if (hasChildren) {
            return <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down-outline'} size={FONT_SIZES.xxl} color={itemStyles.categoryText.color} />;
        }
        return <View style={{ width: FONT_SIZES.xxl }} />; // Placeholder for alignment
    };

    return (
        <Animated.View layout={LinearTransition} style={{ overflow: 'hidden' }}>
            <View style={[isExpanded ? itemStyles.activeCategory : null, { paddingVertical: SPACING.xs, marginLeft: level * SPACING.md }]}>
                <View style={itemStyles.itemContainer}>
                    <Pressable onPress={handleNavigate} style={itemStyles.categoryInfo}>
                        <CategoryIcon image={category.image} size={FONT_SIZES.xxl} color={itemStyles.categoryText.color} />
                        <Text style={[itemStyles.categoryText, isExpanded ? itemStyles.activeText : null]}>{category.name} ({category.count})</Text>
                    </Pressable>
                    <Pressable onPress={handleExpand}>
                        {renderExpandIcon()}
                    </Pressable>
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


    const { categories, isFetching } = useCategories(categoryId);
    const { categories: breadcrumbs } = useBreadcrumbs();

    const activeChild = categories.find((c: Category) => breadcrumbs.some(b => b.id === c.id));
    const [expandedItemId, setExpandedItemId] = useState<number | null>(activeChild?.id ?? null);

    const handleToggleExpand = (itemId: number) => {
        setExpandedItemId(prevId => (prevId === itemId ? null : itemId));
    };

    if (isFetching && level === 0) {
        return <Loader size="small" />;
    }

    return (
        <View style={styles.container}>
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
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 0,
    },
});

const itemBackgroundColor = rgba('black', 0.2);

const itemStyles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: SPACING.sm,
    },
    categoryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        color: 'white',
    },
    categoryText: {
        color: '#333',
        marginLeft: SPACING.sm,
    },
    icon: {
        marginRight: SPACING.sm,
    },
    activeCategory: {
        backgroundColor: itemBackgroundColor,
        borderRadius: 8,
    },
    activeText: {
        fontWeight: 'bold',
    },
});
