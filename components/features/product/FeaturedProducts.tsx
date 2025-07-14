import { ProductTile } from "@/components/ui/";
import { Loader } from "@/components/ui/Loader";
import { useBreadcrumbs } from "@/contexts/BreadcrumbContext";
import { buildCategoryTrail } from "@/hooks/Category";
import { useFeaturedProducts } from "@/hooks/Product/Product";
import { Product } from "@/types";
import { useQueryClient } from '@tanstack/react-query';
import { router } from "expo-router";
import { ScrollView } from "react-native";

const FeaturedProduct = ({ product }: { product: Product }) => {

    const { setCategories } = useBreadcrumbs();
    const queryClient = useQueryClient();

    const handlePress = async () => {
        if (product.categories.length > 0) {
            const categoryId = product.categories[0].id;
            const trail = await buildCategoryTrail(queryClient, categoryId);
            setCategories(trail, false); // Set breadcrumbs without navigating
        }
        router.push(`/product?id=${product.id}&name=${product.name}`);
    }

    if (product.categories.length === 0) {
        return null;
    }

    return <ProductTile key={product.id} product={product} width={200} height={150} mainColor={'#777'} onPress={handlePress} />
}


export const FeaturedProducts = () => {

    const { products, isLoading } = useFeaturedProducts();

    if (isLoading) {
        return <Loader />;
    }

    return <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {products.map((product) => (
            <FeaturedProduct product={product} />
        ))}
    </ScrollView>


}