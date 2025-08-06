import { ProductCategoryChips } from '@/components/features/product-category/ProductCategoryChips';
import { PriceTag } from '@/components/features/product/display/PriceTag';
import { ProductTitle } from '@/components/features/product/display/ProductTitle';
import { PurchaseButton } from '@/components/features/product/display/PurchaseButton';
import { ProductImage } from '@/components/features/product/ProductImage';
import { ProductImageGallery } from '@/components/features/product/ProductImageGallery';
import { ProductVariations } from '@/components/features/product/variation/ProductVariations';
import { PageContent, PageHeader, PageSection, PageView } from '@/components/layout';
import { Breadcrumbs } from '@/components/ui';
import { ProductCategoryProvider, ProductProvider, useProductContext } from '@/contexts';
import { useProduct } from '@/hooks/data/Product';
import { LoadingScreen } from '@/screens/misc/LoadingScreen';
import { NotFoundScreen } from '@/screens/misc/NotFoundScreen';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { SizableText, XStack } from 'tamagui';

export const ProductScreen = () => {
  const { id, categoryId: categoryIdFromParams } = useLocalSearchParams<{ id: string; categoryId?: string }>();

  const categoryId = categoryIdFromParams ? Number(categoryIdFromParams) : undefined;
  const productId = Number(id);
  const { data: product, isLoading: isProductLoading } = useProduct(productId);

  if (isProductLoading) {
    return <LoadingScreen />;
  }

  if (!product) {
    return <NotFoundScreen message="Beklager, produktet ble ikke funnet" />;
  }


  return (
    <ProductCategoryProvider productCategoryId={categoryId} productCategories={product.categories}>
      <ProductProvider product={product}>
        <ProductScreenContent />
      </ProductProvider>
    </ProductCategoryProvider>
  );
};



const ProductScreenContent = () => {
  const { product } = useProductContext();

  return (
    <PageView>
      <PageHeader theme="secondary_soft">
        <Breadcrumbs isLastClickable={true} />
        <ProductCategoryChips showAll={true} />
      </PageHeader>
      <PageSection scrollable>
        <ProductImage />
        <PageContent theme="light_soft" gap="$3">
          <XStack jc="space-between" gap="$3">
            <ProductTitle size="$6" />
            <PriceTag fos="$6" />
          </XStack>
          <SizableText size="$3">{product.short_description}</SizableText>
          <ProductVariations />
          <XStack jc="space-between">
            <ProductTitle size="$6" />
            <PriceTag fos="$6" />
          </XStack>
          <PurchaseButton />
        </PageContent>
        <PageContent title="Produktbilder" flex={1}>
          <ProductImageGallery />
        </PageContent>
        <PageContent theme="secondary" title="Produktinformasjon">
          <SizableText size="$3">{product.description}</SizableText>
        </PageContent>
      </PageSection>
    </PageView>
  );
};
