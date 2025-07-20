import { CategoryChips } from '@/components/features/category';
import { BuyProduct, ProductDetails, ProductImage, ProductImageGallery, ProductVariations, RelatedProducts } from '@/components/features/product/';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumbs, CustomText, Heading, Loader } from '@/components/ui';
import { Row } from '@/components/ui/layout';
import { useProduct } from '@/hooks/Product';
import { useImageViewer } from '@/hooks/useImageViewer';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { Product } from '@/models/Product';
import { formatPrice } from '@/utils/helpers';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import ImageViewing from 'react-native-image-viewing';

export const ProductScreen = () => {
  const { id, categoryId: categoryIdFromParams } = useLocalSearchParams<{ id: string; categoryId?: string }>();
  const { data: product, isLoading, error } = useProduct(Number(id));

  const scrollRef = useScrollToTop(id);

  const { imageIndex, isViewerVisible, openImageViewer, closeImageViewer } = useImageViewer();
  const [productVariant, setProductVariant] = useState<Product | null>(null);

  // The product to display will be the selected variant, or fall back to the main product.
  const displayProduct = productVariant || product;
  const categoryId = categoryIdFromParams ? Number(categoryIdFromParams) : product?.categories[0]?.id;

  const galleryImages = useMemo(
    () => (product?.images || []).map(img => ({ uri: img.src })),
    [product?.images]
  );

  // Handle not-found state after loading is complete
  if (!product && !isLoading) {
    return <CustomText>Produktet ble ikke funnet.</CustomText>;
  }

  return (
    <PageView>
      <Stack.Screen options={{ title: displayProduct?.name || 'Laster inn...' }} />
      <PageHeader>
        {categoryId && <Breadcrumbs categoryId={categoryId} isLastClickable={true} />}
      </PageHeader>

      {isLoading ? (
        <PageSection flex>
          <PageContent flex>
            <Loader flex size="large" />
          </PageContent>
        </PageSection>
      ) : product && displayProduct && (
        <>
          <PageSection scrollable ref={scrollRef}>
            <PageContent>
              <ProductImage image={displayProduct?.images[0]} onPress={() => openImageViewer(0)} />
              <Row style={{ alignItems: "center", justifyContent: "space-between" }}>
                <Heading title={displayProduct.name} size="md" />
                <CustomText fontSize="xxl" bold>
                  {formatPrice(displayProduct.price)}
                </CustomText>
              </Row>
              <ProductVariations product={product} onVariantChange={setProductVariant} />
              <CustomText fontSize="sm" >{product.short_description}</CustomText>
              <BuyProduct product={displayProduct} />
            </PageContent>

            <PageContent title="Produktinformasjon" secondary>
              <ProductDetails product={product} />
            </PageContent>

            <PageContent title="Produktbilder" horizontal>
              <ProductImageGallery
                images={displayProduct.images.slice(1)}
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
        </>
      )}
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
