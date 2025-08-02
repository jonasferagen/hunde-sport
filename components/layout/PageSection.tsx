import React from 'react';
import { ScrollView } from 'react-native';
import { YStack, YStackProps } from 'tamagui';

interface PageSectionProps extends YStackProps {
  children: React.ReactNode;
  scrollable?: boolean;

}

export const PageSection = React.forwardRef<ScrollView, PageSectionProps>(({ children, scrollable, ...props }, ref) => {
  if (scrollable) {
    return <ScrollView
      ref={ref}
      showsVerticalScrollIndicator={true}
      nestedScrollEnabled={true}
      scrollsToTop={true}
    >
      <YStack {...props}>{children}</YStack>
    </ScrollView>
  }

  return <YStack {...props}>{children}</YStack>;
});
