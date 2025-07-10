import ProductImage from '@/components/features/product/_productImage';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import FullScreenLoader from '@/components/ui/FullScreenLoader';
import PageSection from '@/components/ui/PageSection';
import { useBreadcrumbs } from '@/context/BreadCrumb/BreadcrumbProvider';
import { useProduct } from '@/context/Product/Product';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import PageView from "../components/ui/PageView";
import Heading from "../components/ui/_heading";

export default function ProductScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const { breadcrumbs, setTrail } = useBreadcrumbs();

  useEffect(() => {
    setTrail({ id: Number(id), name, type: 'product' });
  }, [id, name, setTrail]);

  const { data, isLoading, error } = useProduct(Number(id));

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (error) {
    return <FullScreenLoader />;
  }

  const product = data!;
  const image = product.images[0];

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

      <PageSection type="primary">
        <Heading title={product.name} size="xxl" />

        <View style={styles.mainImageWrapper}>
          <Image
            source={{ uri: image.src }}
            style={styles.mainImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.price}>{formatPrice(product.price)}</Text>;
        <Text style={styles.shortDescription}>{product.short_description}</Text>

      </PageSection>

      <PageSection type="secondary">
        <Text style={styles.description}>{product.description}</Text>
      </PageSection>

      <FlatList
        data={product.images.slice(1)}
        renderItem={({ item }) => <ProductImage image={item} />}
      />
    </PageView>
  );
}

import { BORDER_RADIUS, SPACING } from '@/styles/Dimensions';
import { FONT_SIZES } from '@/styles/Typography';
import { formatPrice } from '@/utils/helpers';

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

});


