
import { CategoryList } from '@/components/features/category';
import FeaturedProducts from '@/components/features/product/FeaturedProducts';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { Heading, SearchBar } from '@/components/ui';

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
                    <CategoryList header={<Heading title="Våre kategorier" size="lg" />} />
                </PageSection>
            </PageContent>
        </PageView>
    );
}

