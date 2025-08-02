import { Breadcrumbs } from '@/components/features/breadcrumbs/Breadcrumbs';
import { CategoryChips } from '@/components/features/category/CategoryChips';
import { CategoryProducts } from '@/components/features/category/CategoryProducts';
import { PageContent, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { ThemedSpinner } from '@/components/ui/ThemedSpinner';
import { useCategories, useCategory } from '@/hooks/data/Category';
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { Category } from '@/models/Category';
import { useLocalSearchParams } from 'expo-router';
import { memo } from 'react';
import { LoadingScreen } from './misc/LoadingScreen';




export const CategoryScreen = memo(() => {
    useRenderGuard('CategoryScreen');
    const { id } = useLocalSearchParams<{ id: string; }>();
    const { category } = useCategory(Number(id));

    return (
        <PageView>
            <PageHeader>
                {category ? <CategoryScreenHeader category={category} /> : <ThemedSpinner />}
            </PageHeader>
            <PageContent f={1} p="none" >
                {category ? <CategoryProducts category={category} /> : <LoadingScreen />}
            </PageContent>
        </PageView>
    );
});

const CategoryScreenHeader = ({ category }: { category: Category }) => {

    const { items, isFetchingNextPage } = useCategories({ autoload: true });
    const categories = items.filter(cat => cat.parent === category.id).filter(category => category.shouldDisplay());

    return (
        <>
            <Breadcrumbs category={category} isLastClickable={true} />
            <CategoryChips categories={categories} isFetchingNextPage={isFetchingNextPage} limit={4} />
        </>
    );
}

