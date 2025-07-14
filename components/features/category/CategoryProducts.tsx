import { useProductsByCategory } from "@/hooks/Product/Product";
import Loader from "../../ui/Loader";
import ProductList from "../product/ProductList";

export function CategoryProducts({ categoryId }: { categoryId: number }) {

    const { products, isLoading, isFetchingNextPage, fetchNextPage } = useProductsByCategory(categoryId);

    if (isLoading) {
        return <Loader />;
    }

    console.log(isFetchingNextPage);

    return <ProductList products={products} loadingMore={isFetchingNextPage} loadMore={fetchNextPage} />;

}