
import { CategoryList } from '@/components/features/category';
import FeaturedProducts from '@/components/features/product/FeaturedProducts';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { Heading, SearchBar } from '@/components/ui';

export default function Index() {
    return (
        <PageView>
            <PageContent>
                <PageSection type="primary">
                    <Heading title="Hund og katt" size="xxl" />
                    <SearchBar />
                    <FeaturedProducts />
                </PageSection>

                <PageSection type="secondary" scrollable>
                    <CategoryList />
                </PageSection>
            </PageContent>
        </PageView>
    );
}

