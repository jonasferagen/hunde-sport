import { Loader } from '@/components/ui';
import { useCategories } from '@/hooks/Category/Category';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CategoryTreeItem from './CategoryTreeItem';

type CategoryTreeProps = {
    categoryId: number;
    level?: number;
};

const CategoryTree = ({ categoryId, level = 0 }: CategoryTreeProps) => {
    const { data, isLoading, error } = useCategories(categoryId);

    const categories = data?.pages.flat() ?? [];

    if (isLoading && level === 0) {
        return <Loader size="small" />;
    }

    if (error) {
        return <Text>Error: {error.message}</Text>;
    }

    return (
        <View style={styles.container}>
            {categories.map((category) => (
                <CategoryTreeItem key={category.id} category={category} level={level} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 0,
    },
});

export default CategoryTree;
