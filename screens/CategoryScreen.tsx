import { Breadcrumbs } from '@/components/features/breadcrumbs/Breadcrumbs';
import { CategoryChips } from '@/components/features/category/CategoryChips';
import { CategoryProducts } from '@/components/features/category/CategoryProducts';
import { PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { useCategories, useCategory } from '@/hooks/data/Category';
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { Category } from '@/models/Category';
import { Stack, useLocalSearchParams } from 'expo-router';
import { memo } from 'react';
import { Spinner, YStack } from 'tamagui';


const CategoryChipsContainer = ({ category }: { category: Category }) => {
    const { items: categories, isFetchingNextPage } = useCategories(category.id, { autoload: true });

    return (
        <CategoryChips categories={categories} isFetchingNextPage={isFetchingNextPage} limit={4} />
    );
}


export const CategoryScreen = memo(() => {
    useRenderGuard('CategoryScreen');
    const { id } = useLocalSearchParams<{ id: string; }>();
    const { category, isLoading } = useCategory(Number(id));


    return (
        <PageView>
            <Stack.Screen options={{ title: category?.name || 'Category' }} />
            <PageHeader>
                <Breadcrumbs categoryId={Number(id)} />
                {category && <CategoryChipsContainer category={category} />}
            </PageHeader>
            <YStack flex={1} paddingHorizontal="none" paddingVertical="none" >
                {isLoading && <YStack flex={1} ai="center" jc="center"><Spinner size="large" /></YStack>}
                {category && <CategoryProducts category={category} />}
            </YStack>
        </PageView>
    );
});
