import { useProductsByCategory } from "@/context/Product/Product";
import FullScreenLoader from "./FullScreenLoader";
import ProductList from "./product/ProductList";
import RetryView from "./RetryView";

export default function ProductsByCategory({ categoryId }: { categoryId: number }) {

    const { items, loading, error, refresh, loadMore, loadingMore } = useProductsByCategory(categoryId);

    if (loading) {
        return <FullScreenLoader />;
    }

    if (error) {
        return <RetryView error={error} onRetry={refresh} />;
    }

    return (
        <ProductList products={items} loadMore={loadMore} loadingMore={loadingMore} />
    );
}