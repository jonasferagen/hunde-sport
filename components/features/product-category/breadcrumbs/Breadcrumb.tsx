import { Link } from 'expo-router';
import React from 'react';

import { ThemedText, ThemedXStack } from '@/components/ui';
import { ProductCategory } from '@/domain/ProductCategory';
import { useCanonicalNav } from '@/hooks/useCanonicalNav';
import { ChevronRight } from '@tamagui/lucide-icons';

interface BreadcrumbProps {
  productCategory?: ProductCategory;
  isLast?: boolean;
  isLastClickable?: boolean;
}

export const Breadcrumb = React.memo(({ productCategory,
  isLast = false,
  isLastClickable = false,

}: BreadcrumbProps) => {

  const breadcrumbText = (
    <ThemedText
      size="$6"
      fow={isLast && !isLastClickable ? 'normal' : 'bold'}
      textDecorationLine={isLast ? 'none' : 'underline'}>
      {productCategory?.name}
    </ThemedText>
  );

  if (!productCategory) {
    return null;
  }


  const { linkProps } = useCanonicalNav();

  return (
    <ThemedXStack gap="none">
      {isLast && !isLastClickable ? (
        breadcrumbText
      ) : (
        <Link {...linkProps('product-category', productCategory)} asChild>
          {breadcrumbText}
        </Link>
      )}
      {!isLast && (
        <ChevronRight size="$2" />
      )}
    </ThemedXStack>
  );
});
