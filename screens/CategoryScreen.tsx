import { CategoryChips } from '@/components/features/category/CategoryChips';
import { CategoryProducts } from '@/components/features/product/CategoryProducts';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { Loader } from '@/components/ui';
import { Breadcrumbs } from '@/components/ui/breadcrumbs/Breadcrumbs';
import { useCategories, useCategory } from '@/hooks/Category';
import { SPACING } from '@/styles';
import { Category } from '@/types';
import { Stack, useLocalSearchParams } from 'expo-router';
import { memo } from 'react';


const CategoryListArea = ({ category }: { category: Category }) => {
    const { categories, isFetchingNextPage } = useCategories(category.id);
    return (
        <CategoryChips categories={categories} isFetchingNextPage={isFetchingNextPage} limit={4} style={{ marginTop: SPACING.md }} />
    );
}


export const CategoryScreen = memo(() => {
    const { id } = useLocalSearchParams<{ id: string; }>();
    const { category, isLoading } = useCategory(Number(id));


    if (isLoading || !category) {
        return <Loader />;
    }

    return (
        <PageView>
            <PageContent>
                <Stack.Screen options={{ title: category.name }} />
                <PageSection secondary key={category.id}>
                    <Breadcrumbs />
                    <CategoryListArea category={category} />
                </PageSection>
            </PageContent>
            <PageContent flex>
                <PageSection accent key={category.id} flex>
                    <CategoryProducts category={category} />
                </PageSection>
            </PageContent>
        </PageView>
    );
});
