import { Chip } from "@/components/ui/chips/Chip";
import { ThemedXStack } from "@/components/ui/themed-components";
import { useCanonicalNav } from "@/hooks/useCanonicalNav";
import { ProductCategory } from "@/types";
import { Link } from "expo-router";
import React from "react";


export const ProductCategoryChips = React.memo(({ productCategories }: { productCategories: ProductCategory[] }) => {
    const { linkProps } = useCanonicalNav();
    return (
        <ThemedXStack fw="wrap" gap="$2">
            {productCategories.map((productCategory) => (
                <Link key={productCategory.id} {...linkProps('product-category', productCategory)} asChild>
                    <Chip theme="shade">
                        {productCategory.name}
                    </Chip>
                </Link>
            ))}
        </ThemedXStack>
    );
});

