import { Breadcrumb, Category } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { CategoryIcon } from './CategoryIcon';
import { CategoryTree } from './CategoryTree';

import { useBreadcrumbs } from '@/hooks/Breadcrumb/BreadcrumbProvider';
import useCategories from '@/hooks/Category/Category';
import { COLORS } from '@/styles/Colors';
import { SPACING } from '@/styles/Dimensions';
import { rgba } from '@/utils/helpers';

interface CategoryTreeItemProps {
    category: Category;
    level: number;
    trail: Breadcrumb[];
    isExpanded: boolean;
    onExpand: (categoryId: number) => void;
};

export const CategoryTreeItem = ({ category, level, trail, isExpanded, onExpand }: CategoryTreeItemProps) => {
    const { data, isFetching } = useCategories(category.id);
    const { breadcrumbs, setTrail } = useBreadcrumbs();


    const subcategories = data?.pages.flat() ?? [];
    const hasChildren = subcategories.length > 0;
    const isActive = breadcrumbs.some(crumb => crumb.id === category.id);

    const handleNavigate = useCallback(() => {
        setTrail(trail, true);
    }, [setTrail, trail]);

    const handleExpand = useCallback(() => {
        onExpand(category.id);
    }, [onExpand, category.id]);

    const renderExpandIcon = () => {
        if (hasChildren) {
            return <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down-outline'} size={24} color="black" />;
        }
        return <View style={{ width: 24 }} />; // Placeholder for alignment
    };

    return (
        <Animated.View layout={LinearTransition} style={{ overflow: 'hidden' }}>
            <View style={[isExpanded ? styles.activeCategory : null, { paddingVertical: SPACING.xs, marginLeft: level * SPACING.md }]}>
                <View style={styles.itemContainer}>
                    <Pressable onPress={handleNavigate} style={styles.categoryInfo}>
                        <CategoryIcon image={category.image} size={24} style={styles.icon} />
                        <Text style={isExpanded ? styles.activeText : null}>{category.name} ({category.count})</Text>
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
                            trail={[...trail]}
                        />
                    </Animated.View>
                )}
            </View>
        </Animated.View >
    );
};

const highlightColor = rgba(COLORS.secondary, 0.3);

const styles = StyleSheet.create({

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
    },
    icon: {
        marginRight: SPACING.sm,
    },
    activeCategory: {
        backgroundColor: highlightColor,
        borderWidth: 1,
        borderColor: highlightColor,
        borderRadius: 8,
    },
    activeText: {
        fontWeight: 'bold',
    },
});

export default CategoryTreeItem;
