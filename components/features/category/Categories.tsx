import { useCategoriesByCategory } from '@/context/Category/Category';
import { FlashList } from '@shopify/flash-list';
import CategoryListItem from './CategoryListItem';


export interface CategoryProps {
    categoryId: number;
    header?: any;
    empty?: any;
}

export default function Categories({ ...props }: CategoryProps) {

    const { categoryId, header, empty } = props;
    const { data } = useCategoriesByCategory(categoryId);

    const categories = data?.pages.flat() ?? [];


    return (

        <FlashList
            data={categories}
            renderItem={({ item }) =>
                <CategoryListItem {...item} />
            }
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false} // Disable scrolling since parent ScrollView will handle it
            nestedScrollEnabled={false}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={header}
            ListEmptyComponent={empty}
            // Performance optimizations
            numColumns={2}
            estimatedItemSize={10}
        />


    );
};
