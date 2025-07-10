// app/home.tsx
import Categories from '@/components/features/category/Categories';
import FeaturedProducts from '@/components/features/product/FeaturedProducts';
import PageTitle from '@/components/ui/_pageTitle';
import PageSection from '@/components/ui/PageSection';
import { StyleSheet, Text } from 'react-native';
import PageContent from "../components/ui/PageContent";
import PageView from "../components/ui/PageView";

const rootCategoryId = 0;

console.log(rootCategoryId);

export default function Index() {
    return (
        <PageView>
            <PageContent>
                <PageTitle title="Hva leter du etter?" />

                <PageSection type="primary">
                    <FeaturedProducts />
                </PageSection>

                <PageSection type="secondary">
                    <Text>Kunder har ogsså sett på</Text>
                </PageSection>

                <PageSection type="primary">
                    <FeaturedProducts />
                </PageSection>

                <PageTitle title="Andre kategorier" />
                <Categories categoryId={rootCategoryId} />
            </PageContent>
        </PageView>
    );
}


const styles = StyleSheet.create({


});