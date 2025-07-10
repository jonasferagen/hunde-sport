// app/home.tsx
import Categories from '@/components/features/category/Categories';
import FeaturedProducts from '@/components/features/product/FeaturedProducts';
import { Heading, PageContent, PageSection, PageView } from '@/components/ui/_index';
import { StyleSheet } from 'react-native';

const rootCategoryId = 0;

export default function Index() {
    return (
        <PageView>
            <PageContent>
                <PageSection type="secondary">
                    <Heading title="Hva leter du etter?" size="xxl" />
                    <FeaturedProducts />
                </PageSection>

                <PageSection type="primary">
                    <Heading title="Våre kategorier" size="lg" />
                    <Categories categoryId={rootCategoryId} />
                </PageSection>

            </PageContent>
        </PageView>
    );
}


const styles = StyleSheet.create({


});