import { CategoryChip, Chip, Loader } from "@/components/ui/";
import { ChipContainer } from "@/components/ui/chips/ChipContainer";
import { Category } from "@/types";
import { useState } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

interface CategoryChipsProps {
    categories: Category[];
    isLoading?: boolean;
    isFetchingNextPage?: boolean;
    limit?: number;
    style?: StyleProp<ViewStyle>;
};

export const CategoryChips = ({ categories, isLoading, isFetchingNextPage, limit, style }: CategoryChipsProps) => {

    const [showAll, setShowAll] = useState(false);

    const limitedCategories = limit ? categories.slice(0, limit) : categories;
    const displayedCategories = showAll ? categories : limitedCategories;

    return (
        categories.length > 0 ? (
            <View style={[styles.container, style]}>
                <ChipContainer gap='xs'>
                    {displayedCategories.map((category) => (
                        <CategoryChip key={category.id} category={category} />
                    ))}
                    {(isLoading || isFetchingNextPage) && <Loader />}
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
                </ChipContainer>
            </View>
        ) : null
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
    },
});