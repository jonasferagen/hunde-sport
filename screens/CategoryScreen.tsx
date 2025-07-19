import { CategoryChips } from '@/components/features/category/CategoryChips';
import { CategoryProducts } from '@/components/features/category/CategoryProducts';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumbs, Loader } from '@/components/ui';
import { useCategories, useCategory } from '@/hooks/Category';
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { Category } from '@/types';
import { Stack, useLocalSearchParams } from 'expo-router';
import { memo } from 'react';


const CategoryChipsContainer = ({ category }: { category: Category }) => {
    const { categories, isFetchingNextPage } = useCategories(category.id);

    return (
        <CategoryChips categories={categories} isFetchingNextPage={isFetchingNextPage} limit={4} />
    );
}


export const CategoryScreen = memo(() => {
    useRenderGuard('CategoryScreen');
    const { id } = useLocalSearchParams<{ id: string; }>();
    const { category, isLoading } = useCategory(Number(id));


    if (isLoading || !category) {
        return <Loader size="large" flex />;
    }
    console.log('catscreen', category);

    return (
        <PageView>
            <Stack.Screen options={{ title: category.name }} />
            <PageHeader key={category.id}>
                <Breadcrumbs key={category.id} category={category} />
                <CategoryChipsContainer category={category} />
            </PageHeader>
            <PageSection flex>
                <PageContent flex paddingHorizontal="none" paddingVertical="none" key={category.id}>
                    <CategoryProducts category={category} />
                </PageContent>
            </PageSection>
        </PageView>
    );
});
