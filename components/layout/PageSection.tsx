import React from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';

interface PageSectionProps {
  children: React.ReactNode;
  style?: ViewStyle;
  flex?: boolean;
  scrollable?: boolean;
};

export const PageSection = React.forwardRef<ScrollView, PageSectionProps>(({ children, style, flex, scrollable }, ref) => {

  if (scrollable) {
    return (
      <ScrollView
        ref={ref}
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
});

const styles = StyleSheet.create({
  container: {},
  flexContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    // Add any specific styles for scrollable content here
  },
});
