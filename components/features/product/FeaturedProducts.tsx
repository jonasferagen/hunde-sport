import ProductTile from "@/components/ui/ProductTile";
import { useFeaturedProducts } from "@/context/Product/Product";
import { ScrollView } from "react-native";
import FullScreenLoader from "../../ui/FullScreenLoader";

export default function FeaturedProducts() {

    const { data, isLoading, fetchNextPage, isFetchingNextPage } = useFeaturedProducts();

    if (isLoading) {
        return <FullScreenLoader />;
    }

    const products = data?.pages.flat() ?? [];

    return <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {products.map((product) => (
            <ProductTile key={product.id} product={product} width={200} height={150} />
        ))}
    </ScrollView>

}