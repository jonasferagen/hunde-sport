// PageSection.tsx
import { spacePx } from '@/lib/helpers';
import React, { useMemo } from 'react';
import { YStackProps } from 'tamagui';
import { ThemedText } from '../ui';
import { ThemedYStack } from '../ui/themed-components/ThemedStack';

type PageSectionProps = YStackProps & {
  title?: string;
  /** Horizontal padding token for the section container */
  p?: '$1' | '$2' | '$3' | '$4' | '$5';
  /** Let only the content bleed to screen edges; title remains aligned */
  bleedX?: boolean;
  /** Reserve vertical space for the content to avoid layout shift */
  contentHeight?: number; // px
};

export const PageSection: React.FC<PageSectionProps> = ({
  title,
  children,
  p = '$3',
  bleedX = false,
  contentHeight,
  ...stackProps
}) => {
  const padPx = useMemo(() => spacePx(p), [p]);
  const hasChildren = React.Children.toArray(children).some(Boolean);
  if (!hasChildren) return null;

  return (
    <ThemedYStack box container  {...stackProps} >
      {title ? (
        <ThemedText size="$6"  >
          {title}
        </ThemedText>
      ) : null}

      {/* Content wrapper: either padded or full-bleed via negative margins */}
      <ThemedYStack
        // normal padded content
        px={bleedX ? undefined : padPx}
        // bleed to edges by canceling the container padding
        mx={bleedX ? -padPx : undefined}
        // optionally reserve a fixed height to avoid shift
        h={contentHeight}
      >
        {children}
      </ThemedYStack>
    </ThemedYStack>
  );
};
