import { CategoryChips } from '@/components/features/category/CategoryChips';
import { ProductDetails } from '@/components/features/product/ProductDetails';
import { ProductHeader } from '@/components/features/product/ProductHeader';
import { ProductImage } from '@/components/features/product/ProductImage';
import { ProductImageGallery } from '@/components/features/product/ProductImageGallery';
import { RelatedProducts } from '@/components/features/product/RelatedProducts';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumbs, CustomText, Loader } from '@/components/ui';
import { useBreadcrumbs } from '@/contexts';
import { useProduct, useProducts } from '@/hooks/Product';
import { Product } from '@/types';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView } from 'react-native';

export const ProductScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const scrollRef = useRef<ScrollView>(null);

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageViewerVisible, setImageViewerVisible] = useState(false);

  const { data: product, isLoading, error } = useProduct(Number(id));

  const { products: variations } = useProducts(product?.variations || []);

  const { build } = useBreadcrumbs();

  const [selectedVariation, setSelectedVariation] = useState<Product | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [id]);

  useEffect(() => {
    if (product?.categories?.[0]) {
      build(product.categories[0].id);
    }
  }, [product, build]);

  useEffect(() => {
    const allOptionsSelected = product?.attributes
      .filter(attr => attr.variation)
      .every(attr => selectedOptions[attr.slug]);

    if (allOptionsSelected) {
      const foundVariation = variations.find(variation =>
        variation.attributes.every(attr => selectedOptions[attr.slug] === attr.option)
      );
      setSelectedVariation(foundVariation || null);
    } else {
      setSelectedVariation(null);
    }
  }, [selectedOptions, variations, product?.attributes]);

  const handleSelectOption = (attributeSlug: string, option: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [attributeSlug]: option,
    }));
  };

  const openImageViewer = (index: number) => {
    setCurrentImageIndex(index);
    setImageViewerVisible(true);
  };

  const closeImageViewer = () => {
    setImageViewerVisible(false);
  };

  const displayProduct = selectedVariation || product;

  if (isLoading || error || !product || !displayProduct) {
    return <Loader size="large" flex />;
  }

  return (
    <PageView>
      <Stack.Screen options={{ title: displayProduct.name }} />
      <PageHeader>
        <Breadcrumbs />
        <CustomText bold>{displayProduct.name}</CustomText>
      </PageHeader>
      <PageSection scrollable ref={scrollRef}>
        <PageContent>

          <ProductImage image={displayProduct.images[0]} onPress={() => openImageViewer(0)} />
          <ProductHeader
            product={product}
            displayProduct={displayProduct}
            selectedOptions={selectedOptions}
            onSelectOption={handleSelectOption}
          />

        </PageContent>

        <PageContent horizontal secondary title="Bilder">

          <ProductImageGallery
            images={displayProduct.images}
            onImagePress={openImageViewer}
            isImageViewerVisible={isImageViewerVisible}
            closeImageViewer={closeImageViewer}
            currentImageIndex={currentImageIndex}
          />
        </PageContent>

        <PageContent title="Produktinformasjon">
          <ProductDetails product={product} />
        </PageContent>

        <PageContent title="Kategorier">
          <CategoryChips categories={product.categories} />
        </PageContent>

        <PageContent horizontal accent title="Relaterte produkter" >
          <RelatedProducts productIds={product.related_ids} />
        </PageContent>
      </PageSection>
    </PageView >
  );
};
