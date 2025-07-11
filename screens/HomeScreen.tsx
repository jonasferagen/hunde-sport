
import Categories from '@/components/features/category/Categories';
import FeaturedProducts from '@/components/features/product/FeaturedProducts';
import { Heading, PageContent, PageSection, PageView, SearchBar } from '@/components/ui';

const rootCategoryId = 0;

export default function Index() {
    return (
        <PageView>
            <PageContent>
                <PageSection type="secondary">
                    <Heading title="Hund og katt" size="xxl" />
                    <SearchBar />
                    <FeaturedProducts />
                </PageSection>

                <PageSection type="primary">
                    <Categories categoryId={rootCategoryId} title="Våre kategorier" />
                </PageSection>

            </PageContent>
        </PageView>
    );
}

