
import Categories from '@/components/features/category/Categories';
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
                    <Categories categoryId={rootCategoryId} header={<Heading title="Våre kategorier" size="lg" />} />
                </PageSection>

            </PageContent>
        </PageView>
    );
}

