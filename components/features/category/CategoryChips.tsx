import { Chip } from "@/components/ui/";
import { ThemedSpinner } from "@/components/ui/ThemedSpinner";
import { routes } from "@/config/routes";
import { useCategoryContext } from "@/contexts/CategoryContext";
import { useState } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { XStack } from "tamagui";

interface CategoryChipsProps {
    limit?: number;
    style?: StyleProp<ViewStyle>;
};

export const CategoryChips = ({ limit, style }: CategoryChipsProps) => {
    const { category, subCategories, isSubCategoriesLoading } = useCategoryContext();
    const [showAll, setShowAll] = useState(false);

    const limitedCategories = limit ? subCategories.slice(0, limit) : subCategories;
    const displayedCategories = showAll ? subCategories : limitedCategories;

    if (!category || !subCategories || subCategories.length === 0) {
        return null;
    }

    return (
        <XStack flexWrap="wrap" ai="center" gap="$2" style={style as any}>
            {displayedCategories.map((category) => (
                <Chip
                    key={category.id}
                    theme="primary"
                    title={category.name}
                    href={routes.category.path(category)}
                />
            ))}
            {isSubCategoriesLoading && <ThemedSpinner />}
            {!showAll && limit && subCategories.length > limit && (
                <Chip
                    theme="tertiary"
                    title={`Mer..(${subCategories.length - limit})`}
                    onPress={() => setShowAll(true)}
                />
            )}
            {showAll && limit && subCategories.length > limit && (
                <Chip theme="tertiary" title="Skjul" onPress={() => setShowAll(false)} />
            )}
        </XStack>
    );
};