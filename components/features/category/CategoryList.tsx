import Chip from "@/components/ui/Chip";
import { useCategories } from "@/hooks/Category/Category";
import { SPACING } from "@/styles/Dimensions";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import CategoryListItem from "./CategoryListItem";

export interface CategoryProps {
    categoryId: number;
    limit?: number;
};

export const CategoryList = ({ ...props }: CategoryProps) => {

    const { categoryId, limit } = props;
    const { categories, isFetchingNextPage } = useCategories(categoryId);
    const [showAll, setShowAll] = useState(false);

    const limitedCategories = limit ? categories.slice(0, limit) : categories;
    const displayedCategories = showAll ? categories : limitedCategories;

    console.log("category list rendered for", categoryId);
    return (
        <View style={styles.container}>
            {categories.length > 0 && (
                <View style={styles.listContainer}>

                    {displayedCategories.map((category) => (
                        <CategoryListItem key={category.id} category={category} />
                    ))}
                    {isFetchingNextPage && <ActivityIndicator />}
                    {!showAll && limit && categories.length > limit && (
                        <Chip
                            label={`Mer..(${categories.length - limit})`}
                            onPress={() => setShowAll(true)}
                            variant="accent"
                        />
                    )}

                    {showAll && (
                        <>

                            {limit && (
                                <Chip
                                    label={"Skjul.."}
                                    onPress={() => setShowAll(false)}
                                    variant="accent"
                                />
                            )}
                        </>
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