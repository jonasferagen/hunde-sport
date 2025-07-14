import { Loader } from "@/components/ui/Loader";
import { useFeaturedProducts } from "@/hooks/Product/Product";
import { ScrollView } from "react-native";
import { ProductCard } from "./ProductCard";

export const FeaturedProducts = () => {

    const { products, isLoading } = useFeaturedProducts();

    if (isLoading) {
        return <Loader />;
    }

    return <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {products.map((product) => (
            <ProductCard key={product.id} product={product} />
        ))}
    </ScrollView>

}