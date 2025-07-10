// app/home.tsx
import Categories from '@/components/features/category/Categories';
import FeaturedProducts from '@/components/features/product/FeaturedProducts';
import PageTitle from '@/components/ui/_pageTitle';
import PageContent from "../components/ui/PageContent";
import PageView from "../components/ui/PageView";

const rootCategoryId = 0;

export default function Index() {
    return (
        <PageView>
            <PageContent>
                <PageTitle title="Hva leter du etter?" />
                <FeaturedProducts />
                <PageTitle title="Andre kategorier" />
                <Categories categoryId={rootCategoryId} />
            </PageContent>
        </PageView>
    );
}