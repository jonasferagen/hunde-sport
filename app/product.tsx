import { Breadcrumbs, FullScreenLoader, Heading, PageContent, PageSection, PageView } from '@/components/ui/_index';
import { useBreadcrumbs } from '@/context/BreadCrumb/BreadcrumbProvider';
import { useProduct } from '@/context/Product/Product';
import { formatPrice } from '@/utils/helpers';
import { Image } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ImageViewing from 'react-native-image-viewing';

import { BORDER_RADIUS, SPACING } from '@/styles/Dimensions';
import { FONT_SIZES } from '@/styles/Typography';

const styles = StyleSheet.create({
  content: {
    padding: SPACING.md,
  },

  mainImageWrapper: {
    width: '100%',
    height: 300,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: BORDER_RADIUS.md,
  },
  mainImage: {
    height: '100%',
  },

  name: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    fontSize: FONT_SIZES.sm,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  shortDescription: {
    fontSize: FONT_SIZES.md,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: SPACING.md,
  },
  tag: {
    backgroundColor: '#e0e0e0',
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    margin: SPACING.xs,
  },
  tagText: {
    color: '#333',
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
    resizeMode: 'contain',
  },

});

export default function ProductScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const { breadcrumbs, setTrail } = useBreadcrumbs();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageViewerVisible, setImageViewerVisible] = useState(false);

  const { data, isLoading, error } = useProduct(Number(id));


  useEffect(() => {
    setTrail({ id: Number(id), name, type: 'product' });
  }, [id, name, setTrail]);


  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (error) {
    return <FullScreenLoader />;
  }

  const product = data!;

  if (product.images.length === 0) {
    product.images.push({ src: '' });
  }
  const mainImage = product.images[0];
  const allImages = product.images.map(img => ({ uri: img.src }));

  const openImageViewer = (index: number) => {
    setCurrentImageIndex(index);
    setImageViewerVisible(true);
  };

  return (
    <PageView>

      <Stack.Screen options={{ title: name }} />
      <Breadcrumbs
        trail={breadcrumbs}
        onNavigate={(crumb) => {
          setTrail(crumb);
          if (crumb.id === null) {
            router.replace('/');
          } else if (crumb.type === 'category') {
            router.push({ pathname: './category', params: { id: crumb.id.toString(), name: crumb.name } });
          }
        }}
      />
      <PageContent>
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
          <Button title="Legg til i handlekurv" onPress={() => { }} />

        </PageSection>

        <PageSection type="secondary">
          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.tagContainer}>
            {product.tags.map((tag) => (
              <View key={tag.id} style={styles.tag}>
                <Text style={styles.tagText}>{tag.name}</Text>
              </View>
            ))}
          </View>
        </PageSection>

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
