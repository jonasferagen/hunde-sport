import React from 'react';

import { ScrollView, YStackProps } from 'tamagui';
import { ThemedYStack } from '../ui';

interface PageBodyProps extends YStackProps {
  children: React.ReactNode;
  scrollable?: boolean;

}

export const PageBody = React.forwardRef<ScrollView, PageBodyProps>(({ children, scrollable = true, ...props }, ref) => {


  const content = (
    <ThemedYStack {...props} gap="none" mih="100%">
      {children}
    </ThemedYStack>
  );


  if (scrollable) {
    return (
      <ScrollView
        ref={ref}
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={true}
        scrollsToTop={true}
      >
        {content}
      </ScrollView>
    )
  }

  return content;

});

