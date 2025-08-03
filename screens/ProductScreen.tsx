import { CategoryChips } from '@/components/features/category/CategoryChips';
import { BuyButton } from '@/components/features/product/display/BuyButton';
import { PriceTag } from '@/components/features/product/display/PriceTag';
import { ProductStatus } from '@/components/features/product/display/ProductStatus';
import { ProductTitle } from '@/components/features/product/display/ProductTitle';
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
import { SizableText, XStack, YStack } from 'tamagui';

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
        <CategoryChips categories={product.categories} />
      </PageHeader>
      <ProductScreenContent />
    </PageView>
  )
}


const ProductScreenContent = () => {
  const { product } = useProductContext();

  return (
    <>
      <PageView >
        <PageSection scrollable>
          <ProductImage />
          <PageContent theme="light_soft">
            <XStack jc="space-between" gap="$3">
              <ProductTitle size="$6" />
              <PriceTag size="$6" />
            </XStack>

            <SizableText size="$3" mt="$3">{product.short_description}</SizableText>
            {product.hasVariations() && <ProductVariations />}
            <XStack jc="space-between" mt="$3">
              <ProductTitle size="$6" />
              <PriceTag fontSize="$6" />
            </XStack>
            <XStack flex={1} jc="flex-start">
              <ProductStatus />
            </XStack>
            <YStack mt="$3">
              <BuyButton />
            </YStack>
          </PageContent>
          <PageContent title="Produktbilder" flex={1}>
            {product.images.length > 1 && <ProductImageGallery />}
          </PageContent>
          <PageContent theme="secondary" title="Produktinformasjon">
            <SizableText size="$3">{product.description}</SizableText>
          </PageContent>
          <PageContent theme="primary" title="Relaterte produkter" scrollable>
            <ProductTiles queryResult={useProductsByIds(product.related_ids)} theme="secondary" />
          </PageContent>
        </PageSection>
      </PageView>

    </>
  );
};
