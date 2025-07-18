import { LayoutContext, useLayout } from '@/contexts/LayoutProvider';
import React, { useState } from 'react';
import { LayoutChangeEvent, ScrollView, StyleSheet, View, ViewStyle } from 'react-native';

interface PageSectionProps {
  children: React.ReactNode;
  style?: ViewStyle;
  flex?: boolean;
  scrollable?: boolean;
};

export const PageSection = React.forwardRef<ScrollView, PageSectionProps>(({ children, style, flex, scrollable }, ref) => {
  const parentLayout = useLayout();
  const [layout, setLayout] = useState({ width: 0, height: 0 });

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (layout.width !== width || layout.height !== height) {
      setLayout({ width, height });
    }
  };

  if (scrollable) {
    return (
      <ScrollView
        ref={ref}
        contentContainerStyle={[styles.scrollContentContainer, style]}
        showsVerticalScrollIndicator={true}
        scrollEventThrottle={16}
        nestedScrollEnabled={true}
        scrollsToTop={true}
        onLayout={handleLayout}
      >
        <LayoutContext.Provider value={{ insets: parentLayout.insets, layout }}>
          {children}
        </LayoutContext.Provider>
      </ScrollView>
    );
  }

  return (
    <View style={[flex ? styles.flexContainer : styles.container, style]} onLayout={handleLayout}>
      <LayoutContext.Provider value={{ insets: parentLayout.insets, layout }}>
        {children}
      </LayoutContext.Provider>
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
