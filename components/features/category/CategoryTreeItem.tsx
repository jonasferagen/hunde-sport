import { Category } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { SvgUri } from 'react-native-svg';
import CategoryTree from './CategoryTree';

import { Crumb, useBreadcrumbs } from '@/hooks/BreadCrumb/BreadcrumbProvider';
import useCategories from '@/hooks/Category/Category';
import { SPACING } from '@/styles/Dimensions';

type CategoryTreeItemProps = {
    category: Category;
    level: number;
    trail: Crumb[];
};

export const CategoryTreeItem = ({ category, level, trail }: CategoryTreeItemProps) => {
    const { data, isFetching } = useCategories(category.id);
    const subcategories = data?.pages.flat() ?? [];
    const hasChildren = subcategories.length > 0;

    const { breadcrumbs, setTrail } = useBreadcrumbs();
    const isActive = breadcrumbs.some(crumb => crumb.id === category.id);

    const [isExpanded, setIsExpanded] = useState(isActive);

    useEffect(() => {
        if (isActive) {
            setIsExpanded(true);
        }
    }, [isActive]);

    const newTrail = [...trail, { id: category.id, name: category.name, type: 'category' as const }];

    const handleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const handleNavigate = () => {
        setTrail(newTrail);
        router.push({
            pathname: '/category',
            params: {
                id: category.id.toString(),
                name: category.name,
            },
        });
    };

    const renderExpandIcon = () => {
        if (hasChildren) {
            return <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down-outline'} size={24} color="black" />;
        }
        return <View style={{ width: 24 }} />; // Placeholder for alignment
    };

    const renderCategoryIcon = () => {
        if (category.image?.src?.endsWith('.svg')) {
            return <SvgUri width={24} height={24} uri={category.image.src} style={styles.icon} />;
        }
        return <Ionicons name="pricetag-outline" size={24} color="black" style={styles.icon} />;
    };

    return (
        <Animated.View layout={LinearTransition} style={{ overflow: 'hidden' }}>
            <View style={[isActive ? styles.activeCategory : null, { paddingVertical: SPACING.xs, marginLeft: level * SPACING.md }]}>
                <View style={styles.itemContainer}>
                    <Pressable onPress={handleNavigate} style={styles.categoryInfo}>
                        {renderCategoryIcon()}
                        <Text style={isActive ? styles.activeText : null}>{category.name} ({category.count})</Text>
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
                            trail={newTrail}
                        />
                    </Animated.View>
                )}
            </View>
        </Animated.View >
    );
};

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
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 8,
    },
    activeText: {
        fontWeight: 'bold',
    },
});

export default CategoryTreeItem;
