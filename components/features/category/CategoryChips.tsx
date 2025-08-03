import { Chip } from "@/components/ui/";
import { ThemedSpinner } from "@/components/ui/ThemedSpinner";
import { routes } from "@/config/routes";
import { Category } from "@/models/Category";
import { ChevronDown, ChevronUp } from "@tamagui/lucide-icons";
import { useState } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { XStack } from "tamagui";

interface CategoryChipsProps {
    categories: Category[];
    limit?: number;
    style?: StyleProp<ViewStyle>;
    isLoading?: boolean;
};

export const CategoryChips = ({ limit, style, categories, isLoading }: CategoryChipsProps) => {

    const [showAll, setShowAll] = useState(false);


    const limitedCategories = limit ? categories.slice(0, limit) : categories;
    const displayedCategories = showAll ? categories : limitedCategories;

    if (!categories || categories.length === 0) {
        return null;
    }

    return (
        <XStack flexWrap="wrap" ai="center" gap="$2" style={style as any}>

            {isLoading && <ThemedSpinner />}
            {!showAll && limit && categories.length > limit && (
                <Chip
                    theme="light"
                    icon={<ChevronDown size="$4" color="black" />}
                    onPress={() => setShowAll(true)}
                />
            )}
            {showAll && limit && categories.length > limit && (
                <Chip theme="light" icon={<ChevronUp size="$4" color="black" />} onPress={() => setShowAll(false)} />
            )}
            {displayedCategories.map((category) => (
                <Chip
                    key={category.id}
                    theme="secondary_soft"
                    title={category.name}
                    href={routes.category.path(category)}
                />
            ))}
        </XStack>
    );
};