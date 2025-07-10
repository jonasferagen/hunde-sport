import { useProductsByCategory } from "@/context/Product/Product";
import FullScreenLoader from "./FullScreenLoader";
import ProductList from "./product/ProductList";

export default function ProductsByCategory({ categoryId }: { categoryId: number }) {

    const { data, isLoading, fetchNextPage, isFetchingNextPage } = useProductsByCategory(categoryId);

    if (isLoading) {
        return <FullScreenLoader />;
    }


    return (
        <ProductList products={data?.pages.flat() ?? []} loadMore={fetchNextPage} loadingMore={isFetchingNextPage} />
    );
}