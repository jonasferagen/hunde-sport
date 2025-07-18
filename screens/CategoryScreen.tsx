import { CategoryChips } from '@/components/features/category/CategoryChips';
import { CategoryProducts } from '@/components/features/category/CategoryProducts';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Loader } from '@/components/ui';
import { Breadcrumbs } from '@/components/ui/breadcrumbs/Breadcrumbs';
import { useBreadcrumbContext } from '@/contexts';
import { useCategories, useCategory } from '@/hooks/Category';
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { Category } from '@/types';
import { Stack, useLocalSearchParams } from 'expo-router';
import { memo, useEffect } from 'react';


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
    const { build } = useBreadcrumbContext();

    console.log("category screen loaded");
    useEffect(() => {
        if (category) {
            build(category.id);
        }
    }, [category, build]);


    if (isLoading || !category) {
        return <Loader size="large" flex />;
    }

    return (
        <PageView>
            <Stack.Screen options={{ title: category.name }} />
            <PageHeader key={category.id}>
                <Breadcrumbs />
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
