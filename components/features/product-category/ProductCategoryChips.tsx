import { Chip } from "@/components/ui/chips/Chip";
import { ThemedXStack } from "@/components/ui/themed-components";
import { useCanonicalNavigation } from "@/hooks/useCanonicalNavigation";
import { ProductCategory } from "@/types";
import { Link } from "expo-router";
import React from "react";


export const ProductCategoryChips = React.memo(({ productCategories }: { productCategories: ProductCategory[] }) => {
    const { to } = useCanonicalNavigation();
    return (
        <ThemedXStack fw="wrap" gap="$2">
            {productCategories.map((productCategory) => (
                <ThemedXStack key={productCategory.id} onPress={() => to('product-category', productCategory)}>
                    <Chip theme="shade">
                        {productCategory.name}
                    </Chip>
                </ThemedXStack>
            ))}
        </ThemedXStack>
    );
});

