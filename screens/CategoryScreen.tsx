import { CategoryChips } from '@/components/features/category/CategoryChips';
import { CategoryProducts } from '@/components/features/category/CategoryProducts';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Loader } from '@/components/ui';
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


    useEffect(() => {
        if (category) {
            console.log("building breadcrumbs for category", category?.name);
            build(category.id);
        }
    }, [category, build]);


    if (isLoading || !category) {
        return <Loader size="large" flex />;
    }
    console.log("category screen loaded for category", category?.name);
    //<Breadcrumbs activeCategory={category} />
    return (
        <PageView>
            <Stack.Screen options={{ title: category.name }} />
            <PageHeader key={category.id}>

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
