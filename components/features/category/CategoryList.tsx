import { useCategories } from "@/hooks/Category/Category";
import { ReactNode, useState } from "react";
import { Button, View } from "react-native";
import CategoryListItem from "./CategoryListItem";

export type CategoryProps = {
    categoryId?: number;
    limit?: number;
    header?: ReactNode;
    empty?: ReactNode;
};

export const CategoryList = ({ ...props }: CategoryProps) => {

    const { categoryId, header, empty, limit } = props;
    const { data } = useCategories(categoryId ?? 0);
    const [showAll, setShowAll] = useState(false);

    const categories = data?.pages.flat() ?? [];

    const limitedCategories = limit ? categories.slice(0, limit) : categories;
    const displayedCategories = showAll ? categories : limitedCategories;

    return (
        <View>
            {header}
            {categories.length > 0 ? (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {displayedCategories.map((category) => (
                        <CategoryListItem key={category.id} category={category} compact={true} />
                    ))}
                </View>
            ) : (
                empty
            )}
            {limit && categories.length > limit && (
                <Button
                    title={showAll ? "Vis færre" : "Vis alle"}
                    onPress={() => setShowAll(!showAll)}
                />
            )}
        </View>
    );
};
