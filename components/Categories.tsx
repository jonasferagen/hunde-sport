

import { useCategoriesByCategory } from '@/context/Category/Category';
import FullScreenLoader from "./FullScreenLoader";
import RetryView from "./RetryView";
import CategoryList from "./category/CategoryList";

export default function Categories({ categoryId }: { categoryId: number }) {

    const categoryProvider = useCategoriesByCategory(categoryId);

    if (categoryProvider.loading) {
        return <FullScreenLoader />;
    }

    if (categoryProvider.error) {
        return <RetryView error={categoryProvider.error} onRetry={categoryProvider.refresh} />;
    }

    return (
        <CategoryList categoryProvider={categoryProvider} />
    );
}