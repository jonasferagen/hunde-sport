import { Chip } from "@/components/ui/";
import { routes } from "@/config/routes";
import { useProductCategoryContext } from "@/contexts";
import { StackProps, ThemeName, XStack } from "tamagui";

interface ProductCategoryChipsProps {
    limit?: number;
    showAll: boolean;
    theme?: ThemeName;
};

export const ProductCategoryChips = ({ limit, showAll, theme, ...stackProps }: StackProps & ProductCategoryChipsProps) => {

    const { productCategories } = useProductCategoryContext();

    const limitedProductCategories = limit ? productCategories.slice(0, limit) : productCategories;
    const displayedProductCategories = showAll ? productCategories : limitedProductCategories;

    if (!productCategories || productCategories.length === 0) {
        return null;
    }

    return (
        <XStack flexWrap="wrap" ai="center" gap="$2" {...stackProps}>
            {displayedProductCategories.map((productCategory) => (
                <Chip
                    key={productCategory.id}
                    theme={theme}
                    title={productCategory.name}
                    href={routes['product-category'].path(productCategory)}
                />
            ))}
        </XStack>
    );
};