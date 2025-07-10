// app/home.tsx
import Categories from '@/components/features/category/Categories';
import FeaturedProducts from '@/components/features/product/FeaturedProducts';
import PageSection from '@/components/ui/PageSection';
import { StyleSheet } from 'react-native';
import PageSectionTitle from "../components/ui/_pageSectionTitle";
import PageContent from "../components/ui/PageContent";
import PageView from "../components/ui/PageView";

const rootCategoryId = 0;

export default function Index() {
    return (
        <PageView>
            <PageContent>
                <PageSection type="secondary">
                    <PageSectionTitle title="Hva leter du etter?" size="xxl" />
                    <FeaturedProducts />
                </PageSection>

                <PageSection type="primary">
                    <PageSectionTitle title="Kategorier" size="lg" />
                    <Categories categoryId={rootCategoryId} />
                </PageSection>

            </PageContent>
        </PageView>
    );
}


const styles = StyleSheet.create({


});