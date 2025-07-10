import Product from '@/components/features/product/Product';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { useBreadcrumbs } from '@/context/BreadCrumb/BreadcrumbProvider';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import PageView from "../components/ui/PageView";


export default function ProductScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const { breadcrumbs, setTrail } = useBreadcrumbs();
  useEffect(() => {
    setTrail({ id: Number(id), name, type: 'product' });
  }, [id, name, setTrail]);


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
      <Product productId={Number(id)} />
    </PageView>
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
