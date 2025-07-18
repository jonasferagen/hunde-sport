import { CategoryChips } from '@/components/features/category/CategoryChips';
import { ProductDetails } from '@/components/features/product/ProductDetails';
import { ProductImage } from '@/components/features/product/ProductImage';
import { ProductImageGallery } from '@/components/features/product/ProductImageGallery';
import { ProductMainSection } from '@/components/features/product/ProductMainSection';
import { RelatedProducts } from '@/components/features/product/RelatedProducts';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumbs, Heading, Loader } from '@/components/ui';
import { useProduct } from '@/hooks/Product';
import { useProductVariations } from '@/hooks/useProductVariations';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import ImageViewing from 'react-native-image-viewing';

export const ProductScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: product, isLoading, error } = useProduct(Number(id));
  const { displayProduct, selectedOptions, handleSelectOption } = useProductVariations(product);

  const scrollRef = useScrollToTop(id);

  const handleSelectOptionAndScroll = (attributeSlug: string, option: string) => {
    handleSelectOption(attributeSlug, option);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };
  const [currentImageIndex, setImageIndex] = useState(0);
  const [isImageViewerVisible, setImageViewerVisible] = useState(false);

  const galleryImages = useMemo(
    () => (displayProduct?.images || []).map(img => ({ uri: img.src })),
    [displayProduct?.images]
  );

  const openImageViewer = useCallback((index: number) => {
    setImageIndex(index);
    setImageViewerVisible(true);
  }, []);

  const closeImageViewer = useCallback(() => {
    setImageViewerVisible(false);
  }, []);

  console.log("product screen loaded" + displayProduct?.id);

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
    throw new Error('Product not found: ' + id);
  }

  return (
    <PageView>
      <Stack.Screen options={{ title: displayProduct.name }} />
      <PageHeader>
        <Breadcrumbs product={product} />
        <Heading title={displayProduct.name} size="md" />
      </PageHeader>
      <PageSection scrollable ref={scrollRef}>
        <ProductImage image={product.images[0]} onPress={() => openImageViewer(0)} />
        <PageContent>
          <ProductMainSection
            product={product}
            displayProduct={displayProduct}
            selectedOptions={selectedOptions}
            onSelectOption={handleSelectOptionAndScroll}
          />
        </PageContent>

        <PageContent title="Produktinformasjon" secondary>
          <ProductDetails product={product} />
        </PageContent>

        <PageContent title="Produktbilder" horizontal>
          <ProductImageGallery
            images={product.images}
            onImagePress={openImageViewer}
          />
        </PageContent>

        <PageContent title="Kategorier">
          <CategoryChips categories={product.categories} />
        </PageContent>

        <PageContent title="Relaterte produkter" horizontal accent>
          <RelatedProducts productIds={product.related_ids} />
        </PageContent>
      </PageSection>
      <ImageViewing
        images={galleryImages.slice(-1)}
        imageIndex={currentImageIndex}
        visible={isImageViewerVisible}
        onRequestClose={closeImageViewer}
        animationType="slide"
      />
    </PageView >
  );
};
