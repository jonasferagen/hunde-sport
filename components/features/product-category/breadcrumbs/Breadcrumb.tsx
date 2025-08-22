// Breadcrumb.tsx
import { Link } from 'expo-router';
import React from 'react';
import { ThemedText, ThemedXStack } from '@/components/ui';
import { ProductCategory } from '@/domain/ProductCategory';
import { useCanonicalNavigation } from '@/hooks/useCanonicalNavigation';
import { ChevronRight } from '@tamagui/lucide-icons';
import { H3, H5 } from 'tamagui';

interface BreadcrumbProps {
  productCategory?: ProductCategory;
  isLast?: boolean;
  isLastClickable?: boolean;
}

export const Breadcrumb = React.memo(
  ({ productCategory, isLast = false, isLastClickable = false }: BreadcrumbProps) => {
    const { linkProps } = useCanonicalNavigation();
    if (!productCategory) return null;

    const text = (
      <H3
        p="$3"
        fow={isLast && !isLastClickable ? 'normal' : 'bold'}
        textDecorationLine={isLast ? 'none' : 'underline'}
        numberOfLines={1}
      >
        {productCategory.name}
      </H3>
    );

    return (
      <ThemedXStack ai="center" gap="$1">
        {isLast && !isLastClickable ? (
          text
        ) : (
          <Link {...linkProps('product-category', productCategory)} asChild>
            {text}
          </Link>
        )}
      </ThemedXStack>
    );
  }
);
