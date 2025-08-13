import React from 'react';
import { ScrollView } from 'react-native';
import { Theme, YStack, YStackProps } from 'tamagui';

interface PageBodyProps extends YStackProps {
  children: React.ReactNode;
  scrollable?: boolean;

}

export const PageBody = React.forwardRef<ScrollView, PageBodyProps>(({ children, scrollable, ...props }, ref) => {


  if (scrollable) {
    return <ScrollView
      ref={ref}
      showsVerticalScrollIndicator={true}
      nestedScrollEnabled={true}
      scrollsToTop={true}
    >
      <PageBodyContent {...props}>{children}</PageBodyContent>
    </ScrollView>
  }

  return <PageBodyContent {...props}>{children}</PageBodyContent>;
});

const PageBodyContent = ({ children }: { children: React.ReactNode }) => {

  return <Theme name="neutral">
    <YStack f={1}>{children}</YStack>
  </Theme>;
};