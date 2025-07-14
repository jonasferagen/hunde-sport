// components/ui/PageContent.tsx
import { ScrollView, StyleSheet, View } from 'react-native';

interface PageContentProps {
  children: React.ReactNode;
  scrollable?: boolean;
}

export const PageContent = ({ children, scrollable }: PageContentProps) => {
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
    <View style={styles.container}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 20, // Add some padding at the bottom
  },
});