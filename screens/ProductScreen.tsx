import { CategoryChips } from '@/components/features/category';
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
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { Product } from '@/models/Product';
import { formatPrice } from '@/utils/helpers';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import ImageViewing from 'react-native-image-viewing';

export const ProductScreen = () => {
  const { id, categoryId: categoryIdFromParams } = useLocalSearchParams<{ id: string; categoryId?: string }>();
  const { data: product, isLoading, error } = useProduct(Number(id));
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const scrollRef = useScrollToTop(id);

  // This effect ensures that selectedProduct is updated when the base product loads
  // or when the user navigates to a new product page.
  useEffect(() => {
    if (product) {
      // Initially, the selected product is the base product itself.
      // The ProductVariations component will then update it to the default variation if available.
      setSelectedProduct(product);
    }
  }, [product]);

  const { imageIndex, isViewerVisible, openImageViewer, closeImageViewer } = useImageViewer();

  const galleryImages = useMemo(
    () => (selectedProduct?.images || []).map(img => ({ uri: img.src })),
    [selectedProduct?.images]
  );

  // Explicitly handle loading, error, and not-found states
  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <CustomText>Error loading product.</CustomText>;
  }

  // If the product is not found after loading, show a message.
  if (!product || !selectedProduct) {
    // We check selectedProduct here as well to ensure it's initialized before rendering
    return <Loader />; // Or a "not found" message
  }

  const categoryId = categoryIdFromParams ? Number(categoryIdFromParams) : product.categories[0]?.id;

  return (
    <PageView>
      <Stack.Screen options={{ title: selectedProduct.name }} />
      <PageHeader>
        <Breadcrumbs categoryId={categoryId} isLastClickable={true} />
      </PageHeader>
      <PageSection scrollable ref={scrollRef}>
        <ProductImage image={selectedProduct.images[0]} onPress={() => openImageViewer(0)} />
        <PageContent>
          <Row style={{ alignItems: "center", justifyContent: "space-between" }}>
            <Heading title={selectedProduct.name} size="md" />
            <CustomText fontSize="xxl" bold>
              {formatPrice(selectedProduct.price)}
            </CustomText>
          </Row>
          <ProductVariations
            product={product}
            onVariationChange={setSelectedProduct}
          />
          <CustomText fontSize="sm" >{selectedProduct.id + ' ' + selectedProduct.name}</CustomText>
          <CustomText fontSize="sm" >{product.short_description}</CustomText>
          <BuyProduct product={selectedProduct} />
        </PageContent>

        <PageContent title="Produktinformasjon" secondary>
          <ProductDetails product={product} />
        </PageContent>

        <PageContent title="Produktbilder" horizontal>
          <ProductImageGallery
            images={selectedProduct.images.slice(1)}
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
