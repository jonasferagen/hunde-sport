import { ProductCategoryChips } from '@/components/features/product-category/ProductCategoryChips';
import { ProductDescription } from '@/components/features/product/display/ProductDescription';
import { ProductPrice } from '@/components/features/product/display/ProductPrice';
import { ProductTitle } from '@/components/features/product/display/ProductTitle';
import { PurchaseButton } from '@/components/features/product/display/PurchaseButton';
import { ProductVariationsButton } from '@/components/features/product/product-variation/ProductVariationsButton';
import { ProductImage } from '@/components/features/product/ProductImage';
import { ProductImageGallery } from '@/components/features/product/ProductImageGallery';
import { PageContent, PageHeader, PageSection, PageView } from '@/components/layout';
import { Breadcrumbs } from '@/components/ui';
import { BaseProductProvider, useBaseProductContext } from '@/contexts/BaseProductContext';
import { ProductCategoryProvider } from '@/contexts/ProductCategoryContext';
import { ProductVariationProvider } from '@/contexts/ProductVariationContext';
import { useProduct } from '@/hooks/data/Product';
import { PurchasableProduct, VariableProduct } from '@/types';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { XStack } from 'tamagui';
import { LoadingScreen } from './misc/LoadingScreen';
import { NotFoundScreen } from './misc/NotFoundScreen';

export const ProductScreen = () => {
  const { id, productCategoryId: productCategoryIdFromParams } = useLocalSearchParams<{ id: string; productCategoryId?: string }>();
  const productId = Number(id);
  const productCategoryId = productCategoryIdFromParams ? Number(productCategoryIdFromParams) : undefined;

  const { data: product, isLoading } = useProduct(productId);

  if (isLoading) {
    return <LoadingScreen />;
  }
  if (!product) {
    return <NotFoundScreen message="Beklager, produktet ble ikke funnet" />;
  }
  const purchasableProduct = product as PurchasableProduct;

  return (
    <ProductCategoryProvider productCategoryId={productCategoryId} productCategories={product.categories} >
      <BaseProductProvider product={purchasableProduct}>
        <ProductVariationProvider product={product as VariableProduct}>
          <ProductScreenContent />
        </ProductVariationProvider>
      </BaseProductProvider>
    </ProductCategoryProvider>
  );
};


const ProductScreenContent = () => {
  const { product } = useBaseProductContext();
  return (
    <PageView>
      <PageHeader theme="soft">
        <Breadcrumbs isLastClickable={true} />
        <ProductCategoryChips showAll={true} />
      </PageHeader>
      <PageSection scrollable>
        <ProductImage />
        <PageContent theme="light" gap="$3">
          <XStack jc="space-between">
            <ProductTitle size="$6" />
            <ProductPrice size="$6" />
          </XStack>
          {product.type === "variable" ? <ProductVariationsButton /> : <PurchaseButton />}
        </PageContent>
        <PageContent title="Produktbilder" >
          {product.images.length > 1 && <ProductImageGallery />}
        </PageContent>
        <PageContent theme="secondary" title="Produktinformasjon">
          <ProductDescription short={false} />
        </PageContent>
      </PageSection>
    </PageView>
  );
};

