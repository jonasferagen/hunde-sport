import { Heading } from '@/components/ui';
import { useCategoriesByCategory } from '@/context/Category/Category';
import { FlashList } from '@shopify/flash-list';
import CategoryListItem from './CategoryListItem';

export default function Categories({ categoryId, title }: { categoryId: number, title: string }) {

    const { data } = useCategoriesByCategory(categoryId);

    const categories = data?.pages.flat() ?? [];

    return (
        categories.length > 0 &&
        <FlashList
            data={categories}
            renderItem={({ item }) =>
                <CategoryListItem {...item} />
            }
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false} // Disable scrolling since parent ScrollView will handle it
            nestedScrollEnabled={false}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={<Heading title={title} size="lg" />}
            // Performance optimizations
            numColumns={2}
            estimatedItemSize={10}
        />


    );
};
