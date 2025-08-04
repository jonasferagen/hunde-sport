import { Chip } from "@/components/ui/";
import { routes } from "@/config/routes";
import { useCategoryContext } from "@/contexts";
import { StackProps, XStack } from "tamagui";

interface CategoryChipsProps {
    limit?: number;
    showAll: boolean;
};

export const CategoryChips = ({ limit, showAll, ...stackProps }: StackProps & CategoryChipsProps) => {

    const { categories } = useCategoryContext();

    const limitedCategories = limit ? categories.slice(0, limit) : categories;
    const displayedCategories = showAll ? categories : limitedCategories;

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