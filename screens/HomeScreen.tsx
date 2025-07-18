import { CategoryCard } from '@/components/features/category/CategoryCard';
import { FeaturedProducts } from '@/components/features/product/FeaturedProducts';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Loader } from '@/components/ui';
import { SearchBar } from '@/components/ui/searchBar/Searchbar';
import { routes } from '@/config/routes';
import { useCategories } from '@/hooks/Category';
import { useRunOnFocus } from '@/hooks/useRunOnFocus';
import { SPACING } from '@/styles';
import { router, Stack } from 'expo-router';
import { TextInput } from 'react-native';

const CategorySection = () => {
    const { categories, isLoading, isFetchingNextPage } = useCategories(0);

    if (isLoading) {
        return <Loader />;
    }

    //  const filteredCategories = categories.filter((category) => category.name === 'Marp' || category.name === 'Katt' || category.name === 'Hund')
    //  filteredCategories.sort((a, b) => a.name.localeCompare(b.name));

    return categories.map((category, index) => {
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
    const searchInputRef = useRunOnFocus<TextInput>((input) => input.focus());

    const handleSearch = (query: string) => {
        if (query.trim()) {
            router.push(routes.search(query));
        }
    };

    return (
        <PageView>
            <Stack.Screen options={{ title: 'Hjem' }} />
            <PageHeader>
                <SearchBar ref={searchInputRef} initialQuery="" onSubmit={handleSearch} />
            </PageHeader>
            <PageSection>
                <PageContent accent horizontal title="Populære produkter">
                    <FeaturedProducts />
                </PageContent>
            </PageSection>
            <PageSection scrollable>
                <PageContent paddingHorizontal="none">
                    <CategorySection />
                </PageContent>
            </PageSection>
        </PageView>

    );
}
