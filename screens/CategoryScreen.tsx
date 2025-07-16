import { CategoryChips } from '@/components/features/category/CategoryChips';
import { CategoryProducts } from '@/components/features/product/CategoryProducts';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { Loader } from '@/components/ui';
import { Breadcrumbs } from '@/components/ui/breadcrumbs/Breadcrumbs';
import { useCategories, useCategory } from '@/hooks/Category';
import { Category } from '@/types';
import { Stack, useLocalSearchParams } from 'expo-router';
import { memo } from 'react';
import { View } from 'react-native';


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
            <PageSection secondary>
                <PageContent key={category.id}>
                    <Breadcrumbs />
                    <View style={{ borderWidth: 1, borderColor: 'red' }}>
                        <CategoryListArea category={category} />
                    </View>
                </PageContent>
            </PageSection>
            <PageSection flex>
                <PageContent flex margin="none" key={category.id} style={{ borderWidth: 1, borderColor: 'red' }}>
                    <CategoryProducts category={category} />
                </PageContent>
            </PageSection>
        </PageView>
    );
});
