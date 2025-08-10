import { Dropdown } from "@/components/ui/";
import { routes } from "@/config/routes";
import { useProductCategoryContext } from "@/contexts";
import { router } from "expo-router";
import { useMemo } from "react";

export const ProductCategoryDropdown = () => {
    const { productCategories, productCategory: currentCategory } = useProductCategoryContext();

    const options = useMemo(
        () => productCategories.map(pc => ({
            label: pc.name,
            value: pc.id, // just the ID
        })),
        [productCategories]
    );

    const handleValueChange = (categoryId: number) => {
        const category = productCategories.find(pc => pc.id === categoryId);
        if (category) {
            router.push(routes['product-category'].path(category));
        }
    };

    const currentValue = currentCategory?.id || 0;

    if (options.length === 0) {
        return null;
    }

    return (
        <Dropdown<number>
            options={options}
            value={currentValue}
            onValueChange={handleValueChange}
            placeholder="Velg kategori..."
        />
    );
};
