

import FullScreenLoader from "./components/FullScreenLoader";
import ProductCategoryList from "./components/productCategory/ProductCategoryList";
import RetryView from "./components/RetryView";
import { useProductCategories } from './contexts/ProductCategory';

export default function ProductCategories({ productCategoryId }: { productCategoryId: number }) {

    const { categories, loading, error, refresh, loadMore, loadingMore } = useProductCategories(productCategoryId);

    if (loading) {
        return <FullScreenLoader />;
    }

    if (error) {
        return <RetryView error={error} onRetry={refresh} />;
    }

    return (
        <ProductCategoryList productCategories={categories} loadMore={loadMore} loadingMore={loadingMore} />
    );
}