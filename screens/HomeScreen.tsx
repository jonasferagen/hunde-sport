
import FeaturedProducts from '@/components/features/product/FeaturedProducts';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { CategoryTile, Heading, SearchBar } from '@/components/ui';
import { useCategories } from '@/hooks/Category/Category';
import { SPACING } from '@/styles/Dimensions';
import { View } from 'react-native';


const CategorySection = () => {
    const { categories } = useCategories(0);

    return categories.filter((category) => category.name === 'Hund' || category.name === 'Katt').map((category, index) => (
        <View key={index}>
            <CategoryTile category={category} key={index} height={200} width={"100%"} style={{ marginVertical: SPACING.md }} />
        </View>
    ));
}


export default function Index() {
    return (
        <PageView>
            <PageContent>
                <PageSection primary>
                    <Heading title="Hund og katt" size="xxl" />
                    <SearchBar />
                    <FeaturedProducts />
                </PageSection>
                <PageSection scrollable>
                    <CategorySection />
                </PageSection>
            </PageContent>
        </PageView>
    );
}

