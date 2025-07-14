import { CategoryChips } from '@/components/features/category/CategoryChips';
import { AttributeDisplay } from '@/components/features/product/AttributeDisplay';
import { VariationSelector } from '@/components/features/product/VariationSelector';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { Button, Heading } from '@/components/ui';
import { useProduct, useProductVariations } from '@/hooks/Product/Product';
import { useShoppingCart } from '@/hooks/ShoppingCart/ShoppingCartProvider';
import { formatPrice } from '@/utils/helpers';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ImageViewing from 'react-native-image-viewing';

import { Loader } from '@/components/ui/Loader';
import { BORDER_RADIUS, SPACING } from '@/styles/Dimensions';
import { FONT_SIZES } from '@/styles/Typography';
import { Product } from '@/types';

export const ProductScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

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
      <Stack.Screen options={{ title: displayProduct.name }} />

      <PageContent scrollable>
        <PageSection primary>
          <Heading title={displayProduct.name} size="xxl" style={styles.heading} />

          <View style={styles.mainImageWrapper}>
            <TouchableOpacity onPress={() => openImageViewer(0)}>
              <Image
                source={{ uri: mainImage.src }}
                style={styles.mainImage}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.price}>{formatPrice(displayProduct.price)}</Text>
          <View style={styles.productInfoContainer}>
            {product.attributes.filter(attr => attr.variation).map(attribute => (
              <VariationSelector
                key={attribute.id}
                attribute={attribute}
                selectedOption={selectedOptions[attribute.slug] || null}
                onSelectOption={(option) => handleSelectOption(attribute.slug, option)}
              />
            ))}

            <Text style={styles.shortDescription}>{displayProduct.short_description}</Text>

            <Button title="Legg til i handlekurv" onPress={() => addToCart(displayProduct)} />
          </View>
        </PageSection>

        <PageSection primary>
          <Text style={styles.description}>{product.description}</Text>
          <View style={styles.attributeContainer}>
            {product.attributes.filter(attr => !attr.variation).map(attribute => (
              <AttributeDisplay key={attribute.id} attribute={attribute} />
            ))}
          </View>
          <CategoryChips categories={product.categories} />
        </PageSection>

        <PageSection>
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

      </PageContent>
      <ImageViewing
        images={allImages}
        imageIndex={currentImageIndex}
        visible={isImageViewerVisible}
        onRequestClose={() => { setImageViewerVisible(false) }}
        animationType='slide'
      />
    </PageView>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: SPACING.md,
  },
  attributeContainer: {
    marginVertical: SPACING.md,
  },
  productInfoContainer: {
    paddingVertical: 0,
  },
  heading: {
    marginBottom: SPACING.md,
  },

  mainImageWrapper: {
    width: '100%',
    height: 300,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: BORDER_RADIUS.md,
  },
  mainImage: {
    height: '100%',
  },
  price: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
  },
  description: {
    fontSize: FONT_SIZES.sm,
    lineHeight: FONT_SIZES.lg,
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  shortDescription: {
    fontSize: FONT_SIZES.md,
    lineHeight: FONT_SIZES.xl,
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
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
    borderColor: '#eee',
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden', // Ensures the image respects the border radius
  },
  imageThumbnail: {
    height: '100%',
    width: '100%',
  },
});