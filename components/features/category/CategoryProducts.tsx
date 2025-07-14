import { useProductsByCategory } from "@/hooks/Product/Product";
import { Category } from "@/types";
import Loader from "../../ui/Loader";
import ProductList from "../product/ProductList";

interface CategoryProductsProps {
    category: Category;
}
export function CategoryProducts({ category }: CategoryProductsProps) {

    const { products, isLoading, isFetchingNextPage, loadMore } = useProductsByCategory(category.id);

    if (isLoading) {
        return <Loader />;
    }

    return <ProductList products={products} loadingMore={isFetchingNextPage} loadMore={loadMore} />;

}