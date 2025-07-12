import { useProductsByCategory } from "@/context/Product/Product";
import Loader from "../../ui/Loader";
import ProductList from "./ProductList";

export default function ProductsByCategory({ categoryId }: { categoryId: number }) {

    const { data, isLoading, fetchNextPage, isFetchingNextPage } = useProductsByCategory(categoryId);

    if (isLoading) {
        return <Loader />;
    }


    const products = data?.pages.flat() ?? [];
    return <ProductList products={products} loadMore={fetchNextPage} loadingMore={isFetchingNextPage} />;

}