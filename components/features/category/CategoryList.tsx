import { useCategories } from "@/hooks/Category/Category";
import { View } from "react-native";
import CategoryListItem from "./CategoryListItem";

export type CategoryProps = {
    categoryId: number;
    header?: React.ReactNode;
    empty?: React.ReactNode;
}

export default function CategoryList({ ...props }: CategoryProps) {

    const { categoryId, header, empty } = props;
    const { data } = useCategories(categoryId);

    const categories = data?.pages.flat() ?? [];

    return (
        <View>
            {header}
            {categories.length > 0 ? (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {categories.map((category) => (
                        <CategoryListItem key={category.id} {...category} compact={true} />
                    ))}
                </View>
            ) : (
                empty
            )}
        </View>
    );
};
