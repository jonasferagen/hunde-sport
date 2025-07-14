import { useProductsByCategory } from "@/hooks/Product/Product";
import { useCallback } from "react";
import Loader from "../../ui/Loader";
import ProductList from "../product/ProductList";

export function CategoryProducts({ categoryId }: { categoryId: number }) {

    const { products, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useProductsByCategory(categoryId);

    const loadMore = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasNextPage, isFetchingNextPage]);

    if (isLoading) {
        return <Loader />;
    }

    console.log("category products rendered for", categoryId)

    return <ProductList products={products} loadingMore={isFetchingNextPage} loadMore={loadMore} />;

}