import { Category } from '@/types';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { SvgUri } from 'react-native-svg';
import CategoryTree from './CategoryTree';

import { SPACING } from '@/styles/Dimensions';

type CategoryTreeItemProps = {
    category: Category;
    level: number;
};

const CategoryTreeItem = ({ category, level }: CategoryTreeItemProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [hasChildren, setHasChildren] = useState<boolean | undefined>(undefined);
    const [isFetching, setIsFetching] = useState(false);

    const handlePress = () => {
        if (hasChildren === undefined) {
            setIsFetching(true);
        }
        setIsExpanded(!isExpanded);
    };

    const handleLoad = (childrenExist: boolean) => {
        setHasChildren(childrenExist);
        setIsFetching(false);
        if (!childrenExist) {
            setIsExpanded(false); // Collapse if no children are found
        }
    };

    const renderExpandIcon = () => {
        if (isFetching) {
            return <ActivityIndicator size="small" />;
        }
        if (hasChildren) {
            return <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={20} color="black" />;
        }
        return <View style={{ width: 20 }} />; // Placeholder for alignment
    };

    const renderCategoryIcon = () => {
        if (category.image?.src?.endsWith('.svg')) {
            return <SvgUri width={24} height={24} uri={category.image.src} style={styles.icon} />;
        }
        return <MaterialCommunityIcons name="tag-outline" size={24} color="black" style={styles.icon} />;
    };

    return (
        <Animated.View layout={LinearTransition} style={{ overflow: 'hidden' }}>
            <View style={[level === 0 ? styles.mainCategory : styles.subCategory]}>
                <Pressable onPress={handlePress} style={styles.itemContainer}>
                    <View style={styles.categoryInfo}>
                        {renderCategoryIcon()}
                        <Text>{category.name} ({category.count})</Text>
                    </View>
                    {renderExpandIcon()}
                </Pressable>
                {isExpanded && (
                    <CategoryTree
                        categoryId={category.id}
                        level={level + 1}
                        onLoad={handleLoad}
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
        padding: SPACING.sm,
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
