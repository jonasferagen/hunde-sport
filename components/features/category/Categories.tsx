import { useCategoriesByCategory } from '@/context/Category/Category';
import { SPACING } from '@/styles/Dimensions';
import { Category } from '@/types';
import { FlatList, ListRenderItem, StyleSheet, View } from 'react-native';
import CategoryListItem from './CategoryListItem';

export default function Categories({ categoryId }: { categoryId: number }) {

    const { data, error, isLoading, fetchNextPage, isFetchingNextPage } = useCategoriesByCategory(categoryId);

    // components/features/category/Categories.tsx
    const keyExtractor = (item: Category, index: number) => `${item.id}_${index}`;

    const renderItem: ListRenderItem<Category> = ({ item }) => {
        return <CategoryListItem {...item} style={styles.item} />;
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={data?.pages.flat() ?? []}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false} // Disable scrolling since parent ScrollView will handle it
                nestedScrollEnabled={true}
                // Performance optimizations
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={11}
                removeClippedSubviews={true}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    columnWrapper: {
        gap: SPACING.md,
    },
    item: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: 20, // Add some padding at the bottom
    },
});
