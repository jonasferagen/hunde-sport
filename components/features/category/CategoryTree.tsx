import { Loader } from '@/components/ui';
import { useBreadcrumbs } from '@/hooks/Breadcrumb/BreadcrumbProvider';
import { useCategories } from '@/hooks/Category/Category';
import { Breadcrumb } from '@/types';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CategoryTreeItem from './CategoryTreeItem';

interface CategoryTreeProps {
    categoryId: number;
    level?: number;
    trail?: Breadcrumb[];
};

export const CategoryTree = ({ categoryId, level = 0, trail = [] }: CategoryTreeProps) => {

    const { data, isFetching, fetchNextPage, hasNextPage } = useCategories(categoryId);
    const { init } = useBreadcrumbs();

    if (!trail.length) {
        trail = init();
    }

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
                {categories.map((category) => {

                    const newTrail = [...trail];
                    newTrail.push({ id: category.id, name: category.name, type: "category" as const });

                    return (
                        <CategoryTreeItem
                            key={category.id}
                            category={category}
                            level={level}
                            trail={newTrail}
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
    categoryList: {
        // Add styles for categoryList if needed
    },
});
