import { CategoryChips } from '@/components/features/category';
import {
  BuyProduct,
  ProductDetails,
  ProductImage,
  ProductImageGallery,
  ProductVariations,
  RelatedProducts,
} from '@/components/features/product/';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumbs, CustomText, Heading, Loader } from '@/components/ui';
import { Row } from '@/components/ui/layout';
import { ProductProvider, useProductContext } from '@/contexts/ProductContext';
import { useProduct } from '@/hooks/Product';
import { useImageViewer } from '@/hooks/useImageViewer';
import { formatPrice } from '@/utils/helpers';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import ImageViewing from 'react-native-image-viewing';

const ProductScreenContent = () => {
  const { displayProduct, product } = useProductContext();
  const { imageIndex, isViewerVisible, openImageViewer, closeImageViewer } = useImageViewer();

  const galleryImages = useMemo(
    () => (product?.images || []).map((img) => ({ uri: img.src })),
    [product?.images]
  );

  if (!displayProduct || !product) return null;

  return (
    <>
      <PageSection scrollable>
        <PageContent>
          <ProductImage image={displayProduct.images[0]} onPress={() => openImageViewer(0)} />
          <Row style={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Heading title={displayProduct.name} size="md" />
            <CustomText fontSize="xxl" bold>
              {formatPrice(displayProduct.price)}
            </CustomText>
          </Row>
          <ProductVariations displayAs="chips" />
          <CustomText fontSize="sm">{product.short_description}</CustomText>
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
      <ImageViewing
        images={galleryImages}
        imageIndex={imageIndex}
        visible={isViewerVisible}
        onRequestClose={closeImageViewer}
        animationType="slide"
      />
    </>
  );
};

export const ProductScreen = () => {
  const { id, categoryId: categoryIdFromParams } = useLocalSearchParams<{ id: string; categoryId?: string }>();
  const { data: product, isLoading } = useProduct(Number(id));

  const categoryId = categoryIdFromParams ? Number(categoryIdFromParams) : product?.categories[0]?.id;

  if (isLoading) {
    return <Loader flex size="large" />;
  }

  if (!product) {
    return <CustomText>Produktet ble ikke funnet.</CustomText>;
  }

  return (
    <ProductProvider product={product}>
      <PageView>
        <Stack.Screen options={{ title: product.name }} />
        <PageHeader>{categoryId && <Breadcrumbs categoryId={categoryId} isLastClickable />}</PageHeader>
        <ProductScreenContent />
      </PageView>
    </ProductProvider>
  );
};
