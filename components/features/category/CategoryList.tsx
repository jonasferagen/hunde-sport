import Chip from "@/components/ui/Chip";
import { useCategories } from "@/hooks/Category/Category";
import { SPACING } from "@/styles/Dimensions";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import CategoryListItem from "./CategoryListItem";

export type CategoryProps = {
    categoryId?: number;
    limit?: number;
};

export const CategoryList = ({ ...props }: CategoryProps) => {

    const { categoryId, limit } = props;
    const { data } = useCategories(categoryId ?? 0);
    const [showAll, setShowAll] = useState(false);


    const categories = data?.pages.flat() ?? [];

    const limitedCategories = limit ? categories.slice(0, limit) : categories;
    const displayedCategories = showAll ? categories : limitedCategories;

    return (
        <View style={styles.container}>
            {categories.length > 0 && (
                <View style={styles.listContainer}>

                    {displayedCategories.map((category) => (
                        <CategoryListItem key={category.id} category={category} />
                    ))}
                    {limit && categories.length > limit && (
                        <Chip
                            label={showAll ? "Skjul.." : `Mer..(${categories.length - limit})`}
                            onPress={() => setShowAll(!showAll)}
                            variant="accent"
                        />
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
    },
    listContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginBottom: SPACING.sm,
    },
});