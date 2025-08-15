import { BreadCrumbsContainer } from '@/components/features/product-category/breadcrumbs/BreadCrumbsContainer';
import { ProductDescription, ProductImage, ProductImageGallery, ProductPrice, ProductTitle } from '@/components/features/product/display/';
import { ProductPurchaseFlow } from '@/components/features/product/purchase/ProductPurchaseFlow';
import { PageBody, PageFooter, PageHeader, PageSection, PageView } from '@/components/layout';
import { ThemedXStack } from '@/components/ui';
import { ProductCategoryProvider } from '@/contexts/ProductCategoryContext';
import { PurchasableProviderInit, usePurchasableContext } from '@/contexts/PurchasableContext';
import { useProduct } from '@/hooks/data/Product';
import { PurchasableProduct } from '@/types';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
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
      <PurchasableProviderInit product={purchasableProduct}>
        <ProductScreenContent />
      </PurchasableProviderInit>
    </ProductCategoryProvider>
  );
};


const ProductScreenContent = () => {
  const { purchasable } = usePurchasableContext();
  const { product } = purchasable;


  return (
    <PageView>
      <PageHeader>
        <BreadCrumbsContainer />
      </PageHeader>
      <PageBody>
        <PageSection>
          <ProductTitle fos="$7" />
          <ProductImage />
        </PageSection>
        <PageSection title="Produktinformasjon" theme="secondary">
          <ProductDescription long />
        </PageSection>

        <PageSection title="Produktbilder">
          {product.images.length > 1 && <ProductImageGallery />}
        </PageSection>
      </PageBody>
      <PageFooter>
        <ThemedXStack split>
          <ProductTitle fs={1} />
          <ProductPrice size="$5" />
        </ThemedXStack>
        <ProductPurchaseFlow />
      </PageFooter>
    </PageView >
  );
};

