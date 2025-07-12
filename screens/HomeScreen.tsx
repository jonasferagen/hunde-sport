
import CategoryList from '@/components/features/category/CategoryList';
import FeaturedProducts from '@/components/features/product/FeaturedProducts';
import { Heading, PageContent, PageSection, PageView, SearchBar } from '@/components/ui';

const rootCategoryId = 0;

export default function Index() {
    return (
        <PageView>
            <PageContent scrollable>
                <PageSection type="primary">
                    <Heading title="Hund og katt" size="xxl" />
                    <SearchBar />
                    <FeaturedProducts />
                </PageSection>

                <PageSection type="secondary">
                    <CategoryList categoryId={rootCategoryId} header={<Heading title="Våre kategorier" size="lg" />} />
                </PageSection>
            </PageContent>
        </PageView>
    );
}

