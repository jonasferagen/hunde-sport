import { Chip } from "@/components/ui/";
import { ThemedSpinner } from "@/components/ui/ThemedSpinner";
import { routes } from "@/config/routes";
import { Category } from "@/models/Category";
import { StackProps, XStack } from "tamagui";

interface CategoryChipsProps {
    categories: Category[];
    limit?: number;
    isLoading?: boolean;
    showAll: boolean;
};

export const CategoryChips = ({ limit, categories, isLoading, showAll, ...stackProps }: StackProps & CategoryChipsProps) => {

    const limitedCategories = limit ? categories.slice(0, limit) : categories;
    const displayedCategories = showAll ? categories : limitedCategories;

    if (isLoading) {
        return <ThemedSpinner />;
    }

    if (!categories || categories.length === 0) {
        return null;
    }

    return (
        <XStack flexWrap="wrap" ai="center" gap="$2" {...stackProps}>
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