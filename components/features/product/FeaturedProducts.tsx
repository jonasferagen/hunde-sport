import Loader from "@/components/ui/Loader";
import ProductTile from "@/components/ui/ProductTile";
import { useFeaturedProducts } from "@/hooks/Product/Product";
import { ScrollView } from "react-native";

export default function FeaturedProducts() {

    const { data, isLoading } = useFeaturedProducts();

    if (isLoading) {
        return <Loader />;
    }

    const products = data?.pages.flat() ?? [];

    return <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {products.map((product) => (
            <ProductTile key={product.id} product={product} width={200} height={150} />
        ))}
    </ScrollView>


}