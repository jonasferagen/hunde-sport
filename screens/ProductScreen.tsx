import { ProductCategoryChips } from '@/components/features/product-category/ProductCategoryChips';
import { PriceTag } from '@/components/features/product/display/PriceTag';
import { ProductDescription } from '@/components/features/product/display/ProductDescription';
import { ProductPrice } from '@/components/features/product/display/ProductPrice';
import { ProductTitle } from '@/components/features/product/display/ProductTitle';
import { PurchaseButton } from '@/components/features/product/display/PurchaseButton';
import { ProductVariations } from '@/components/features/product/product-variation/ProductVariations';
import { ProductImage } from '@/components/features/product/ProductImage';
import { ProductImageGallery } from '@/components/features/product/ProductImageGallery';
import { PageContent, PageHeader, PageSection, PageView } from '@/components/layout';
import { Breadcrumbs } from '@/components/ui';
import { ProductLoader, useProductContext } from '@/contexts';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { XStack } from 'tamagui';

export const ProductScreen = () => {
  const { id, productCategoryId: productCategoryIdFromParams } = useLocalSearchParams<{ id: string; productCategoryId?: string }>();
  const productId = Number(id);
  const productCategoryId = productCategoryIdFromParams ? Number(productCategoryIdFromParams) : undefined;

  return (
    <ProductLoader id={productId} productCategoryId={productCategoryId}>
      <ProductScreenContent />
    </ProductLoader>
  );
};


const ProductScreenContent = () => {
  const { product } = useProductContext();

  return (
    <PageView>
      <PageHeader theme="soft">
        <Breadcrumbs isLastClickable={true} />
        <ProductCategoryChips showAll={true} />
      </PageHeader>
      <PageSection scrollable>
        <ProductImage />
        <PageContent theme="light" gap="$3">
          <XStack jc="space-between" gap="$3">
            <ProductTitle size="$6" product={product} />
            <PriceTag theme="tertiary" textProps={{ fos: '$6' }} product={product} />
          </XStack>
          <ProductDescription product={product} />
          <ProductVariations />
          <XStack jc="space-between">
            <ProductTitle size="$6" product={product} />
            <ProductPrice size="$6" product={product} />
          </XStack>
          <PurchaseButton />
        </PageContent>
        <PageContent title="Produktbilder" >
          {product.images.length > 1 && <ProductImageGallery />}
        </PageContent>
        <PageContent theme="secondary" title="Produktinformasjon">
          <ProductDescription short={false} product={product} />
        </PageContent>
      </PageSection>
    </PageView>
  );
};
