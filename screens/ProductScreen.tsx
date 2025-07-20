import { CategoryChips } from '@/components/features/category/CategoryChips';
import { BuyProduct } from '@/components/features/product/BuyProduct';
import { ProductDetails } from '@/components/features/product/ProductDetails';
import { ProductImage } from '@/components/features/product/ProductImage';
import { ProductImageGallery } from '@/components/features/product/ProductImageGallery';
import { ProductVariations } from '@/components/features/product/ProductVariations';
import { RelatedProducts } from '@/components/features/product/RelatedProducts';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumbs, CustomText, Heading, Loader } from '@/components/ui';
import { Row } from '@/components/ui/listitem/layout';
import { useProduct } from '@/hooks/Product';
import { useImageViewer } from '@/hooks/useImageViewer';
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { formatPrice } from '@/utils/helpers';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import ImageViewing from 'react-native-image-viewing';

export const ProductScreen = () => {
  useRenderGuard('ProductScreen');

  const { id, categoryId: categoryIdFromParams } = useLocalSearchParams<{ id: string; categoryId?: string }>();
  const { data: product, isLoading, error } = useProduct(Number(id));

  const scrollRef = useScrollToTop(id);
  //  scrollRef.current?.scrollTo({ y: 0, animated: true });

  const { imageIndex, isViewerVisible, openImageViewer, closeImageViewer } = useImageViewer();

  const galleryImages = useMemo(
    () => (product?.images || []).map(img => ({ uri: img.src })),
    [product?.images]
  );

  // Explicitly handle loading, error, and not-found states
  if (isLoading) {
    return <Loader size="large" flex />;
  }

  // If there's an error, throw it to be caught by an error boundary or crash for debugging.
  if (error) {
    throw error;
  }

  // If the product is not found after loading, show a message.
  if (!product) {
    throw new Error('Product not found: ' + id);
  }

  const categoryId = categoryIdFromParams ? Number(categoryIdFromParams) : product.categories[0]?.id;

  return (
    <PageView>
      <Stack.Screen options={{ title: product.name }} />
      <PageHeader>
        <Breadcrumbs categoryId={categoryId} isLastClickable={true} />
      </PageHeader>
      <PageSection scrollable ref={scrollRef}>
        <ProductImage image={product.images[0]} onPress={() => openImageViewer(0)} />
        <PageContent>
          <Row style={{ alignItems: "center", justifyContent: "space-between" }}>
            <Heading title={product.name} size="md" />
            <CustomText fontSize="xxl" bold>
              {formatPrice(product.price)}
            </CustomText>
          </Row>
          <ProductVariations
            product={product}
          />
          <CustomText fontSize="sm" >{product.short_description}</CustomText>
          <BuyProduct product={product} />
        </PageContent>

        <PageContent title="Produktinformasjon" secondary>
          <ProductDetails product={product} />
        </PageContent>

        <PageContent title="Produktbilder" horizontal>
          <ProductImageGallery
            images={product.images.slice(1)}
            onImagePress={(index) => openImageViewer(index + 1)}
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
        images={galleryImages}
        imageIndex={imageIndex}
        visible={isViewerVisible}
        onRequestClose={closeImageViewer}
        animationType="slide"
      />
    </PageView >
  );
};
