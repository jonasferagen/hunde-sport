import { CategoryChips } from '@/components/features/category/CategoryChips';
import { AttributeDisplay } from '@/components/features/product/AttributeDisplay';
import { RelatedProducts } from '@/components/features/product/RelatedProducts';
import { VariationSelector } from '@/components/features/product/VariationSelector';
import { PageContent, PageSection, PageView, VerticalStack } from '@/components/layout';
import { Breadcrumbs, Button, CustomText } from '@/components/ui';
import { Loader } from '@/components/ui/loader/Loader';
import { useShoppingCart, useTheme } from '@/hooks';
import { useProduct, useProductVariations } from '@/hooks/Product';
import { BORDER_RADIUS, SPACING } from '@/styles';
import { Theme } from '@/styles/Theme';
import { Product } from '@/types';
import { formatPrice } from '@/utils/helpers';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import ImageViewing from 'react-native-image-viewing';

export const ProductScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageViewerVisible, setImageViewerVisible] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const { data: product, isLoading, error } = useProduct(Number(id));
  const { addToCart } = useShoppingCart();


  const variationQueries = useProductVariations(product?.variations || []);
  const variations = useMemo(() => variationQueries.map(query => query.data).filter(Boolean) as Product[], [variationQueries]);

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

  const displayProduct = useMemo(() => selectedVariation || product, [selectedVariation, product]);

  if (isLoading) {
    return <Loader />;
  }

  if (error || !product || !displayProduct) {
    return <Loader />;
  }

  const mainImage = displayProduct.images[0];
  const allImages = displayProduct.images.map(img => ({ uri: img.src }));

  const openImageViewer = (index: number) => {
    setCurrentImageIndex(index);
    setImageViewerVisible(true);
  };

  return (
    <PageView>
      <PageContent>
        <PageSection primary>
          <VerticalStack spacing="md">
            <Breadcrumbs product={displayProduct} />
          </VerticalStack>
        </PageSection>
      </PageContent>
      <PageContent scrollable>
        <PageSection secondary>
          <VerticalStack spacing="md">
            <View style={styles.mainImageWrapper}>
              <TouchableOpacity onPress={() => openImageViewer(0)}>
                <Image
                  source={{ uri: mainImage.src }}
                  style={styles.mainImage}
                />
              </TouchableOpacity>
            </View>
            <CustomText size='xxl' bold>{formatPrice(displayProduct.price)}</CustomText>
            {product.attributes.filter(attr => attr.variation).map(attribute => {
              return (
                < VariationSelector
                  key={attribute.id}
                  attribute={attribute}
                  selectedOption={selectedOptions[attribute.slug] || null}
                  onSelectOption={(option) => handleSelectOption(attribute.slug, option)}
                />
              )
            })}
            <CustomText size='sm'>{product.short_description}</CustomText>
            <Button variant="primary" title="Legg til i handlekurv" onPress={() => addToCart(displayProduct)} />
          </VerticalStack>
        </PageSection>

        <PageSection primary>
          <VerticalStack spacing="md">
            <CustomText>{product.description}</CustomText>
            {product.attributes.filter(attr => !attr.variation).map(attribute => (
              <AttributeDisplay key={attribute.id} attribute={attribute} />
            ))}
            <CategoryChips categories={product.categories} />
          </VerticalStack>
        </PageSection>

        <PageSection secondary>
          <View style={styles.imageGalleryContainer}>
            {product.images.map((image, index) => (
              <View key={'imageGalleryItem-' + index} style={styles.imageThumbnailWrapper}>
                <TouchableOpacity onPress={() => openImageViewer(index)}>
                  <Image
                    source={{ uri: image.src }}
                    style={styles.imageThumbnail}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </PageSection>
        <PageSection accent>
          <RelatedProducts productIds={product.related_ids} />
        </PageSection>
      </PageContent>
      <ImageViewing
        images={allImages}
        imageIndex={currentImageIndex}
        visible={isImageViewerVisible}
        onRequestClose={() => { setImageViewerVisible(false) }}
        animationType='slide'
      />
    </PageView >
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  content: {
    padding: SPACING.md,
  },
  mainImageWrapper: {
    width: '100%',
    height: 300,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.gradients.primary[0],
    borderRadius: BORDER_RADIUS.md,
  },
  mainImage: {
    height: '100%',
  },


  imageGalleryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: SPACING.md,
  },
  imageThumbnailWrapper: {
    width: '31%', // Creates a 3-column grid with spacing
    margin: '1%',
    height: 120,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden', // Ensures the image respects the border radius
  },
  imageThumbnail: {
    height: '100%',
    width: '100%',
  },
});