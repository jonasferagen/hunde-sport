import { Chip } from "@/components/ui/";
import { routes } from "@/config/routes";
import { useProductCategoryContext } from "@/contexts";
import { Link } from "expo-router";
import React from "react";
import { StackProps, XStack } from "tamagui";

interface ProductCategoryChipsProps {
    limit?: number;
    showAll: boolean;

};
/*
export const ProductCategoryChips = ({ limit, showAll, ...stackProps }: StackProps & ProductCategoryChipsProps) => {

    const { productCategories } = useProductCategoryContext();

    const limitedProductCategories = limit ? productCategories.slice(0, limit) : productCategories;
    const displayedProductCategories = showAll ? productCategories : limitedProductCategories;

    return (
        productCategories.length > 0 && <XStack fw="wrap" ai="center" gap="$2" {...stackProps}>
            {displayedProductCategories.map((productCategory) => (
                <Link key={productCategory.id} href={routes['product-category'].path(productCategory)} asChild>
                    <Chip>
                        {productCategory.name}
                    </Chip>
                </Link>
            ))}
        </XStack>
    );
};
*/
export const ProductCategoryChips = ({ limit = 4, showAll, ...stackProps }: StackProps & ProductCategoryChipsProps) => {

    const [all, setAll] = React.useState(showAll);

    const { productCategories } = useProductCategoryContext();

    const limitedProductCategories = !all ? productCategories.slice(0, limit) : productCategories;
    const displayedProductCategories = all ? productCategories : limitedProductCategories;

    return (
        productCategories.length > 0 && <XStack fw="wrap" ai="center" gap="$2" {...stackProps}>
            {displayedProductCategories.map((productCategory) => (
                <Link key={productCategory.id} href={routes['product-category'].path(productCategory)} asChild>
                    <Chip theme="normal">
                        {productCategory.name}
                    </Chip>
                </Link>
            ))}
            <Chip onPress={() => { setAll(!all); }} theme="strong">
                {all ? 'Skjul' : 'Alle'}
            </Chip>
        </XStack>
    );
};