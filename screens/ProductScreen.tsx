import { CategoryChips } from '@/components/features/category/CategoryChips';
import { BuyProduct } from '@/components/features/product/BuyProduct';
import { ProductImage } from '@/components/features/product/image/ProductImage';
import { ProductImageGallery } from '@/components/features/product/image/ProductImageGallery';
import { ProductTiles } from '@/components/features/product/ProductTiles';
import { PageContent, PageHeader, PageSection, PageView } from '@/components/layout';
import { Breadcrumbs } from '@/components/ui';
import { ProductProvider, useProductContext } from '@/contexts';
import { useProduct, useProductsByIds } from '@/hooks/data/Product';
import { LoadingScreen } from '@/screens/misc/LoadingScreen';
import { NotFoundScreen } from '@/screens/misc/NotFoundScreen';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { SizableText } from 'tamagui';

export const ProductScreen = () => {
  const { id, categoryId: categoryIdFromParams } = useLocalSearchParams<{ id: string; categoryId?: string }>();
  const productId = Number(id);
  const { data: product, isLoading } = useProduct(productId);

  const categoryId = categoryIdFromParams ? Number(categoryIdFromParams) : product?.categories[0]?.id;

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!product) {
    return <NotFoundScreen message="Beklager, dette produktet ble ikke funnet" />;
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
    <>
      <PageSection scrollable>
        <ProductImage />
        <PageContent>
          <BuyProduct />
        </PageContent>
        <PageContent title="Produktbilder" style={{ flex: 1 }}>
          <ProductImageGallery />
        </PageContent>
        <PageContent theme="primary" title="Relaterte produkter">
          <ProductTiles queryResult={useProductsByIds(product.related_ids)} theme="secondary" />
        </PageContent>
        <PageContent theme="secondary" title="Produktinformasjon">
          <SizableText size="$3">{product.description || 'Ingen beskrivelse tilgjengelig'}</SizableText>
        </PageContent>
        <PageContent title="Kategorier">
          <CategoryChips categories={product.categories} />
        </PageContent>
      </PageSection>
    </>
  );
};
