// PageBody.tsx
import { spacePx } from '@/lib/helpers';
import React from 'react';
import { ScrollView as GHScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { YStackProps } from 'tamagui';
import { ThemedYStack } from '../ui';


type SpaceToken = '$1' | '$2' | '$3' | '$4' | '$5' | 'none';

interface PageBodyProps extends YStackProps {
  children: React.ReactNode;
  mode?: 'scroll' | 'static';
  pad?: SpaceToken;                 // NEW: horizontal padding
}

export const PageBody = React.forwardRef<GHScrollView, PageBodyProps>(
  ({ children, mode = 'static', pad = 'none', ...props }, ref) => {
    const padPx = pad === 'none' ? 0 : spacePx(pad);
    const insets = useSafeAreaInsets();
    const bottomInset = insets.bottom;
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
      <GHScrollView
        ref={ref}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: padPx,   // padding only here in scroll mode
          paddingBottom: bottomInset, // keep content above the bottom bar
        }}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
        // iOS-only; helps prevent diagonal conflict
        directionalLockEnabled
        // optional “quiet” feel:
        bounces={false}
        overScrollMode="never"
        scrollEventThrottle={16}
        showsVerticalScrollIndicator
      >
        {content}
      </GHScrollView>
    ) : content;
  });
