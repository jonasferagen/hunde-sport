import { useCategoriesByCategory } from '@/context/Category/Category';
import { SPACING } from '@/styles/Dimensions';
import { FlashList } from '@shopify/flash-list';
import { StyleSheet } from 'react-native';
import CategoryListItem from './CategoryListItem';

export default function Categories({ categoryId }: { categoryId: number }) {

    const { data } = useCategoriesByCategory(categoryId);

    return (
        <FlashList
            data={data?.pages.flat() ?? []}
            renderItem={({ item }) =>
                <CategoryListItem {...item} style={styles.item} />
            }
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false} // Disable scrolling since parent ScrollView will handle it
            nestedScrollEnabled={false}
            // Performance optimizations
            numColumns={2}
            estimatedItemSize={10}
            contentContainerStyle={styles.contentContainer}
        />

    );
};

const styles = StyleSheet.create({
    contentContainer: {
        backgroundColor: 'transparent', // Needed because of typescript warning / issue with flashlist
        // Use negative margin to counteract the item padding on the container edges.
        marginHorizontal: -SPACING.sm,
        marginVertical: -SPACING.sm,
    },
    item: {
        // Use padding to create the visual gap between columns.
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.sm, // Optional: for vertical spacing between rows
    },
});