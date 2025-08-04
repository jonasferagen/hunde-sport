import { ProductCategoryChips } from '@/components/features/product-category/ProductCategoryChips';
import { PriceTag } from '@/components/features/product/display/PriceTag';
import { ProductTitle } from '@/components/features/product/display/ProductTitle';
import { PurchaseButton } from '@/components/features/product/display/PurchaseButton';
import { ProductImage } from '@/components/features/product/ProductImage';
import { ProductImageGallery } from '@/components/features/product/ProductImageGallery';
import { RelatedProducts } from '@/components/features/product/ProductTiles';
import { ProductVariations } from '@/components/features/product/variation/ProductVariations';
import { PageContent, PageHeader, PageSection, PageView } from '@/components/layout';
import { Breadcrumbs } from '@/components/ui';
import { ProductCategoryProvider, ProductProvider, useProductContext } from '@/contexts';
import { useProduct } from '@/hooks/data/Product';
import { createProduct } from '@/models/Product/ProductFactory';
import { LoadingScreen } from '@/screens/misc/LoadingScreen';
import { NotFoundScreen } from '@/screens/misc/NotFoundScreen';
import { SimpleProduct, VariableProduct } from '@/types';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { SizableText, XStack } from 'tamagui';

export const ProductScreen = () => {
  const { id, categoryId: categoryIdFromParams } = useLocalSearchParams<{ id: string; categoryId?: string }>();
  const productId = Number(id);
  const { data: product, isLoading: isProductLoading } = useProduct(productId);

  if (isProductLoading) {
    return <LoadingScreen />;
  }

  if (!product) {
    return <NotFoundScreen message="Beklager, produktet ble ikke funnet" />;
  }

  const productInstance = createProduct(product);
  const categoryId = categoryIdFromParams ? Number(categoryIdFromParams) : undefined;

  return (
    <ProductCategoryProvider productCategoryId={categoryId} productCategories={productInstance.categories}>
      <ProductScreenContentWrapper product={productInstance} />
    </ProductCategoryProvider>
  );
};

const ProductScreenContentWrapper = ({ product }: { product: SimpleProduct | VariableProduct }) => {
  return (
    <ProductProvider product={product}>
      <PageView>
        <PageHeader theme="secondary_soft">
          <Breadcrumbs isLastClickable={true} />
          <ProductCategoryChips showAll={true} />
        </PageHeader>
        <ProductScreenContent />
      </PageView>
    </ProductProvider>
  )
}

const ProductScreenContent = () => {
  const { product } = useProductContext();

  return (
    <>
      <PageView >
        <PageSection scrollable>
          <ProductImage />
          <PageContent theme="light_soft" gap="$3">
            <XStack jc="space-between" gap="$3">
              <ProductTitle size="$6" />
              <PriceTag fos="$6" />
            </XStack>
            <SizableText size="$3">{product.short_description}</SizableText>
            {product.hasVariations() && <ProductVariations />}
            <XStack jc="space-between">
              <ProductTitle size="$6" />
              <PriceTag fos="$6" boc="black" bw={1} />
            </XStack>
            <PurchaseButton />
          </PageContent>
          <PageContent title="Produktbilder" flex={1}>
            {product.images.length > 1 && <ProductImageGallery />}
          </PageContent>
          <PageContent theme="secondary" title="Produktinformasjon">
            <SizableText size="$3">{product.description}</SizableText>
          </PageContent>
          <PageContent px="none" theme="primary" title="Relaterte produkter" scrollable>
            <RelatedProducts product={product} theme="secondary" />
          </PageContent>
        </PageSection>
      </PageView>

    </>
  );
};
