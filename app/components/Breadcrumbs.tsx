import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Breadcrumb } from '../../types';

interface BreadcrumbsProps {
  trail: Breadcrumb[];
  onNavigate: (id: number | null) => void;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ trail, onNavigate }) => {
  const handlePress = (id: number | null) => {
    onNavigate(id);
    if (id === null) {
      router.replace('/');
    } else {
      // Find the breadcrumb to get the name
      const breadcrumb = trail.find(b => b.id === id);
      router.push({ pathname: '/categoryPage', params: { id: id.toString(), name: breadcrumb?.name || '' } });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {trail.map((breadcrumb, index) => (
          <View key={breadcrumb.id} style={styles.breadcrumbItem}>
            <TouchableOpacity onPress={() => handlePress(breadcrumb.id)}>
              <Text style={styles.breadcrumbText}>{breadcrumb.name}</Text>
            </TouchableOpacity>
            {index < trail.length - 1 && <Text style={styles.separator}>{' > '}</Text>}
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
