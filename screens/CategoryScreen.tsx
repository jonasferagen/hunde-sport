import { CategoryChips } from '@/components/features/category/CategoryChips';
import { ProductList } from '@/components/features/product/ProductList';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { Loader } from '@/components/ui';
import { Breadcrumbs } from '@/components/ui/breadcrumbs/Breadcrumbs';
import { useCategories, useCategory } from '@/hooks/Category';
import { useProductsByCategory } from '@/hooks/Product';
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
    const categoryId = Number(id);
    const { category } = useCategory(categoryId);
    const { products, isLoading, isFetchingNextPage, fetchNextPage } = useProductsByCategory(categoryId);


    if (!category || isLoading) {
        return <Loader />;
    }

    return (
        <PageView>
            <PageContent>
                <Stack.Screen options={{ title: category.name }} />
                <PageSection secondary key={`products-${category.id}`}>
                    <Breadcrumbs />
                    <CategoryListArea category={category} />
                </PageSection>
            </PageContent>
            <PageContent flex>
                <PageSection accent key={`categories-${category.id}`} flex>
                    <ProductList products={products} loadingMore={isFetchingNextPage} loadMore={fetchNextPage} />
                </PageSection>
            </PageContent>
        </PageView>
    );
});

