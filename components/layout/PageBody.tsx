import React from 'react';

import { ScrollView, YStackProps } from 'tamagui';
import { ThemedYStack } from '../ui';

interface PageBodyProps extends YStackProps {
  children: React.ReactNode;
  mode?: 'scroll' | 'static';
}

export const PageBody = React.forwardRef<ScrollView, PageBodyProps>(({ children, mode = 'scroll', ...props }, ref) => {


  const content = (
    <ThemedYStack
      f={1}
      mih={0}
      gap="none"
      {...props}
    >
      {children}
    </ThemedYStack>
  );


  return mode === 'scroll' ? (
    <ScrollView
      f={1}
      ref={ref}
      showsVerticalScrollIndicator={true}
      nestedScrollEnabled={true}
      scrollsToTop={true}
    >
      {content}
    </ScrollView>
  ) : content

});

