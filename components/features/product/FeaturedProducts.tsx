import { useFeaturedProducts } from "@/context/Product/Product";
import FullScreenLoader from "../../ui/FullScreenLoader";
import ProductList from "./OldList";
export default function FeaturedProducts() {

    const { data, isLoading, fetchNextPage, isFetchingNextPage } = useFeaturedProducts();

    if (isLoading) {
        return <FullScreenLoader />;
    }

    const products = data?.pages.flat() ?? [];
    return <ProductList products={products} loadMore={fetchNextPage} loadingMore={isFetchingNextPage} />;

}