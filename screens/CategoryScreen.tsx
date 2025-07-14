import { CategoryChips } from '@/components/features/category/CategoryChips';
import { CategoryIcon } from '@/components/features/category/CategoryIcon';
import { CategoryProducts } from '@/components/features/category/CategoryProducts';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { Heading, Loader } from '@/components/ui';
import { Breadcrumbs } from '@/components/ui/breadcrumbs/Breadcrumbs';
import useCategories, { useCategory } from '@/hooks/Category/Category';
import { SPACING } from '@/styles';
import { Category } from '@/types';
import { Stack, useLocalSearchParams } from 'expo-router';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';


const CategoryListArea = ({ category }: { category: Category }) => {
    const { categories, isFetchingNextPage } = useCategories(category.id);
    return (
        <CategoryChips categories={categories} isFetchingNextPage={isFetchingNextPage} limit={4} style={styles.listContainer} />
    );
}


export const CategoryScreen = memo(() => {
    const { id } = useLocalSearchParams<{ id: string; }>();
    const { data, isLoading } = useCategory(id);

    if (isLoading) {
        return <Loader />;
    }
    const category = data!;

    return (
        <PageView>
            <PageContent>
                <Stack.Screen options={{ title: category.name }} />
                <Breadcrumbs />
                <PageSection primary key={`products-${category.id}`}>
                    <View style={styles.headingContainer}>
                        <CategoryIcon image={category.image} size={24} color="black" />
                        <Heading title={category.name} size="lg" style={{ marginLeft: SPACING.sm }} />
                    </View>
                    <CategoryListArea category={category} />
                </PageSection>
                <PageSection key={`categories-${category.id}`} style={{ flex: 1 }} scrollable>
                    <CategoryProducts category={category} />
                </PageSection>
            </PageContent>
        </PageView>
    );
});

const styles = StyleSheet.create({

    headingContainer: {
        width: '100%',
        flexDirection: 'row',
    },
    listContainer: {
        marginTop: SPACING.md,
    },

});
