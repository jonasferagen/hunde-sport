import { CategoryChips } from '@/components/features/category/CategoryChips';
import { BuyProduct } from '@/components/features/product/BuyProduct';
import { ProductImage } from '@/components/features/product/image/ProductImage';
import { ProductImageGallery } from '@/components/features/product/image/ProductImageGallery';
import { ProductTiles } from '@/components/features/product/ProductTiles';
import { PageContent, PageHeader, PageSection, PageView } from '@/components/layout';
import { Breadcrumbs, CustomText } from '@/components/ui';
import { ProductImageProvider, ProductProvider, useProductContext } from '@/contexts';
import { useProduct, useProductsByIds } from '@/hooks/data/Product';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { SizableText, Spinner } from 'tamagui';

export const ProductScreen = () => {
  const { id, categoryId: categoryIdFromParams } = useLocalSearchParams<{ id: string; categoryId?: string }>();
  const { data: product, isLoading } = useProduct(Number(id));

  const categoryId = categoryIdFromParams ? Number(categoryIdFromParams) : product?.categories[0]?.id;

  if (isLoading) {
    return <Spinner size="large" />;
  }

  if (!product) {
    return <SizableText>Produktet ble ikke funnet.</SizableText>;
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

const ProductScreenContent = () => {
  const { product } = useProductContext();

  return (
    <ProductImageProvider>
      <PageSection scrollable>
        <ProductImage />
        <PageContent>
          <BuyProduct />
        </PageContent>
        <PageContent title="Flere bilder">
          <ProductImageGallery />
        </PageContent>
        <PageContent primary title="Relaterte produkter">
          <ProductTiles queryResult={useProductsByIds(product.related_ids)} themeVariant="secondary" />
        </PageContent>
        <PageContent title="Produktinformasjon" secondary>
          <CustomText fontSize="sm">{product.description || 'Ingen beskrivelse tilgjengelig'}</CustomText>
        </PageContent>

        <PageContent title="Kategorier">
          <CategoryChips categories={product.categories} />
        </PageContent>
      </PageSection>
    </ProductImageProvider>
  );
};
