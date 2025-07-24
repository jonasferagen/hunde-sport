import { CategoryChip, Chip, ChipText } from "@/components/ui/";
import { Category } from "@/types";
import { useState } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Spinner, XStack } from "tamagui";

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

    if (!categories || categories.length === 0) {
        return null;
    }

    return (
        <XStack flexWrap="wrap" alignItems="center" gap="$2" style={style as any}>
            {displayedCategories.map((category) => (
                <CategoryChip key={category.id} category={category} />
            ))}
            {(isLoading || isFetchingNextPage) && <Spinner />}
            {!showAll && limit && categories.length > limit && (
                <Chip
                    onPress={() => setShowAll(true)}
                    variant="accent"
                >
                    <ChipText>{`Mer..(${categories.length - limit})`}</ChipText>
                </Chip>
            )}
            {showAll && limit && categories.length > limit && (
                <Chip
                    onPress={() => setShowAll(false)}
                    variant="accent"
                >
                    <ChipText>Skjul</ChipText>
                </Chip>
            )}
        </XStack>
    );
};