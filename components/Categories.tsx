

import { useCategoriesByCategory } from '@/context/Category/Category';
import FullScreenLoader from "./FullScreenLoader";
import RetryView from "./RetryView";
import CategoryList from "./category/CategoryList";

export default function Categories({ categoryId }: { categoryId: number }) {

    const { data, error, isLoading, fetchNextPage, isFetchingNextPage } = useCategoriesByCategory(categoryId);

    if (isLoading) {
        return <FullScreenLoader />;
    }

    if (error) {
        return <RetryView error={error.message} onRetry={fetchNextPage} />;
    }

    const categories = data?.pages.flat() ?? [];

    return (
        <CategoryList categories={categories} loadMore={fetchNextPage} loadingMore={isFetchingNextPage} />
    );
}