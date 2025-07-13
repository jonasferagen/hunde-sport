import { useProductsByCategory } from "@/hooks/Product/Product";
import { useMemo } from "react";
import Loader from "../../ui/Loader";
import ProductList from "../product/ProductList";

export function CategoryProducts({ categoryId }: { categoryId: number }) {

    const { data, isLoading, fetchNextPage, isFetchingNextPage } = useProductsByCategory(categoryId);
    const products = useMemo(() => data?.pages.flat() ?? [], [data]);

    console.log(products.length);
    if (isLoading) {
        return <Loader />;
    }

    return <ProductList products={products} loadMore={fetchNextPage} loadingMore={isFetchingNextPage} />;

}