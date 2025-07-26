import { CategoryChips } from '@/components/features/category/CategoryChips';
import { PriceTag } from '@/components/features/product/display/PriceTag';
import { ProductStatus } from '@/components/features/product/display/ProductStatus';
import { ProductTitle } from '@/components/features/product/display/ProductTitle';
import { ProductImage } from '@/components/features/product/ProductImage';
import { ProductImageGallery } from '@/components/features/product/ProductImageGallery';
import { ProductTiles } from '@/components/features/product/ProductTiles';
import { ProductVariations } from '@/components/features/product/variation/ProductVariations';
import { PageContent, PageHeader, PageSection, PageView } from '@/components/layout';
import { Breadcrumbs } from '@/components/ui';
import { ProductProvider, useProductContext, useShoppingCartContext } from '@/contexts';
import { useProduct, useProductsByIds } from '@/hooks/data/Product';
import { LoadingScreen } from '@/screens/misc/LoadingScreen';
import { NotFoundScreen } from '@/screens/misc/NotFoundScreen';
import { ShoppingCart } from '@tamagui/lucide-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Button, SizableText, XStack } from 'tamagui';


export const ProductScreen = () => {
  const { id, categoryId: categoryIdFromParams } = useLocalSearchParams<{ id: string; categoryId?: string }>();
  const productId = Number(id);
  const { data: product, isLoading } = useProduct(productId);

  const categoryId = categoryIdFromParams ? Number(categoryIdFromParams) : product?.categories[0]?.id;

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!product) {
    return <NotFoundScreen message="Beklager, produktet ble ikke funnet" />;
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
  const { product, productVariation } = useProductContext();
  const { increaseQuantity, purchaseInfo } = useShoppingCartContext();
  const { status, msg } = purchaseInfo(productVariation || product);
  return (
    <>
      <PageSection scrollable>
        <ProductImage />
        <PageContent>
          <XStack ai="center" jc="space-between" mb="$3">
            <ProductTitle />
            <PriceTag fontSize="$6" />
          </XStack>
          {product.type === 'variable' && <ProductVariations />}
          <SizableText size="$3">{product.short_description}</SizableText>
          <ProductStatus />
          <Button
            icon={<ShoppingCart />}
            onPress={() => increaseQuantity(product, productVariation || undefined)}
            disabled={status !== 'ok'}
          >
            {msg}
          </Button>
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
