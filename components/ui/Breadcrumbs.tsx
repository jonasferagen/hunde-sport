import type { Breadcrumb } from '@/types';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BreadcrumbsProps {
  trail: Breadcrumb[];
  onNavigate: (crumb: Breadcrumb) => void;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ trail, onNavigate }) => {
  // Add the 'Home' breadcrumb to the beginning of the trail
  const fullTrail: Breadcrumb[] = [{ id: null, name: 'Hjem', type: 'category' }, ...trail];

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {fullTrail.map((breadcrumb, index) => (
          <View key={`${breadcrumb.type}-${breadcrumb.id}`} style={styles.breadcrumbItem}>
            {breadcrumb.type === 'product' ? (
              <Text style={[styles.breadcrumbText, styles.breadcrumbProductText]}>{breadcrumb.name}</Text>
            ) : (
              <TouchableOpacity onPress={() => onNavigate(breadcrumb)}>
                <Text style={styles.breadcrumbText}>{breadcrumb.name}</Text>
              </TouchableOpacity>
            )}
            {index < fullTrail.length - 1 && <Text style={[styles.breadcrumbText, styles.separator]}>{' < '}</Text>}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

import { COLORS } from '@/styles/Colors';
import { SPACING } from '@/styles/Theme';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: COLORS.backgroundSecondary,
  },
  breadcrumbItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breadcrumbText: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },

  breadcrumbProductText: {
    color: COLORS.textSecondary,
  },

  separator: {
    marginHorizontal: SPACING.xs
  },
});

export default Breadcrumbs;
