import type { Breadcrumb } from '@/types';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BreadcrumbsProps {
  trail: Breadcrumb[];
  onNavigate: (crumb: Breadcrumb) => void;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ trail, onNavigate }) => {
  // Add the 'Home' breadcrumb to the beginning of the trail
  const fullTrail: Breadcrumb[] = [{ id: null, name: 'Hjem', type: 'productCategory' }, ...trail];

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {fullTrail.map((breadcrumb, index) => (
          <View key={`${breadcrumb.type}-${breadcrumb.id}`} style={styles.breadcrumbItem}>
            <TouchableOpacity onPress={() => onNavigate(breadcrumb)}>
              <Text style={styles.breadcrumbText}>{breadcrumb.name}</Text>
            </TouchableOpacity>
            {index < fullTrail.length - 1 && <Text style={styles.separator}>{' > '}</Text>}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  breadcrumbItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breadcrumbText: {
    fontSize: 16,
    color: '#007bff',
  },
  separator: {
    fontSize: 16,
    marginHorizontal: 4,
    color: '#6c757d',
  },
});

export default Breadcrumbs;
