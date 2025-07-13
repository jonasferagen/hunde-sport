import { PageContent, PageSection, PageView } from '@/components/layout';
import { Heading } from '@/components/ui';
import { useProduct } from '@/hooks/Product/Product';
import { formatPrice } from '@/utils/helpers';
import { Image } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ImageViewing from 'react-native-image-viewing';

import Loader from '@/components/ui/Loader';
import { COLORS } from '@/styles/Colors';
import { BORDER_RADIUS, SPACING } from '@/styles/Dimensions';
import { FONT_SIZES } from '@/styles/Typography';


export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string; name: string }>();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageViewerVisible, setImageViewerVisible] = useState(false);

  const { data, isLoading, error } = useProduct(Number(id));

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <Loader />;
  }

  const product = data!;


  const mainImage = product.images[0];
  const allImages = product.images.map(img => ({ uri: img.src }));

  const openImageViewer = (index: number) => {
    setCurrentImageIndex(index);
    setImageViewerVisible(true);
  };

  return (
    <PageView>
      <Stack.Screen options={{ title: product.name }} />

      <PageContent scrollable>
        <PageSection type="primary">
          <Heading title={product.name} size="xxl" />

          <View style={styles.mainImageWrapper}>
            <TouchableOpacity onPress={() => openImageViewer(0)}>
              <Image
                source={{ uri: mainImage.src }}
                style={styles.mainImage}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          <Text style={styles.shortDescription}>{product.short_description}</Text>

          <Button color={COLORS.secondary} title="Legg til i handlekurv" onPress={() => { }} />

        </PageSection>

        <PageSection type="primary">
          <Text style={styles.description}>{product.description}</Text>
          <View style={styles.categoryContainer}>
            {product.categories.map((category) => (
              <TouchableOpacity key={category.id} onPress={() => router.push(`/category?id=${category.id}&name=${category.name}`)}>
                <View style={styles.category}>
                  <Text style={styles.categoryText}>{category.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </PageSection>

        <PageSection type="secondary">
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

        <PageSection type="primary">
          <View style={styles.tagContainer}>
            {product.tags.map((tag) => (
              <TouchableOpacity key={tag.id} onPress={() => router.push(`/tag?id=${tag.id}&name=${tag.name}`)}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{tag.name}</Text>
                </View>
              </TouchableOpacity>
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
}

const styles = StyleSheet.create({
  content: {
    padding: SPACING.md,
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
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: SPACING.md,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: SPACING.md,
  },
  category: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    margin: SPACING.xs,
  },
  categoryText: {
    color: COLORS.textOnPrimary,
    fontSize: FONT_SIZES.sm,
  },

  tag: {
    backgroundColor: COLORS.accent,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    margin: SPACING.xs,
  },
  tagText: {
    color: COLORS.textOnAccent,
    fontSize: FONT_SIZES.sm,
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