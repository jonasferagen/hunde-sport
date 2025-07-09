

import FullScreenLoader from "./components/FullScreenLoader";
import ProductList from "./components/product/ProductList";
import RetryView from "./components/RetryView";
import { useProductsByProductCategoryId } from "./contexts/Product";

export default function Products({ productCategoryId }: { productCategoryId: number }) {

    const { items, loading, error, refresh, loadMore, loadingMore } = useProductsByProductCategoryId(productCategoryId);

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