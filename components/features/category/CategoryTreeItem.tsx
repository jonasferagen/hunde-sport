import { Category } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { SvgUri } from 'react-native-svg';
import CategoryTree from './CategoryTree';

import { Loader } from '@/components/ui';
import useCategories from '@/hooks/Category/Category';
import { SPACING } from '@/styles/Dimensions';
import { useRouter } from 'expo-router';

type CategoryTreeItemProps = {
    category: Category;
    level: number;
};

const CategoryTreeItem = ({ category, level }: CategoryTreeItemProps) => {
    const { data, isFetching } = useCategories(category.id);
    const subcategories = data?.pages.flat() ?? [];
    const hasChildren = subcategories.length > 0;

    const [isExpanded, setIsExpanded] = useState(false);
    const router = useRouter();

    const handleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const handleNavigate = () => {
        router.push({
            pathname: '/category',
            params: {
                id: category.id.toString(),
                name: category.name,
            },
        });
    };

    const renderExpandIcon = () => {
        if (isFetching && !isExpanded) {
            return <Loader size="small" />;
        }
        if (hasChildren) {
            return <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={24} color="black" />;
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
            <View style={[level === 0 ? styles.mainCategory : styles.subCategory]}>
                <View style={styles.itemContainer}>
                    <Pressable onPress={handleNavigate} style={styles.categoryInfo}>
                        {renderCategoryIcon()}
                        <Text>{category.name} ({category.count})</Text>
                    </Pressable>
                    <Pressable onPress={handleExpand}>
                        {renderExpandIcon()}
                    </Pressable>
                </View>
                {isExpanded && (
                    <CategoryTree
                        categoryId={category.id}
                        level={level + 1}
                    />
                )}
            </View>
        </Animated.View >
    );
};

const styles = StyleSheet.create({
    mainCategory: {
        padding: SPACING.sm,
    },
    subCategory: {

        paddingVertical: SPACING.md,
        marginLeft: SPACING.md,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    categoryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: SPACING.sm,
    },
});

export default CategoryTreeItem;
