import { CategoryChips } from '@/components/features/category';
import {
  BuyProduct,
  ProductDetails,
  ProductImage,
  ProductImageGallery,
  ProductTiles
} from '@/components/features/product/';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumbs, CustomText, Loader } from '@/components/ui';
import { ProductProvider, useProductContext } from '@/contexts/ProductContext';
import { useProduct } from '@/hooks/Product';
import { useImageViewer } from '@/hooks/useImageViewer';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import ImageViewing from 'react-native-image-viewing';

const ProductScreenContent = () => {
  const { productVariant, product } = useProductContext();
  const { imageIndex, isViewerVisible, openImageViewer, closeImageViewer } = useImageViewer();

  const galleryImages = useMemo(
    () => (product?.images || []).map((img) => ({ uri: img.src })),
    [product?.images]
  );

  const activeProduct = productVariant || product;

  if (!activeProduct) return null;

  return (
    <>

      <PageSection scrollable>
        <PageContent>
          <ProductImage image={activeProduct.image} onPress={() => openImageViewer(0)} />
          <BuyProduct product={product} displayProduct={activeProduct} />
        </PageContent>

        <PageContent title="Produktinformasjon" secondary>
          <ProductDetails product={product} />
        </PageContent>

        <PageContent title="Flere bilder" horizontal>
          <ProductImageGallery
            images={product.images.slice(1)}
            onImagePress={(index) => openImageViewer(index + 1)}
          />
        </PageContent>

        <PageContent title="Kategorier">
          <CategoryChips categories={product.categories} />
        </PageContent>

        <PageContent primary horizontal title="Relaterte produkter" >
          <ProductTiles type="related" themeVariant="secondary" />
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
