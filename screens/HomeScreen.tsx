import { FeaturedProducts } from '@/components/features/product/FeaturedProducts';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { CategoryTile } from '@/components/ui';
import { useBreadcrumbs } from '@/hooks/Breadcrumbs/BreadcrumbContext';
import { useCategories } from '@/hooks/Category';
import { SPACING } from '@/styles';
import { View } from 'react-native';

const CategorySection = () => {
    const { categories } = useCategories(0);
    const { addCategory } = useBreadcrumbs();

    const filteredCategories = categories.filter((category) => category.name === 'Marp' || category.name === 'Katt' || category.name === 'Hund')
    filteredCategories.sort((a, b) => a.name.localeCompare(b.name));

    return filteredCategories.map((category, index) => {

        return (
            <View key={index}>
                <CategoryTile
                    category={category}
                    key={index}
                    height={200}
                    width={"100%"}
                    style={{ marginBottom: SPACING.lg }}
                    onPress={() => addCategory(category)}
                />
            </View>
        );
    });
}


export const HomeScreen = () => {
    return (
        <PageView>
            <PageContent>
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
