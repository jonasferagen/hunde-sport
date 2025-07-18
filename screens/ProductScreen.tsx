import { CategoryChips } from '@/components/features/category/CategoryChips';
import { ProductDetails } from '@/components/features/product/ProductDetails';
import { ProductImageManager } from '@/components/features/product/ProductImageManager';
import { ProductMainSection } from '@/components/features/product/ProductMainSection';
import { RelatedProducts } from '@/components/features/product/RelatedProducts';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumbs, CustomText, Loader } from '@/components/ui';
import { useProduct } from '@/hooks/Product';
import { useProductVariations } from '@/hooks/useProductVariations';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';

export const ProductScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const scrollRef = useScrollToTop(id);

  const { data: product, isLoading, error } = useProduct(Number(id));
  const { displayProduct, selectedOptions, handleSelectOption } = useProductVariations(product);

  const handleSelectOptionAndScroll = (attributeSlug: string, option: string) => {
    handleSelectOption(attributeSlug, option);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  console.log("product screen loaded");

  // Explicitly handle loading, error, and not-found states
  if (isLoading) {
    return <Loader size="large" flex />;
  }

  // If there's an error, throw it to be caught by an error boundary or crash for debugging.
  if (error) {
    throw error;
  }

  // If the product is not found after loading, show a message.
  if (!product || !displayProduct) {
    return (
      <PageView>
        <PageHeader title="Produkt ikke funnet" />
        <PageContent>
          <CustomText>Beklager, vi fant ikke produktet du lette etter.</CustomText>
        </PageContent>
      </PageView>
    );
  }

  return (
    <PageView>
      <Stack.Screen options={{ title: displayProduct!.name }} />
      <PageHeader>
        <Breadcrumbs product={product} />
        <CustomText bold>{displayProduct.name}</CustomText>
      </PageHeader>
      <PageSection scrollable ref={scrollRef}>

        <PageContent>
          <ProductImageManager product={displayProduct} />
          <ProductMainSection
            product={product}
            displayProduct={displayProduct}
            selectedOptions={selectedOptions}
            onSelectOption={handleSelectOptionAndScroll}
          />
        </PageContent>

        <PageContent secondary title="Produktinformasjon">
          <ProductDetails product={product} />
        </PageContent>

        <PageContent title="Kategorier">
          <CategoryChips categories={product.categories} />
        </PageContent>

        <PageContent horizontal accent title="Relaterte produkter" >
          <RelatedProducts productIds={product.related_ids} />
        </PageContent>
      </PageSection>
    </PageView >
  );
};
