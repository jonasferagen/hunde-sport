import { CategoryChips } from '@/components/features/category';
import {
  BuyProduct,
  ProductImageManager,
  ProductTiles
} from '@/components/features/product/';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumbs, CustomText, Loader } from '@/components/ui';
import { ProductProvider, useProductContext } from '@/contexts/ProductContext';
import { useProduct, useProductsByIds } from '@/hooks/data/Product';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';


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

const ProductScreenContent = () => {
  const { product } = useProductContext();

  return (
    <PageSection scrollable>
      <PageContent>
        <ProductImageManager />
        <BuyProduct />
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
  );
};
