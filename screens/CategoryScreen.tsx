import { CategoryChips } from '@/components/features/category/CategoryChips';
import { CategoryProducts } from '@/components/features/category/CategoryProducts';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Loader } from '@/components/ui';
import { Breadcrumbs } from '@/components/ui/breadcrumbs/Breadcrumbs';
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

    if (isLoading) return <Loader />;
    if (!category) return null;

    return (
        <PageView>
            <Stack.Screen options={{ title: category?.name || 'Category' }} />
            <PageHeader>
                <Breadcrumbs categoryId={Number(id)} />
                {category && <CategoryChipsContainer category={category} />}
            </PageHeader>
            <PageSection flex>
                <PageContent flex paddingHorizontal="none" paddingVertical="none" >
                    {category && <CategoryProducts category={category!} />}
                </PageContent>
            </PageSection>
        </PageView>
    );
});
