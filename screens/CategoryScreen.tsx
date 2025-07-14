import { CategoryChips } from '@/components/features/category/CategoryChips';
import { CategoryProducts } from '@/components/features/category/CategoryProducts';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { Loader } from '@/components/ui';
import { Breadcrumbs } from '@/components/ui/breadcrumbs/Breadcrumbs';
import { useCategories, useCategory } from '@/hooks/Category';
import { SPACING } from '@/styles';
import { Category } from '@/types';
import { Stack, useLocalSearchParams } from 'expo-router';
import { memo } from 'react';
import { StyleSheet } from 'react-native';


const CategoryListArea = ({ category }: { category: Category }) => {
    const { categories, isFetchingNextPage } = useCategories(category.id);
    return (
        <CategoryChips categories={categories} isFetchingNextPage={isFetchingNextPage} limit={4} style={styles.listContainer} />
    );
}


export const CategoryScreen = memo(() => {
    const { id } = useLocalSearchParams<{ id: string; }>();
    const { category, isLoading } = useCategory(id);

    if (isLoading) {
        return <Loader />;
    }

    if (!category) {
        return <Loader />;
    }

    return (
        <PageView>
            <PageContent>
                <Stack.Screen options={{ title: category.name }} />
                <PageSection primary key={`products-${category.id}`}>
                    <Breadcrumbs />
                    <CategoryListArea category={category} />
                </PageSection>
            </PageContent>
            <PageContent scrollable>
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
