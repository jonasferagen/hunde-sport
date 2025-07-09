import Breadcrumbs from '@/components/Breadcrumbs';
import ProductTitle from '@/components/product/ProductTitle';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';

import { useBreadcrumbs } from '@/context/BreadcrumbContext/BreadcrumbProvider';

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string; name: string }>();
  const { breadcrumbs, setTrail } = useBreadcrumbs();

  return (
    <ScrollView>
      <Stack.Screen options={{ title: id }} />
      <Breadcrumbs
        trail={breadcrumbs}
        onNavigate={(crumb) => {
          setTrail(crumb);
          if (crumb.id === null) {
            router.replace('/');
          } else if (crumb.type === 'productCategory') {
            router.push({ pathname: './productCategory', params: { id: crumb.id.toString(), name: crumb.name } });
          }
        }}
      />
      <ProductTitle name={id} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'red',
  },
});
