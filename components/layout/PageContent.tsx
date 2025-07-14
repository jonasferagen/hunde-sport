// components/ui/PageContent.tsx
import { SPACING } from '@/styles';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';

interface PageContentProps {
  children: React.ReactNode;
  scrollable?: boolean;
  flex?: boolean;
  style?: ViewStyle;
}

export const PageContent = ({ children, scrollable, flex, style }: PageContentProps) => {
  if (scrollable) {
    return (
      <ScrollView
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={true}
        scrollEventThrottle={16}
        nestedScrollEnabled={true}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.container, flex && styles.flexContainer, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  flexContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: SPACING.md, // Add some padding at the bottom
    borderWidth: 1,
    borderColor: 'red',
  },
});