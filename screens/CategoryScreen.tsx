import { Breadcrumbs } from '@/components/features/breadcrumbs/Breadcrumbs';
import { CategoryChips } from '@/components/features/category/CategoryChips';
import { CategoryProducts } from '@/components/features/category/CategoryProducts';
import { PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { ThemedText } from '@/components/ui/ThemedText';
import { useCategories, useCategory } from '@/hooks/data/Category';
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { Category } from '@/models/Category';
import { useLocalSearchParams } from 'expo-router';
import { memo } from 'react';
import { YStack } from 'tamagui';
import { LoadingScreen } from './misc/LoadingScreen';


const CategoryChipsContainer = ({ category }: { category: Category }) => {
    const { items, isFetchingNextPage } = useCategories({ autoload: true });
    const categories = items.filter(cat => cat.parent === category.id).filter(category => category.shouldDisplay());

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
            <PageHeader>
                {category && category.parent !== 0 && <Breadcrumbs category={category} isLastClickable={true} />}
                {category && category.parent === 0 && <CategoryChipsContainer category={category} />}
            </PageHeader>
            <YStack flex={1} paddingHorizontal="none" paddingVertical="none" >
                <ThemedText>{category?.description}</ThemedText>
                {isLoading && <LoadingScreen />}
                {category && <CategoryProducts category={category} />}
            </YStack>
        </PageView>
    );
});
