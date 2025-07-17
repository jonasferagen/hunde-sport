import { Heading } from '@/components/ui';
import { SPACING } from '@/styles';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimatePresence, View as MotiView } from 'moti';
import React, { Children, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
  ViewProps
} from 'react-native';


interface PageContentHorizontalProps extends ViewProps {
  title?: string;
  children: React.ReactNode;
}

export const PageContentHorizontal = ({ title = undefined, children, style, ...props }: PageContentHorizontalProps) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [scrollViewWidth, setScrollViewWidth] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollPosition(event.nativeEvent.contentOffset.x);
  };

  const showLeftGradient = scrollPosition > 10;
  const showRightGradient =
    contentWidth > scrollViewWidth &&
    scrollPosition < contentWidth - scrollViewWidth - 10;

  return (
    <View style={[styles.horizontalContainer, style]}>
      <Heading title={title} style={{ marginBottom: SPACING.md }} />
      <View>
        <AnimatePresence>
          {showLeftGradient && (
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={[styles.gradient, styles.leftGradient]}
              pointerEvents="none"
            >
              <LinearGradient
                colors={['rgba(240, 240, 230, 1)', 'rgba(240, 240, 230, 0)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientInner}
              />
            </MotiView>
          )}
        </AnimatePresence>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onContentSizeChange={setContentWidth}
          onLayout={(event) =>
            setScrollViewWidth(event.nativeEvent.layout.width)
          }
          contentContainerStyle={styles.scrollViewContent}
          {...props}
        >
          {Children.toArray(children).filter(child => Boolean(child))}
        </ScrollView>
        <AnimatePresence>
          {showRightGradient && (
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={[styles.gradient, styles.rightGradient]}
              pointerEvents="none"
            >
              <LinearGradient
                colors={['rgba(240, 240, 230, 0)', 'rgba(240, 240, 230, 1)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientInner}
              />
            </MotiView>
          )}
        </AnimatePresence>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  horizontalContainer: {
    position: 'relative',
  },
  scrollViewContent: {
    paddingHorizontal: 2, // Small padding to avoid touching the gradients
  },
  gradient: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 50,
    zIndex: 1,
  },
  gradientInner: {
    flex: 1,
  },
  leftGradient: {
    left: -SPACING.md,
  },
  rightGradient: {
    right: -SPACING.md,
  },
});
