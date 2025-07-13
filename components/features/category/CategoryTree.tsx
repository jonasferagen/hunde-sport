import { Loader } from '@/components/ui';
import { useCategories } from '@/hooks/Category/Category';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CategoryTreeItem from './CategoryTreeItem';

interface CategoryTreeProps {
    categoryId: number;
    level: number;
};

export const CategoryTree = ({ categoryId, level }: CategoryTreeProps) => {
    const { data, isFetching, fetchNextPage, hasNextPage } = useCategories(categoryId);

    const categories = data?.pages.flat() ?? [];

    if (isFetching && level === 0) {
        return <Loader size="small" />;
    }

    if (!data) {
        return <Text>Error: Unable to fetch categories</Text>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.categoryList}>
                {categories.map((category) => (
                    <CategoryTreeItem
                        key={category.id}
                        category={category}
                        level={level}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 0,
    },
    categoryList: {
        // Add styles for categoryList if needed
    },
});
