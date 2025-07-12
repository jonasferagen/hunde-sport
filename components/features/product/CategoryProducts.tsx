import { useProductsByCategory } from "@/hooks/Product/Product";
import { useMemo } from "react";
import Loader from "../../ui/Loader";
import ProductList from "./ProductList";

export default function ProductsByCategory({ categoryId }: { categoryId: number }) {

    const { data, isLoading, fetchNextPage, isFetchingNextPage } = useProductsByCategory(categoryId);
    const products = useMemo(() => data?.pages.flat() ?? [], [data]);

    if (isLoading) {
        return <Loader />;
    }

    return <ProductList products={products} loadMore={fetchNextPage} loadingMore={isFetchingNextPage} />;

}