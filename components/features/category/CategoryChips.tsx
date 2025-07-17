import { CategoryChip, Chip } from "@/components/ui/";
import { SPACING } from "@/styles/Dimensions";
import { Category } from "@/types";
import { useState } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

interface CategoryChipsProps {
    categories: Category[];
    isFetchingNextPage?: boolean;
    limit?: number;
    style?: StyleProp<ViewStyle>;
};

export const CategoryChips = ({ categories, isFetchingNextPage, limit, style }: CategoryChipsProps) => {

    const [showAll, setShowAll] = useState(false);

    const limitedCategories = limit ? categories.slice(0, limit) : categories;
    const displayedCategories = showAll ? categories : limitedCategories;

    return (
        categories.length > 0 ? (
            <View style={[styles.container, style]}>
                <View style={styles.listContainer}>

                    {displayedCategories.map((category) => (
                        <CategoryChip key={category.id} category={category} />
                    ))}
                    {isFetchingNextPage && <Chip label="Laster..." />}
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
            </View>
        ) : null
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
        gap: SPACING.xs,

    },
});