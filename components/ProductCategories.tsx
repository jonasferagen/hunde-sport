

import { useProductCategories } from '@/context/ProductCategory/ProductCategory';
import FullScreenLoader from "./FullScreenLoader";
import RetryView from "./RetryView";
import ProductCategoryList from "./productCategory/ProductCategoryList";

export default function ProductCategories({ productCategoryId }: { productCategoryId: number }) {

    const { items, loading, error, refresh, loadMore, loadingMore } = useProductCategories(productCategoryId);

    if (loading) {
        return <FullScreenLoader />;
    }

    if (error) {
        return <RetryView error={error} onRetry={refresh} />;
    }

    return (
        <ProductCategoryList productCategories={items} loadMore={loadMore} loadingMore={loadingMore} />
    );
}