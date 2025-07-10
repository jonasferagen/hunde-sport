

import { useCategoriesByCategory } from '@/context/Category/Category';
import FullScreenLoader from "./FullScreenLoader";
import RetryView from "./RetryView";
import CategoryList from "./category/CategoryList";

export default function Categories({ categoryId }: { categoryId: number }) {

    const { items, loading, error, refresh, loadMore, loadingMore } = useCategoriesByCategory(categoryId);

    if (loading) {
        return <FullScreenLoader />;
    }

    if (error) {
        return <RetryView error={error} onRetry={refresh} />;
    }

    return (
        <CategoryList categories={items} loadMore={loadMore} loadingMore={loadingMore} />
    );
}