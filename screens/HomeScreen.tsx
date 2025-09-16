import { useEvent } from "tamagui";

import {
  PageBody,
  PageHeader,
  PageSection,
  PageView,
} from "@/components/chrome/layout";
import {
  DebugProducts,
  DiscountedProducts,
  FeaturedProducts,
  RecentProducts,
} from "@/components/features/product/list/ProductCarousel";
import { ProductCategoryTiles } from "@/components/features/product-category/ProductCategoryTiles";
import { SearchBar } from "@/components/widgets/SearchBar";
import {
  THEME_CATEGORIES,
  THEME_CATEGORIES_BG,
  THEME_PRODUCTS_DISCOUNTED,
  THEME_PRODUCTS_DISCOUNTED_BG,
  THEME_PRODUCTS_FEATURED,
  THEME_PRODUCTS_FEATURED_BG,
  THEME_PRODUCTS_RECENT,
  THEME_PRODUCTS_RECENT_BG,
} from "@/config/app";
import { useScreenReady } from "@/hooks/ui/useScreenReady";
import { useCanonicalNavigation } from "@/hooks/useCanonicalNavigation";

export const HomeScreen = () => {
  const ready = useScreenReady();
  const { to } = useCanonicalNavigation();

  const handleSearch = useEvent((q: string) => {
    const text = q.trim();
    if (!text) {
      to("search");
      return;
    } // open search screen empty
    to("search", text);
  });
  if (!ready) return null;

  return (
    <PageView>
      <PageHeader container>
        <SearchBar onSubmit={handleSearch} />
      </PageHeader>
      <PageBody mode="scroll">
        {__DEV__ && (
          <PageSection title="Debug">
            <DebugProducts key="debug" />
          </PageSection>
        )}
        <PageSection title="Nyheter" theme={THEME_PRODUCTS_RECENT_BG}>
          <RecentProducts key="recent" theme={THEME_PRODUCTS_RECENT} />
        </PageSection>
        <PageSection title="Kategorier" theme={THEME_CATEGORIES_BG}>
          <ProductCategoryTiles key="categories" theme={THEME_CATEGORIES} />
        </PageSection>
        <PageSection title="Tilbud" theme={THEME_PRODUCTS_DISCOUNTED_BG}>
          <DiscountedProducts theme={THEME_PRODUCTS_DISCOUNTED} />
        </PageSection>
        <PageSection
          title="Utvalgte produkter"
          theme={THEME_PRODUCTS_FEATURED_BG}
        >
          <FeaturedProducts key="featured" theme={THEME_PRODUCTS_FEATURED} />
        </PageSection>
      </PageBody>
    </PageView>
  );
};
