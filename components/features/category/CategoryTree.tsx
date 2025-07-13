import { useCategories } from '@/hooks/Category/Category';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import CategoryTreeItem from './CategoryTreeItem';

type CategoryTreeProps = {
    categoryId: number;
    level?: number;
    onLoad?: (hasChildren: boolean) => void;
};

const CategoryTree = ({ categoryId, level = 0, onLoad }: CategoryTreeProps) => {
    const { data, isLoading, error, isSuccess } = useCategories(categoryId);

    const categories = data?.pages.flat() ?? [];

    useEffect(() => {
        if (isSuccess && onLoad) {
            onLoad(categories.length > 0);
        }
    }, [isSuccess, onLoad, categories.length]);

    if (isLoading) {
        return <ActivityIndicator />;
    }

    if (error) {
        return <Text>Error loading categories</Text>;
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
