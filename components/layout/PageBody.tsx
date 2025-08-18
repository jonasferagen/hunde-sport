// PageBody.tsx
import { spacePx } from '@/lib/helpers';
import React from 'react';
import { ScrollView, YStackProps } from 'tamagui';
import { ThemedYStack } from '../ui';

type SpaceToken = '$1' | '$2' | '$3' | '$4' | '$5' | 'none';

interface PageBodyProps extends YStackProps {
  children: React.ReactNode;
  mode?: 'scroll' | 'static';
  pad?: SpaceToken;                 // NEW: horizontal padding
}

export const PageBody = React.forwardRef<ScrollView, PageBodyProps>(
  ({ children, mode = 'static', pad = 'none', ...props }, ref) => {
    const padPx = pad === 'none' ? 0 : spacePx(pad);

    const content = (
      <ThemedYStack
        box
        f={1}
        mih={0}
        gap="none"
        px={padPx}
        {...props}
      >
        {children}
      </ThemedYStack>
    );

    return mode === 'scroll' ? (
      <ScrollView
        ref={ref}
        f={1}
        showsVerticalScrollIndicator
        nestedScrollEnabled
        scrollsToTop
        contentContainerStyle={{ paddingHorizontal: padPx }}
      >
        {content}
      </ScrollView>
    ) : content;
  });
