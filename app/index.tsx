// app/home.tsx
import Categories from '@/components/features/category/Categories';
import FeaturedProducts from '@/components/features/product/FeaturedProducts';
import PageTitle from '@/components/ui/_pagetitle';
import PageView from "./_pageView";

const rootCategoryId = 0;

export default function Index() {
    return (
        <PageView>
            <PageTitle title="Hva leter du etter?" />
            <FeaturedProducts />
            <PageTitle title="Andre kategorier" />
            <Categories categoryId={rootCategoryId} />
        </PageView>
    );
}