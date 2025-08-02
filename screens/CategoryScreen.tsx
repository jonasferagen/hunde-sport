import { Breadcrumbs } from '@/components/features/breadcrumbs/Breadcrumbs';
import { CategoryChips } from '@/components/features/category/CategoryChips';
import { CategoryProducts } from '@/components/features/category/CategoryProducts';
import { PageContent, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { CategoryProvider, useCategoryContext } from '@/contexts/CategoryContext';
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { useLocalSearchParams } from 'expo-router';
import { memo } from 'react';
import { LoadingScreen } from './misc/LoadingScreen';

const CategoryScreenContent = memo(() => {
    const { isLoading, subCategories, isSubCategoriesLoading } = useCategoryContext();

    return (
        <PageView>
            <PageHeader theme="tertiary_soft">
                <Breadcrumbs isLastClickable={true} />
                <CategoryChips limit={4} categories={subCategories} isLoading={isSubCategoriesLoading} />
            </PageHeader>
            <PageContent f={1} p="none">
                {isLoading ? <LoadingScreen /> : <CategoryProducts />}
            </PageContent>
        </PageView>
    );
});

export const CategoryScreen = memo(() => {
    useRenderGuard('CategoryScreen');
    const { id } = useLocalSearchParams<{ id: string }>();

    return (
        <CategoryProvider categoryId={Number(id)}>
            <CategoryScreenContent />
        </CategoryProvider>
    );
});

