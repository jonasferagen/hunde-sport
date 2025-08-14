import { Chip, ThemedXStack } from "@/components/ui/";
import { routes } from "@/config/routes";
import { ProductCategory } from "@/types";
import { Link } from "expo-router";
import React from "react";


export const ProductCategoryChips = React.memo(({ productCategories }: { productCategories: ProductCategory[] }) => {

    return (
        <ThemedXStack fw="wrap" gap="$2">
            {productCategories.map((productCategory) => (
                <Link key={productCategory.id} href={routes['product-category'].path(productCategory)} asChild>
                    <Chip theme="shade">
                        {productCategory.name}
                    </Chip>
                </Link>
            ))}
        </ThemedXStack>
    );
});

