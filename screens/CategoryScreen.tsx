import { CategoryChips } from '@/components/features/category/CategoryChips';
import { CategoryProducts } from '@/components/features/product/CategoryProducts';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Loader } from '@/components/ui';
import { Breadcrumbs } from '@/components/ui/breadcrumbs/Breadcrumbs';
import { useCategories, useCategory } from '@/hooks/Category';
import { Category } from '@/types';
import { Stack, useLocalSearchParams } from 'expo-router';
import { memo } from 'react';


const CategoryListArea = ({ category }: { category: Category }) => {
    const { categories, isFetchingNextPage } = useCategories(category.id);
    return (
        <CategoryChips categories={categories} isFetchingNextPage={isFetchingNextPage} limit={4} />
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
            <Stack.Screen options={{ title: category.name }} />
            <PageHeader key={category.id}>
                <Breadcrumbs category={category} />
                <CategoryListArea category={category} />
            </PageHeader>
            <PageSection flex>
                <PageContent flex paddingHorizontal="none" key={category.id}>
                    <CategoryProducts category={category} />
                </PageContent>
            </PageSection>
        </PageView>
    );
});
