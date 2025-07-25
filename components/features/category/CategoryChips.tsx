import { Chip } from "@/components/ui/";
import { routes } from "@/config/routes";
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
        <XStack flexWrap="wrap" ai="center" gap="$2" style={style as any}>
            {displayedCategories.map((category) => (
                <Chip
                    key={category.id}
                    theme="primary"
                    title={category.name}
                    href={routes.category(category)}
                />
            ))}
            {(isLoading || isFetchingNextPage) && <Spinner />}
            {!showAll && limit && categories.length > limit && (
                <Chip
                    theme="accent"
                    title={`Mer..(${categories.length - limit})`}
                    onPress={() => setShowAll(true)}
                />
            )}
            {showAll && limit && categories.length > limit && (
                <Chip theme="accent" title="Skjul" onPress={() => setShowAll(false)} />
            )}
        </XStack>
    );
};