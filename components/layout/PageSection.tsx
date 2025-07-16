
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
interface PageSectionProps {
  children: React.ReactNode;
  style?: ViewStyle;
  flex?: boolean;
  scrollable?: boolean;
};

export const PageSection = ({ children, style, flex, scrollable }: PageSectionProps) => {



  if (scrollable) {
    return (
      <ScrollView
        contentContainerStyle={[styles.scrollContentContainer, style]}
        showsVerticalScrollIndicator={true}
        scrollEventThrottle={16}
        nestedScrollEnabled={true}
        scrollsToTop={true}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View style={[flex ? styles.flexContainer : styles.container, style]}>
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
    // Add any specific styles for scrollable content here
  },
});
