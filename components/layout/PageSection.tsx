import React from 'react';
import { ScrollView } from 'react-native';
import { YStack, YStackProps } from 'tamagui';

interface PageSectionProps extends YStackProps {
  children: React.ReactNode;
  scrollable?: boolean;
  flex?: number;
}

export const PageSection = React.forwardRef<ScrollView, PageSectionProps>(({ children, scrollable, flex = 1, ...props }, ref) => {
  if (scrollable) {
    return (
      <ScrollView ref={ref} showsVerticalScrollIndicator={true} nestedScrollEnabled={true} scrollsToTop={true}>
        <YStack {...props} flex={flex}>{children}</YStack>
      </ScrollView>
    );
  }

  return <YStack {...props} flex={flex}>{children}</YStack>;
});
