import { Heading } from '@/components/ui';
import { useCategoriesByCategory } from '@/context/Category/Category';
import { FlashList } from '@shopify/flash-list';
import { StyleSheet, View } from 'react-native';
import CategoryListItem from './CategoryListItem';

export default function Categories({ categoryId, title }: { categoryId: number, title: string }) {

    const { data } = useCategoriesByCategory(categoryId);

    const categories = data?.pages.flat() ?? [];

    return (
        categories.length > 0 && <View>
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
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});