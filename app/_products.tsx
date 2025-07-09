

import FullScreenLoader from "./components/FullScreenLoader";
import ProductList from "./components/product/ProductList";
import RetryView from "./components/RetryView";
import { useProducts } from "./contexts/ProductContext/ProductProvider";

export default function Products(productCategoryId: number) {

    const { products, loading, error, refresh, loadMore, loadingMore } = useProducts(productCategoryId);

    if (loading) {
        return <FullScreenLoader />;
    }

    if (error) {
        return <RetryView error={error} onRetry={refresh} />;
    }

    return (
        <ProductList products={products} loadMore={loadMore} loadingMore={loadingMore} />
    );
}