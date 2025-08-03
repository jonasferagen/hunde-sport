import { CategoryChips } from '@/components/features/category/CategoryChips';
import { PriceTag } from '@/components/features/product/display/PriceTag';
import { ProductTitle } from '@/components/features/product/display/ProductTitle';
import { PurchaseButton } from '@/components/features/product/display/PurchaseButton';
import { ProductImage } from '@/components/features/product/ProductImage';
import { ProductImageGallery } from '@/components/features/product/ProductImageGallery';
import { ProductTiles } from '@/components/features/product/ProductTiles';
import { ProductVariations } from '@/components/features/product/variation/ProductVariations';
import { PageContent, PageHeader, PageSection, PageView } from '@/components/layout';
import { Breadcrumbs } from '@/components/ui';
import { CategoryProvider, ProductProvider, useProductContext } from '@/contexts';
import { useProduct, useProductsByIds } from '@/hooks/data/Product';
import { LoadingScreen } from '@/screens/misc/LoadingScreen';
import { NotFoundScreen } from '@/screens/misc/NotFoundScreen';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { SizableText, XStack } from 'tamagui';

export const ProductScreen = () => {

  const { id, categoryId: categoryIdFromParams } = useLocalSearchParams<{ id: string; categoryId?: string }>();
  const productId = Number(id);
  const { data: product, isLoading } = useProduct(productId);


  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!product) {
    return <NotFoundScreen message="Beklager, produktet ble ikke funnet" />;
  }

  const content = (
    <ProductProvider product={product}>
      <ProductScreenContentWrapper categoryIdFromParams={categoryIdFromParams} />
    </ProductProvider>
  );

  if (categoryIdFromParams) {
    return (
      <CategoryProvider categoryId={Number(categoryIdFromParams)}>
        {content}
      </CategoryProvider>
    );
  }

  return content;
};

const ProductScreenContentWrapper = ({ categoryIdFromParams }: { categoryIdFromParams?: string }) => {
  const { product } = useProductContext();
  return (
    <PageView>
      <PageHeader theme="secondary_soft">
        {categoryIdFromParams && <Breadcrumbs isLastClickable={true} />}
        <CategoryChips categories={product.categories} showAll={true} />
      </PageHeader>
      <ProductScreenContent />
    </PageView>
  )
}


const ProductScreenContent = () => {
  const { product, productVariation } = useProductContext();

  return (
    <>
      <PageView >
        <PageSection scrollable>
          <ProductImage />
          <PageContent theme="light_soft" gap="$3">
            <XStack jc="space-between" gap="$3">
              <ProductTitle size="$6" />
              <PriceTag size="$6" />
            </XStack>
            <SizableText size="$3">{product.short_description}</SizableText>
            {product.hasVariations() && productVariation && <ProductVariations />}
            <XStack jc="space-between">
              <ProductTitle size="$6" />
              <PriceTag fontSize="$6" />
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
            <ProductTiles queryResult={useProductsByIds(product.related_ids)} theme="secondary" />
          </PageContent>
        </PageSection>
      </PageView>

    </>
  );
};
