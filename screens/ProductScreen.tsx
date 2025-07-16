import { ProductDetails } from '@/components/features/product/ProductDetails';
import { ProductHeader } from '@/components/features/product/ProductHeader';
import { ProductImage } from '@/components/features/product/ProductImage';
import { ProductImageGallery } from '@/components/features/product/ProductImageGallery';
import { RelatedProducts } from '@/components/features/product/RelatedProducts';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { Breadcrumbs, CustomText } from '@/components/ui';
import { Loader } from '@/components/ui/loader/Loader';
import { useProduct, useProducts } from '@/hooks/Product';
import { Product } from '@/types';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';

export const ProductScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageViewerVisible, setImageViewerVisible] = useState(false);

  const { data: product, isLoading, error } = useProduct(Number(id));

  const { products: variations } = useProducts(product?.variations || []);

  const [selectedVariation, setSelectedVariation] = useState<Product | null>(null);

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

  if (isLoading) {
    return <Loader />;
  }

  if (error || !product || !displayProduct) {
    return <Loader />;
  }

  console.log("product screen loading");

  return (
    <PageView>
      <Stack.Screen options={{ title: displayProduct.name }} />
      <PageSection>
        <PageContent>
          <Breadcrumbs product={displayProduct} />
        </PageContent>
      </PageSection>
      <PageSection scrollable>
        <PageContent>

          <ProductImage image={displayProduct.images[0]} onPress={() => openImageViewer(0)} />
          <ProductHeader
            product={product}
            displayProduct={displayProduct}
            selectedOptions={selectedOptions}
            onSelectOption={handleSelectOption}
          />
          <CustomText bold>Bilder</CustomText>

          <ProductImageGallery
            images={displayProduct.images}
            onImagePress={openImageViewer}
            isImageViewerVisible={isImageViewerVisible}
            closeImageViewer={closeImageViewer}
            currentImageIndex={currentImageIndex}
          />
        </PageContent>

        <PageContent>
          <ProductDetails product={product} />
        </PageContent>

        <PageContent>
          <RelatedProducts productIds={product.related_ids} />
        </PageContent>
      </PageSection>
    </PageView >
  );
};
