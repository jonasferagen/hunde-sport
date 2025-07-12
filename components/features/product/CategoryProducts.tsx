import { useProductsByCategory } from "@/context/Product/Product";
import FullScreenLoader from "../../ui/FullScreenLoader";
import ProductList from "./ProductList";

export default function ProductsByCategory({ categoryId }: { categoryId: number }) {

    const { data, isLoading, fetchNextPage, isFetchingNextPage } = useProductsByCategory(categoryId);

    if (isLoading) {
        return <FullScreenLoader />;
    }


    const products = data?.pages.flat() ?? [];
    return <ProductList products={products} loadMore={fetchNextPage} loadingMore={isFetchingNextPage} />;

}