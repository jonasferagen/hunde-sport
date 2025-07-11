// components/ui/PageContent.tsx
import { ScrollView, StyleSheet } from 'react-native';

interface PageContentProps {
  children: React.ReactNode;
}

export default function PageContent({ children }: PageContentProps) {
  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={true}
      scrollEventThrottle={16}
      nestedScrollEnabled={true}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  contentContainer: {
    paddingBottom: 20, // Add some padding at the bottom
  },
});