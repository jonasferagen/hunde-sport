
import FeaturedProducts from '@/components/features/product/FeaturedProducts';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { CategoryTile, SearchBar } from '@/components/ui';
import { useBreadcrumbs } from '@/hooks/Breadcrumb/BreadcrumbProvider';
import { useCategories } from '@/hooks/Category/Category';
import { SPACING } from '@/styles';
import { View } from 'react-native';


const CategorySection = () => {
    const { categories } = useCategories(0);
    const { setTrail, init } = useBreadcrumbs();

    return categories.filter((category) => category.name === 'Marp' || category.name === 'Katt' || category.name === 'Hund').map((category, index) => (
        <View key={index}>
            <CategoryTile category={category} key={index} height={200} width={"100%"} style={{ marginBottom: SPACING.lg }} onPress={() => setTrail(init().concat([{ id: category.id, name: category.name, type: 'category' }]), true)} />
        </View>
    ));
}


export default function Index() {
    return (
        <PageView>
            <PageContent>
                <PageSection primary>
                    <SearchBar placeholder="Jeg leter etter .." />
                </PageSection>
                <PageSection scrollable>
                    <View style={{ flex: 1, paddingVertical: SPACING.lg, borderColor: '#ccc', borderWidth: 1 }}>
                        <FeaturedProducts />
                    </View>
                    <View style={{ height: SPACING.lg }} />
                    <CategorySection />
                </PageSection>
            </PageContent>
        </PageView>
    );
}


