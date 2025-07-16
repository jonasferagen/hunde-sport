import { CategoryCard } from '@/components/features/category/CategoryCard';
import { FeaturedProducts } from '@/components/features/product/FeaturedProducts';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { Loader } from '@/components/ui';
import { useCategories } from '@/hooks/Category';
import { SPACING } from '@/styles';

const CategorySection = () => {
    const { categories, isLoading } = useCategories(0, { fetchAll: true });

    if (isLoading) {
        return <Loader />;
    }

    const filteredCategories = categories.filter((category) => category.name === 'Marp' || category.name === 'Katt' || category.name === 'Hund')
    filteredCategories.sort((a, b) => a.name.localeCompare(b.name));

    return filteredCategories.map((category, index) => {
        return (
            <CategoryCard
                category={category}
                key={index}
                style={{ marginBottom: SPACING.lg }}
            />
        );
    });
}

export const HomeScreen = () => {
    return (

        <PageView>
            <PageContent scrollable>
                <PageSection primary>
                    <FeaturedProducts />
                </PageSection>
                <PageSection secondary>
                    <CategorySection />
                </PageSection>
            </PageContent>
        </PageView>

    );
}
